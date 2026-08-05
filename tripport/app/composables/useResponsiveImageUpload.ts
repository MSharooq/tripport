import type { SupabaseClient } from '@supabase/supabase-js'
import type { ResponsiveImageAsset, ResponsiveImageVariants } from '~/data/images'
import { TRIPPORT_IMAGE_VARIANT_ORDER } from '~/composables/useImageProcessing'

export interface UploadedTripportImage extends ResponsiveImageAsset {
  url: string
  variants: ResponsiveImageVariants
  width: number
  height: number
}

export interface ResponsiveImageUploadOptions {
  /** Storage folder, for example `packages/pkg-123` or `guides/kerala-routes`. */
  folder: string
  bucket?: string
}

function normaliseFolder(folder: string) {
  return folder.replace(/^\/+|\/+$/g, '')
}

function uploadErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'The optimized image could not be uploaded. Please try again.'
}

/**
 * One shared upload path for all manager editors. Processing is kept entirely
 * in the browser; Supabase receives only immutable, optimized WebP variants.
 */
export function useResponsiveImageUpload() {
  const processor = useImageProcessing()

  async function upload(file: File, supabase: SupabaseClient, options: ResponsiveImageUploadOptions): Promise<UploadedTripportImage> {
    const bucket = options.bucket || 'tripport-media'
    const folder = normaliseFolder(options.folder)
    if (!folder) throw new Error('A storage folder is required for image upload.')

    const processed = await processor.processImage(file)
    const uploadId = crypto.randomUUID()
    const uploadedPaths: string[] = []
    const variants: ResponsiveImageVariants = {}

    processor.beginUpload(TRIPPORT_IMAGE_VARIANT_ORDER.length)

    try {
      for (const [index, variantName] of TRIPPORT_IMAGE_VARIANT_ORDER.entries()) {
        const variant = processed.variants[variantName]
        const path = `${folder}/${uploadId}/${variantName}.webp`
        const { error } = await supabase.storage.from(bucket).upload(path, variant.file, {
          upsert: false,
          contentType: variant.file.type,
          cacheControl: '31536000',
        })

        if (error) throw error
        uploadedPaths.push(path)
        const { data } = supabase.storage.from(bucket).getPublicUrl(path)
        variants[variantName] = {
          url: data.publicUrl,
          width: variant.dimensions.width,
          height: variant.dimensions.height,
        }
        processor.reportUploadProgress(index + 1, TRIPPORT_IMAGE_VARIANT_ORDER.length)
      }

      const hero = processed.variants.hero
      processor.complete('Optimized image uploaded.')
      return {
        url: (variants.hero as { url: string }).url,
        variants,
        width: hero.dimensions.width,
        height: hero.dimensions.height,
      }
    } catch (cause) {
      if (uploadedPaths.length) {
        await supabase.storage.from(bucket).remove(uploadedPaths)
      }
      const message = uploadErrorMessage(cause)
      processor.fail(message)
      throw new Error(message)
    }
  }

  return {
    ...processor,
    upload,
  }
}
