<script setup lang="ts">
import type { TestimonialSubmissionAttachmentInput, TestimonialSubmissionMediaType } from '~/data/testimonialSubmissions'

type PreparedUpload = {
  type: TestimonialSubmissionMediaType
  path: string
  token: string
}

type PrepareResponse = {
  accepted: boolean
  submissionId?: string
  uploads: PreparedUpload[]
  requiresCompletion?: boolean
}

const displayName = ref('')
const email = ref('')
const location = ref('')
const title = ref('')
const quote = ref('')
const rating = ref<number | null>(null)
const itinerarySlug = ref('')
const publicationConsent = ref(false)
const website = ref('')
const imageFile = ref<File | null>(null)
const videoFile = ref<File | null>(null)
const imagePreview = ref('')
const videoPreview = ref('')
const status = ref<'idle' | 'submitting' | 'success' | 'error'>('idle')
const message = ref('')
const progress = ref('')

const MAX_IMAGE_BYTES = 8 * 1024 * 1024
const MAX_VIDEO_BYTES = 25 * 1024 * 1024
const imageMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp'])
const videoMimeTypes = new Set(['video/mp4', 'video/webm', 'video/quicktime'])

function clearPreview(type: TestimonialSubmissionMediaType) {
  const preview = type === 'image' ? imagePreview : videoPreview
  if (preview.value) URL.revokeObjectURL(preview.value)
  preview.value = ''
}

function removeAttachment(type: TestimonialSubmissionMediaType) {
  clearPreview(type)
  if (type === 'image') imageFile.value = null
  else videoFile.value = null
}

function selectAttachment(event: Event, type: TestimonialSubmissionMediaType) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) return

  const allowed = type === 'image' ? imageMimeTypes : videoMimeTypes
  const maximum = type === 'image' ? MAX_IMAGE_BYTES : MAX_VIDEO_BYTES
  if (!allowed.has(file.type) || file.size > maximum) {
    status.value = 'error'
    message.value = type === 'image'
      ? 'Choose a JPG, PNG or WebP photo smaller than 8 MB.'
      : 'Choose an MP4, WebM or MOV video smaller than 25 MB.'
    return
  }

  removeAttachment(type)
  if (type === 'image') {
    imageFile.value = file
    imagePreview.value = URL.createObjectURL(file)
  } else {
    videoFile.value = file
    videoPreview.value = URL.createObjectURL(file)
  }
  status.value = 'idle'
  message.value = ''
}

function attachments(): TestimonialSubmissionAttachmentInput[] {
  return [
    imageFile.value && { type: 'image' as const, fileName: imageFile.value.name, mimeType: imageFile.value.type, sizeBytes: imageFile.value.size },
    videoFile.value && { type: 'video' as const, fileName: videoFile.value.name, mimeType: videoFile.value.type, sizeBytes: videoFile.value.size },
  ].filter((attachment): attachment is TestimonialSubmissionAttachmentInput => Boolean(attachment))
}

function uploadedFile(type: TestimonialSubmissionMediaType) {
  return type === 'image' ? imageFile.value : videoFile.value
}

function resetForm() {
  displayName.value = ''
  email.value = ''
  location.value = ''
  title.value = ''
  quote.value = ''
  rating.value = null
  itinerarySlug.value = ''
  publicationConsent.value = false
  website.value = ''
  removeAttachment('image')
  removeAttachment('video')
}

