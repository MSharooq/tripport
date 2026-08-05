import { responsiveImageWidths, type ResponsiveImageVariant } from '~/data/images'
import imageCompressionWorkerUrl from 'browser-image-compression/dist/browser-image-compression.js?url'

/**
 * Browser-side image variants used throughout Tripport.
 *
 * The dimensions are based on the current layouts:
 * - card: itinerary cards reach about 413 CSS px in the desktop grid and 684 px
 *   when single-column, so 960 px remains usable on high-density screens.
 * - gallery: detail and guide content can occupy roughly 720 CSS px, so 1440 px
 *   covers a 2x display.
 * - hero: 1920 px is the appropriate upper bound for the full-width hero while
 *   keeping the largest public image around 1 MB.
 *
 * Processing runs in the manager's browser. The source image is never sent to
 * a server: only the generated WebP files are uploaded to Supabase.
 */

export const TRIPPORT_IMAGE_VARIANT_ORDER = ['card', 'gallery', 'hero'] as const

export type TripportImageVariantName = ResponsiveImageVariant

export interface TripportImageVariantSpec {
  label: string
  maxWidthOrHeight: number
  maxSizeMB: number
  initialQuality: number
}

export const TRIPPORT_IMAGE_VARIANT_SPECS: Record<TripportImageVariantName, TripportImageVariantSpec> = {
  card: {
    label: 'Card image',
    maxWidthOrHeight: responsiveImageWidths.card,
    maxSizeMB: 0.35,
    initialQuality: 0.8,
  },
  gallery: {
    label: 'Gallery image',
    maxWidthOrHeight: responsiveImageWidths.gallery,
    maxSizeMB: 0.75,
    initialQuality: 0.82,
  },
  hero: {
    label: 'Hero image',
    maxWidthOrHeight: responsiveImageWidths.hero,
    maxSizeMB: 1,
    initialQuality: 0.84,
  },
}

export const TRIPPORT_IMAGE_MIME_TYPE = 'image/webp'
export const TRIPPORT_MAX_SOURCE_IMAGE_BYTES = 15 * 1024 * 1024

const ACCEPTED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])
const COMPRESSION_PROGRESS_CEILING = 70

export interface TripportImageDimensions {
  width: number
  height: number
}

export interface ProcessedTripportImageVariant {
  name: TripportImageVariantName
  file: File
  dimensions: TripportImageDimensions
  size: number
}

export interface ProcessedTripportImage {
  source: {
    name: string
    size: number
    dimensions: TripportImageDimensions
  }
  variants: Record<TripportImageVariantName, ProcessedTripportImageVariant>
}

export type ImageProcessingPhase = 'idle' | 'preparing' | 'compressing' | 'ready' | 'uploading' | 'complete' | 'error'

export interface ImageProcessingProgress {
  phase: ImageProcessingPhase
  percentage: number
  message: string
  activeVariant: TripportImageVariantName | null
  completedVariants: number
  totalVariants: number
}

export interface ProcessTripportImageOptions {
  /** Receives the same updates exposed by the composable's `progress` ref. */
  onProgress?: (progress: ImageProcessingProgress) => void
  /** Cancels the active browser-side compression operation. */
  signal?: AbortSignal
}

function initialProgress(): ImageProcessingProgress {
  return {
    phase: 'idle',
    percentage: 0,
    message: '',
    activeVariant: null,
    completedVariants: 0,
    totalVariants: TRIPPORT_IMAGE_VARIANT_ORDER.length,
  }
}

function getVariantFileName(source: File, variant: TripportImageVariantName) {
  const fileBaseName = source.name
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase() || 'tripport-image'

  return `${fileBaseName}-${variant}.webp`
}

function isAbortError(error: unknown) {
  return error instanceof DOMException
    ? error.name === 'AbortError'
    : typeof error === 'object' && error !== null && 'name' in error && error.name === 'AbortError'
}

function throwIfAborted(signal: AbortSignal) {
  if (signal.aborted) throw new DOMException('Image processing was cancelled.', 'AbortError')
}

async function getImageDimensions(file: Blob): Promise<TripportImageDimensions> {
  if ('createImageBitmap' in window) {
    const bitmap = await createImageBitmap(file)
    const dimensions = { width: bitmap.width, height: bitmap.height }
    bitmap.close()
    return dimensions
  }

  return await new Promise<TripportImageDimensions>((resolve, reject) => {
    const sourceUrl = URL.createObjectURL(file)
    const image = new Image()

    image.onload = () => {
      URL.revokeObjectURL(sourceUrl)
      resolve({ width: image.naturalWidth, height: image.naturalHeight })
    }
    image.onerror = () => {
      URL.revokeObjectURL(sourceUrl)
      reject(new Error('The selected file could not be read as an image.'))
    }
    image.src = sourceUrl
  })
}