async function submit() {
  if (!rating.value) {
    status.value = 'error'
    message.value = 'Please choose a star rating before you submit your story.'
    return
  }
  if (!publicationConsent.value) {
    status.value = 'error'
    message.value = 'Please confirm that Tripport may review your story for publication.'
    return
  }

  status.value = 'submitting'
  message.value = ''
  progress.value = 'Preparing your review…'

  try {
    const prepared = await $fetch<PrepareResponse>('/api/testimonial-submissions/prepare', {
      method: 'POST',
      body: {
        displayName: displayName.value,
        email: email.value,
        location: location.value,
        title: title.value,
        quote: quote.value,
        rating: rating.value,
        itinerarySlug: itinerarySlug.value,
        publicationConsent: publicationConsent.value,
        website: website.value,
        attachments: attachments(),
      },
    })

    if (!prepared.submissionId) {
      status.value = 'success'
      message.value = 'Thank you for sharing your story.'
      resetForm()
      return
    }

    const supabase = useTripportSupabase()
    if (!supabase) throw new Error('Review uploads are not connected yet. Please try again shortly.')

    for (const [index, upload] of prepared.uploads.entries()) {
      const file = uploadedFile(upload.type)
      if (!file) throw new Error('A selected attachment is no longer available. Please try again.')
      progress.value = `Uploading ${upload.type === 'image' ? 'photo' : 'video'} ${index + 1} of ${prepared.uploads.length}…`
      const { error } = await supabase.storage.from('tripport-review-submissions').uploadToSignedUrl(upload.path, upload.token, file, {
        cacheControl: '3600',
        contentType: file.type,
        upsert: false,
      })
      if (error) throw error
    }

    if (prepared.requiresCompletion) {
      progress.value = 'Saving your review…'
      await $fetch('/api/testimonial-submissions/complete', {
        method: 'POST',
        body: { submissionId: prepared.submissionId },
      })
    }

    status.value = 'success'
    progress.value = ''
    message.value = 'Thank you—your story has been received. Our team will review it before it appears on Tripport.'
    resetForm()
  } catch (error) {
    status.value = 'error'
    progress.value = ''
    message.value = error instanceof Error ? error.message : 'We could not send your review. Please try again.'
  }
}

onBeforeUnmount(() => {
  clearPreview('image')
  clearPreview('video')
})
</script>

<template>
  <form class="review-form" novalidate @submit.prevent="submit">
    <div v-if="status === 'success'" class="review-form__success" role="status">
      <span><MaterialIcon name="check" :size="22" /></span>
      <div><strong>Story received.</strong><p>{{ message }}</p><button type="button" @click="status = 'idle'; message = ''">Share another story</button></div>
    </div>

    <template v-else>
      <div class="review-form__grid">
        <label class="review-field"><span>Your name <em>Required</em></span><input v-model="displayName" maxlength="100" autocomplete="name" placeholder="How should we introduce you?" required></label>
        <label class="review-field"><span>Email address <em>Required</em></span><input v-model="email" maxlength="254" type="email" autocomplete="email" placeholder="Only used if we need to follow up" required></label>
        <label class="review-field"><span>Where are you from? <small>Optional</small></span><input v-model="location" maxlength="100" autocomplete="address-level2" placeholder="e.g. Bengaluru"></label>
        <label class="review-field"><span>Journey or itinerary <small>Optional</small></span><input v-model="itinerarySlug" maxlength="160" placeholder="e.g. Kerala family holiday"></label>
        <label class="review-field review-field--wide"><span>Give your story a title <em>Required</em></span><input v-model="title" maxlength="140" placeholder="e.g. A beautifully paced Kerala escape" required></label>
        <label class="review-field review-field--wide"><span>Tell us about your experience <em>Required</em></span><textarea v-model="quote" maxlength="3000" rows="6" placeholder="What made your journey memorable?" required></textarea></label>
      </div>

      <fieldset class="review-rating">
        <legend>Your rating <em>Required</em><small>Choose from one to five stars.</small></legend>
        <div role="radiogroup" aria-label="Your rating">
          <button v-for="value in 5" :key="value" type="button" :class="{ 'is-selected': rating === value }" :aria-checked="rating === value" role="radio" :aria-label="`${value} out of 5 stars`" @click="rating = value"><MaterialIcon name="star" :size="22" /><span>{{ value }}</span></button>
        </div>
      </fieldset>

      <section class="review-media" aria-labelledby="review-media-heading">
        <div class="review-media__heading"><span id="review-media-heading">Add a memory <small>Optional</small></span><p>One photo (up to 8 MB) and one short video (up to 25 MB). Files stay private until your review is approved.</p></div>
        <div class="review-media__grid">
          <div class="review-upload">
            <img v-if="imagePreview" :src="imagePreview" alt="Selected review photo preview">
            <span v-else class="review-upload__placeholder"><MaterialIcon name="upload_file" :size="25" />Photo</span>
            <div><label class="review-upload__button"><input accept="image/jpeg,image/png,image/webp" type="file" @change="selectAttachment($event, 'image')"><MaterialIcon name="upload_file" :size="17" />{{ imageFile ? 'Replace photo' : 'Upload photo' }}</label><button v-if="imageFile" class="review-upload__remove" type="button" @click="removeAttachment('image')">Remove</button><small v-if="imageFile">{{ imageFile.name }}</small></div>
          </div>
          <div class="review-upload">
            <video v-if="videoPreview" :src="videoPreview" controls muted playsinline></video>
            <span v-else class="review-upload__placeholder"><MaterialIcon name="videocam" :size="25" />Video</span>
            <div><label class="review-upload__button"><input accept="video/mp4,video/webm,video/quicktime" type="file" @change="selectAttachment($event, 'video')"><MaterialIcon name="videocam" :size="17" />{{ videoFile ? 'Replace video' : 'Upload video' }}</label><button v-if="videoFile" class="review-upload__remove" type="button" @click="removeAttachment('video')">Remove</button><small v-if="videoFile">{{ videoFile.name }}</small></div>
          </div>
        </div>
      </section>

      <label class="review-consent"><input v-model="publicationConsent" type="checkbox" required><span><strong>I confirm this is my genuine experience and that Tripport may review it for publication.</strong><small>Your email and original files remain private. We only publish a review after a team member approves it.</small></span></label>
      <label class="review-honeypot" aria-hidden="true">Website<input v-model="website" tabindex="-1" autocomplete="off" /></label>

      <div class="review-form__footer"><p>By sharing, you help future travellers plan with more confidence.</p><button class="button button--forest review-form__submit" :disabled="status === 'submitting'" type="submit">{{ status === 'submitting' ? progress || 'Sending…' : 'Send my story' }} <MaterialIcon name="arrow_forward" :size="18" /></button></div>
      <p v-if="message" class="review-form__message" :class="{ 'review-form__message--error': status === 'error' }" role="alert">{{ message }}</p>
    </template>
  </form>
</template>

<style scoped>
.review-form{padding:clamp(23px,4vw,38px);border:1px solid #d7e6de;border-radius:24px;background:#fff;box-shadow:0 20px 55px rgb(14 55 41 / 8%)}.review-form__grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:17px}.review-field{display:grid;gap:8px;color:#2d5142;font-size:13px;font-weight:800}.review-field--wide{grid-column:1/-1}.review-field span{display:block}.review-field em,.review-rating em{display:inline-flex;margin-left:5px;padding:2px 5px;border-radius:999px;background:#fbe5dd;color:#a14c31;font-size:9px;font-style:normal;font-weight:850;letter-spacing:.04em;line-height:1.25;text-transform:uppercase}.review-field small,.review-rating small,.review-media__heading small{color:#86938d;font-size:11px;font-weight:650}.review-field input,.review-field textarea{width:100%;border:1px solid #cfded6;border-radius:10px;outline:0;background:#fff;color:#183b2e;font-size:15px;line-height:1.5}.review-field input{height:48px;padding:0 13px}.review-field textarea{min-height:130px;padding:12px 13px;resize:vertical}.review-field input:focus,.review-field textarea:focus{border-color:var(--green);box-shadow:0 0 0 3px rgb(15 115 85 / 11%)}.review-rating{margin:25px 0 0;padding:0;border:0}.review-rating legend{display:flex;align-items:baseline;gap:3px;color:#2d5142;font-size:13px;font-weight:850}.review-rating legend small{margin-left:6px}.review-rating>div{display:flex;gap:8px;margin-top:10px}.review-rating button{display:inline-flex;min-width:53px;height:43px;align-items:center;justify-content:center;gap:4px;border:1px solid #d2e0d8;border-radius:10px;background:#fff;color:#8d9c94;font-size:12px;font-weight:850;transition:background .18s ease,border-color .18s ease,color .18s ease}.review-rating button :deep(.material-icon){color:#d5a146}.review-rating button:hover,.review-rating button.is-selected{border-color:var(--green);background:#e9f5ed;color:#1e6649}.review-rating button.is-selected{box-shadow:0 0 0 3px rgb(15 115 85 / 10%)}.review-media{margin-top:27px;padding:19px;border:1px solid #deebe4;border-radius:15px;background:#f8fbf9}.review-media__heading{display:flex;align-items:baseline;justify-content:space-between;gap:20px}.review-media__heading>span{color:#2d5142;font-size:13px;font-weight:850}.review-media__heading p{max-width:410px;margin:0;color:#738178;font-size:12px;line-height:1.5;text-align:right}.review-media__grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:15px}.review-upload{display:grid;grid-template-columns:96px minmax(0,1fr);gap:12px;align-items:center;padding:10px;border:1px solid #dfeae4;border-radius:12px;background:#fff}.review-upload>img,.review-upload>video,.review-upload__placeholder{width:96px;height:76px;overflow:hidden;border-radius:9px;object-fit:cover}.review-upload__placeholder{display:grid;place-items:center;gap:4px;background:#eaf2ed;color:#5d7b6d;font-size:11px;font-weight:800}.review-upload>div{display:grid;gap:6px;min-width:0}.review-upload__button{display:inline-flex;justify-self:start;align-items:center;gap:6px;padding:7px 9px;border-radius:8px;background:#e8f3ec;color:#1f6549;cursor:pointer;font-size:12px;font-weight:850}.review-upload__button input{position:absolute;width:1px;height:1px;opacity:0}.review-upload__remove{justify-self:start;padding:0;border:0;background:transparent;color:#9f5038;font-size:11px;font-weight:800;text-decoration:underline;text-underline-offset:2px}.review-upload small{overflow:hidden;color:#78877f;font-size:10px;font-weight:650;text-overflow:ellipsis;white-space:nowrap}.review-consent{display:flex;gap:10px;align-items:flex-start;margin-top:18px;padding:14px;border:1px solid #d7e5dd;border-radius:12px;background:#f8fbf9;color:#2e5545;cursor:pointer}.review-consent input{width:17px;height:17px;flex:0 0 auto;margin:2px 0 0;accent-color:var(--green)}.review-consent strong,.review-consent small{display:block}.review-consent strong{font-size:12px;line-height:1.5}.review-consent small{margin-top:4px;color:#718178;font-size:11px;font-weight:600;line-height:1.45}.review-honeypot{position:absolute!important;width:1px!important;height:1px!important;overflow:hidden!important;clip:rect(0 0 0 0)!important;clip-path:inset(50%)!important;white-space:nowrap!important}.review-form__footer{display:flex;align-items:center;justify-content:space-between;gap:20px;margin-top:22px}.review-form__footer p{max-width:420px;margin:0;color:#748178;font-size:12px;line-height:1.5}.review-form__submit{min-width:162px}.review-form__submit:disabled{opacity:.7;cursor:wait}.review-form__message{margin:15px 0 0;padding:11px 12px;border-radius:10px;background:#edf7f1;color:#276147;font-size:13px;font-weight:700}.review-form__message--error{background:#fff0ed;color:#a43721}.review-form__success{display:flex;align-items:flex-start;gap:15px;padding:10px 2px}.review-form__success>span{display:grid;width:44px;height:44px;flex:0 0 auto;place-items:center;border-radius:50%;background:#e9f5ed;color:#22714f}.review-form__success strong{display:block;color:#183b2e;font-size:21px;letter-spacing:-.04em}.review-form__success p{max-width:420px;margin:7px 0 0;color:#67776e;font-size:14px;line-height:1.6}.review-form__success button{margin-top:17px;padding:0;border:0;background:transparent;color:#1e6549;font-size:13px;font-weight:850;text-decoration:underline;text-underline-offset:3px}@media(max-width:650px){.review-form{padding:22px;border-radius:19px}.review-form__grid,.review-media__grid{grid-template-columns:1fr}.review-media__heading{display:grid;gap:6px}.review-media__heading p{text-align:left}.review-form__footer{align-items:stretch;flex-direction:column}.review-form__submit{width:100%}.review-rating>div{flex-wrap:wrap}.review-upload{grid-template-columns:82px minmax(0,1fr)}.review-upload>img,.review-upload>video,.review-upload__placeholder{width:82px;height:70px}}
</style>