export function isSupportedTripportImage(file: File) {
  return ACCEPTED_IMAGE_TYPES.has(file.type.toLowerCase())
}

/**
 * Generates card, gallery and hero WebP assets on the manager's device.
 *
 * `processImage()` reserves the last 30% of the progress bar for direct
 * Supabase uploads. Call `beginUpload()`, `reportUploadProgress()` and
 * `complete()` after the variants have been generated to keep one continuous,
 * understandable progress UI for the manager.
 */
export function useImageProcessing() {
  // Shared so every manager editor can display one consistent, visible upload
  // status bar without duplicating progress UI in each form.
  const progress = useState<ImageProcessingProgress>('tripport-manager-image-progress', initialProgress)
  const error = ref<string | null>(null)
  const isProcessing = ref(false)
  let abortController: AbortController | null = null
  let completionTimer: ReturnType<typeof setTimeout> | undefined
  let uploadTotal: number = TRIPPORT_IMAGE_VARIANT_ORDER.length
  let progressCallback: ProcessTripportImageOptions['onProgress']

  function updateProgress(next: ImageProcessingProgress) {
    progress.value = next
    progressCallback?.(next)
  }

  function reset() {
    if (completionTimer) clearTimeout(completionTimer)
    abortController?.abort()
    abortController = null
    error.value = null
    isProcessing.value = false
    updateProgress(initialProgress())
    progressCallback = undefined
  }

  function cancel() {
    abortController?.abort()
  }

  function beginUpload(total = TRIPPORT_IMAGE_VARIANT_ORDER.length) {
    uploadTotal = Math.max(1, total)
    error.value = null
    isProcessing.value = true
    updateProgress({
      phase: 'uploading',
      percentage: COMPRESSION_PROGRESS_CEILING,
      message: 'Uploading optimized images…',
      activeVariant: null,
      completedVariants: 0,
      totalVariants: uploadTotal,
    })
  }

  function reportUploadProgress(completed: number, total = uploadTotal) {
    uploadTotal = Math.max(1, total)
    const completedVariants = Math.min(Math.max(completed, 0), uploadTotal)
    const percentage = Math.round(COMPRESSION_PROGRESS_CEILING + ((completedVariants / uploadTotal) * (100 - COMPRESSION_PROGRESS_CEILING)))

    updateProgress({
      phase: 'uploading',
      percentage: Math.min(99, percentage),
      message: completedVariants === uploadTotal
        ? 'Finalizing uploaded images…'
        : `Uploading optimized images (${completedVariants} of ${uploadTotal})…`,
      activeVariant: null,
      completedVariants,
      totalVariants: uploadTotal,
    })
  }

  function complete(message = 'Images are ready.') {
    abortController = null
    error.value = null
    isProcessing.value = false
    updateProgress({
      phase: 'complete',
      percentage: 100,
      message,
      activeVariant: null,
      completedVariants: uploadTotal,
      totalVariants: uploadTotal,
    })
    progressCallback = undefined
    if (completionTimer) clearTimeout(completionTimer)
    completionTimer = setTimeout(() => {
      if (progress.value.phase === 'complete') updateProgress(initialProgress())
    }, 2200)
  }

  function fail(message: string) {
    abortController = null
    error.value = message
    isProcessing.value = false
    updateProgress({
      phase: 'error',
      percentage: progress.value.percentage,
      message,
      activeVariant: null,
      completedVariants: progress.value.completedVariants,
      totalVariants: progress.value.totalVariants,
    })
    progressCallback = undefined
    if (completionTimer) clearTimeout(completionTimer)
    completionTimer = setTimeout(() => {
      if (progress.value.phase === 'error') updateProgress(initialProgress())
    }, 5000)
  }

  async function processImage(source: File, options: ProcessTripportImageOptions = {}): Promise<ProcessedTripportImage> {
    if (import.meta.server) throw new Error('Image processing is only available in the browser.')
    if (isProcessing.value) throw new Error('Another image is already being processed.')
    if (!isSupportedTripportImage(source)) throw new Error('Choose a JPEG, PNG or WebP image.')
    if (!source.size) throw new Error('Choose an image file that is not empty.')
    if (source.size > TRIPPORT_MAX_SOURCE_IMAGE_BYTES) throw new Error('Choose an image smaller than 15 MB.')

    const controller = new AbortController()
    const abortFromExternalSignal = () => controller.abort()
    abortController = controller
    progressCallback = options.onProgress
    options.signal?.addEventListener('abort', abortFromExternalSignal, { once: true })

    isProcessing.value = true
    error.value = null
    updateProgress({
      phase: 'preparing',
      percentage: 0,
      message: 'Preparing your image…',
      activeVariant: null,
      completedVariants: 0,
      totalVariants: TRIPPORT_IMAGE_VARIANT_ORDER.length,
    })

    try {
      throwIfAborted(controller.signal)
      const sourceDimensions = await getImageDimensions(source)
      throwIfAborted(controller.signal)

      const { default: imageCompression } = await import('browser-image-compression')
      const variants = {} as Record<TripportImageVariantName, ProcessedTripportImageVariant>

      for (const [index, name] of TRIPPORT_IMAGE_VARIANT_ORDER.entries()) {
        const spec = TRIPPORT_IMAGE_VARIANT_SPECS[name]
        const compressionStart = (index / TRIPPORT_IMAGE_VARIANT_ORDER.length) * COMPRESSION_PROGRESS_CEILING
        const compressionRange = COMPRESSION_PROGRESS_CEILING / TRIPPORT_IMAGE_VARIANT_ORDER.length

        updateProgress({
          phase: 'compressing',
          percentage: Math.round(compressionStart),
          message: `Compressing ${spec.label.toLowerCase()} (${index + 1} of ${TRIPPORT_IMAGE_VARIANT_ORDER.length})…`,
          activeVariant: name,
          completedVariants: index,
          totalVariants: TRIPPORT_IMAGE_VARIANT_ORDER.length,
        })

        const compressed = await imageCompression(source, {
          maxSizeMB: spec.maxSizeMB,
          maxWidthOrHeight: spec.maxWidthOrHeight,
          initialQuality: spec.initialQuality,
          fileType: TRIPPORT_IMAGE_MIME_TYPE,
          preserveExif: false,
          useWebWorker: true,
          // Keep the worker library on Tripport's own deployment instead of
          // loading the package's default jsDelivr URL at upload time.
          libURL: imageCompressionWorkerUrl,
          maxIteration: 8,
          signal: controller.signal,
          onProgress: (variantPercentage) => {
            updateProgress({
              phase: 'compressing',
              percentage: Math.round(compressionStart + ((variantPercentage / 100) * compressionRange)),
              message: `Compressing ${spec.label.toLowerCase()} (${index + 1} of ${TRIPPORT_IMAGE_VARIANT_ORDER.length})…`,
              activeVariant: name,
              completedVariants: index,
              totalVariants: TRIPPORT_IMAGE_VARIANT_ORDER.length,
            })
          },
        })

        throwIfAborted(controller.signal)
        if (compressed.type !== TRIPPORT_IMAGE_MIME_TYPE) {
          throw new Error('This browser could not create a WebP image. Please use a current browser and try again.')
        }

        const file = new File([compressed], getVariantFileName(source, name), {
          type: TRIPPORT_IMAGE_MIME_TYPE,
          lastModified: source.lastModified,
        })

        variants[name] = {
          name,
          file,
          dimensions: await getImageDimensions(file),
          size: file.size,
        }
      }

      isProcessing.value = false
      abortController = null
      updateProgress({
        phase: 'ready',
        percentage: COMPRESSION_PROGRESS_CEILING,
        message: 'Images optimized. Ready to upload.',
        activeVariant: null,
        completedVariants: TRIPPORT_IMAGE_VARIANT_ORDER.length,
        totalVariants: TRIPPORT_IMAGE_VARIANT_ORDER.length,
      })

      return {
        source: {
          name: source.name,
          size: source.size,
          dimensions: sourceDimensions,
        },
        variants,
      }
    } catch (cause) {
      const message = controller.signal.aborted || isAbortError(cause)
        ? 'Image processing was cancelled.'
        : cause instanceof Error
          ? cause.message
          : 'The image could not be processed. Please try another file.'
      fail(message)
      throw cause instanceof Error ? cause : new Error(message)
    } finally {
      options.signal?.removeEventListener('abort', abortFromExternalSignal)
    }
  }

  return {
    progress: readonly(progress),
    error: readonly(error),
    isProcessing: readonly(isProcessing),
    processImage,
    beginUpload,
    reportUploadProgress,
    complete,
    fail,
    cancel,
    reset,
  }
}
