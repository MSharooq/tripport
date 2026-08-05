<script setup lang="ts">
import type { Testimonial } from '~/data/testimonials'
import { createTestimonialDraft, testimonialValidationIssues, validationMessage, type ManagedTestimonialRow } from '~/data/manager'

definePageMeta({ layout: 'admin', middleware: 'manager' })

const route = useRoute()
const { request } = useManagerApi()
const isNew = computed(() => route.params.id === 'new')
const testimonial = ref<Testimonial | null>(null)
const loading = ref(true)
const saving = ref(false)
const uploading = ref(false)
const imageUpload = useResponsiveImageUpload()
const message = ref('')
const showPreview = ref(false)
const showPublishValidation = ref(false)
const ratingOptions = [1, 2, 3, 4, 5]

const publishIssues = computed(() => testimonial.value ? testimonialValidationIssues(testimonial.value, 'published') : [])
const missingPublishRequirementIds = computed(() => new Set(publishIssues.value.map(issue => issue.id)))
const publishChecklist = computed(() => {
  const missing = missingPublishRequirementIds.value
  return [
    { label: 'Traveller name', complete: !missing.has('name') },
    { label: 'Review headline and text', complete: !missing.has('title') && !missing.has('quote') },
    { label: 'A 1–5 star rating', complete: !missing.has('rating') },
    { label: 'Permission to publish the review', complete: !missing.has('permission') },
  ]
})

function imageSource(image: string) {
  return image.startsWith('http') || image.startsWith('/') ? image : `/images/${image}`
}
function normaliseImageVariants() {
  if (!testimonial.value) return
  const hero = testimonial.value.imageVariants?.hero
  const variantUrl = typeof hero === 'string' ? hero : hero?.url || ''
  if (!variantUrl || variantUrl === testimonial.value.image) return
  testimonial.value.imageVariants = undefined
  testimonial.value.imageWidth = undefined
  testimonial.value.imageHeight = undefined
}

function hasMissingRequirement(...ids: string[]) {
  return showPublishValidation.value && ids.some(id => missingPublishRequirementIds.value.has(id))
}

function setRating(rating: number) {
  if (testimonial.value) testimonial.value.rating = rating
}

async function load() {
  try {
    if (isNew.value) {
      testimonial.value = createTestimonialDraft()
      return
    }

    const result = await request<ManagedTestimonialRow>(`/api/admin/testimonials/${route.params.id}`)
    testimonial.value = structuredClone(result.data)
    testimonial.value.status ||= result.status
  } catch (error) {
    message.value = error instanceof Error ? error.message : 'We could not load this testimonial.'
  } finally {
    loading.value = false
  }
}

async function uploadImage(event: Event) {
  const input = event.target as HTMLInputElement
  if (uploading.value) { input.value = ''; return }
  const file = input.files?.[0]
  const supabase = useTripportSupabase()
  if (!file || !testimonial.value) return
  if (!supabase) {
    message.value = 'Image uploads need a connected Supabase project.'
    return
  }

  uploading.value = true
  message.value = ''
  try {
    const image = await imageUpload.upload(file, supabase, { folder: `testimonials/${testimonial.value.id || crypto.randomUUID()}` })
    testimonial.value.image = image.url
    testimonial.value.imageVariants = image.variants
    testimonial.value.imageWidth = image.width
    testimonial.value.imageHeight = image.height
  } catch (error) {
    message.value = error instanceof Error ? error.message : 'The image could not be processed.'
  } finally {
    input.value = ''
    uploading.value = false
  }
}

async function save(status?: 'draft' | 'published') {
  if (!testimonial.value) return
  normaliseImageVariants()
  const nextStatus = status ?? (testimonial.value.status === 'published' ? 'published' : 'draft')
  const issues = testimonialValidationIssues(testimonial.value, nextStatus === 'published' ? 'published' : 'draft')
  if (issues.length) {
    if (nextStatus === 'published') showPublishValidation.value = true
    message.value = validationMessage('testimonial', issues, nextStatus === 'published' ? 'publish' : 'save')
    return
  }

  if (nextStatus === 'published') showPublishValidation.value = false
  testimonial.value.status = nextStatus
  saving.value = true
  message.value = ''
  try {
    if (isNew.value) {
      await request('/api/admin/testimonials', { method: 'POST', body: testimonial.value })
      await navigateTo(`/admin/testimonials/${testimonial.value.id}`)
    } else {
      await request(`/api/admin/testimonials/${route.params.id}`, { method: 'PUT', body: testimonial.value })
      message.value = testimonial.value.status === 'published' ? 'Testimonial published and ready for the website.' : 'Draft saved.'
    }
  } catch (error) {
    message.value = error instanceof Error ? error.message : 'The testimonial could not be saved.'
  } finally {
    saving.value = false
  }
}

onMounted(load)
</script>

<template>
  <AdminShell section="testimonials">
    <div class="testimonial-editor-page">
      <header class="testimonial-editor-page__header">
        <div>
          <NuxtLink class="manager-back" to="/admin/testimonials"><MaterialIcon name="arrow_back" :size="17" />Testimonials</NuxtLink>
          <span class="manager-kicker">{{ isNew ? 'New testimonial' : testimonial?.status || 'Testimonial' }}</span>
          <h1>{{ isNew ? 'Add a real traveller story.' : testimonial?.title || 'Edit testimonial' }}</h1>
          <p>Use only genuine traveller feedback you have permission to publish. Save a simple draft first, then publish when the review has every required detail.</p>
        </div>
        <div class="testimonial-editor-page__actions">
          <button class="manager-secondary-button" :disabled="saving || !testimonial" type="button" @click="showPreview = true"><MaterialIcon name="visibility" :size="17" />Preview</button>
          <button class="manager-secondary-button" :disabled="saving || !testimonial" type="button" @click="save('draft')">Save draft</button>
          <button class="manager-action" :disabled="saving || !testimonial" type="button" @click="save('published')"><MaterialIcon name="check" :size="17" />{{ saving ? 'Saving…' : 'Publish' }}</button>
        </div>
      </header>

      <p v-if="message" class="manager-notice" :class="{ 'manager-notice--success': message.includes('saved') || message.includes('published') }">{{ message }}</p>
      <div v-if="loading" class="manager-editor-loading">Loading testimonial…</div>

      <form v-else-if="testimonial" class="testimonial-editor" @submit.prevent="save()">
        <AdminPublishChecklist :items="publishChecklist" />

        <section class="manager-editor-card" :class="{ 'manager-editor-card--needs-attention': hasMissingRequirement('name') }">
          <div>
            <span class="manager-kicker">01 · Traveller details</span>
            <h2>Keep the person clear.</h2>
            <p><strong>Required to save a draft:</strong> the traveller’s name. Location, traveller type and linked itinerary are optional.</p>
          </div>
          <div class="manager-form-grid">
            <label class="manager-field manager-field--wide" :class="{ 'manager-field--invalid': hasMissingRequirement('name') }"><span>Traveller name <em class="manager-required">Required</em></span><input v-model="testimonial.name" type="text" placeholder="e.g. Anjali Menon" required></label>
            <label class="manager-field"><span>Location <small>Optional</small></span><input v-model="testimonial.location" type="text" placeholder="e.g. Bengaluru"></label>
            <label class="manager-field"><span>Traveller type <small>Optional</small></span><input v-model="testimonial.travellerType" type="text" placeholder="e.g. Family holiday"></label>
            <label class="manager-field manager-field--wide"><span>Linked itinerary slug <small>Optional · use a published itinerary URL slug</small></span><input v-model="testimonial.itinerarySlug" type="text" placeholder="classic-kerala-6-nights"></label>
          </div>
        </section>

        <section class="manager-editor-card" :class="{ 'manager-editor-card--needs-attention': hasMissingRequirement('title', 'quote', 'rating', 'permission') }">
          <div>
            <span class="manager-kicker">02 · The review</span>
            <h2>Let the review speak.</h2>
            <p><strong>Required to publish:</strong> a short review headline, the traveller’s exact feedback, a rating from one to five stars and confirmation that you have permission to publish it.</p>
          </div>
          <div class="manager-form-grid">
            <label class="manager-field manager-field--wide" :class="{ 'manager-field--invalid': hasMissingRequirement('title') }"><span>Review headline <em class="manager-required">Required to publish</em></span><input v-model="testimonial.title" type="text" placeholder="e.g. A wonderfully paced Kerala holiday"></label>
            <label class="manager-field manager-field--wide" :class="{ 'manager-field--invalid': hasMissingRequirement('quote') }"><span>Traveller’s review <em class="manager-required">Required to publish</em></span><textarea v-model="testimonial.quote" rows="6" placeholder="Paste the traveller’s genuine feedback here."></textarea></label>
            <fieldset class="manager-rating-picker" :class="{ 'manager-rating-picker--invalid': hasMissingRequirement('rating') }">
              <legend>Rating <em class="manager-required">Required to publish</em><small>Choose one rating from 1 to 5 stars.</small></legend>
              <div>
                <button v-for="rating in ratingOptions" :key="rating" type="button" :class="{ 'is-selected': testimonial.rating === rating }" :aria-pressed="testimonial.rating === rating" :aria-label="`${rating} out of 5 stars`" @click="setRating(rating)"><span>{{ rating }}</span><i aria-hidden="true">★</i></button>
              </div>
            </fieldset>
            <label class="manager-consent" :class="{ 'manager-consent--invalid': hasMissingRequirement('permission') }"><input v-model="testimonial.permissionConfirmed" type="checkbox"><span><strong>I have permission to publish this review <em class="manager-required">Required to publish</em></strong><small>Confirm that this traveller has agreed to their feedback being shown on Tripport.</small></span></label>
          </div>
        </section>

        <section class="manager-editor-card">
          <div>
            <span class="manager-kicker">03 · Photo & placement</span>
            <h2>Make it easy to recognise.</h2>
            <p>A traveller image is optional. Use the featured switch to prioritise a genuine story, and sort order to control its position.</p>
          </div>
          <div class="testimonial-media-grid">
            <div class="testimonial-image-field">
              <img v-if="testimonial.image" :src="imageSource(testimonial.image)" :alt="testimonial.name ? `${testimonial.name}, traveller` : 'Traveller'">
              <span v-else><MaterialIcon name="image" :size="28" />Optional photo</span>
              <label class="manager-upload-button"><input accept="image/jpeg,image/png,image/webp" type="file" @change="uploadImage"><MaterialIcon name="add" :size="17" />{{ uploading ? 'Uploading…' : 'Upload image' }}</label>
              <label class="manager-image-url"><span>Image URL <small>Optional</small></span><input v-model="testimonial.image" type="url" placeholder="or paste an image URL"></label>
            </div>
            <div class="testimonial-placement-fields">
              <label class="manager-toggle"><input v-model="testimonial.featured" type="checkbox"><span class="manager-toggle__track" aria-hidden="true"><i /></span><span><strong>Feature this story</strong><small>Show it in highlighted testimonial areas.</small></span></label>
              <label class="manager-field"><span>Sort order <small>Optional · lower numbers appear first</small></span><input v-model.number="testimonial.sortOrder" type="number" min="0" step="1"></label>
            </div>
          </div>
        </section>

        <footer class="manager-editor-footer">
          <span>Drafts need a traveller name. Every checklist item—including permission to publish—is required before publishing.</span>
          <div>
            <button class="manager-secondary-button" :disabled="saving" type="button" @click="showPreview = true"><MaterialIcon name="visibility" :size="17" />Preview</button>
            <button class="manager-secondary-button" :disabled="saving" type="button" @click="save('draft')">Save draft</button>
            <button class="manager-action" :disabled="saving" type="button" @click="save('published')"><MaterialIcon name="check" :size="17" />{{ testimonial.status === 'published' ? 'Save published changes' : 'Publish testimonial' }}</button>
          </div>
        </footer>
      </form>

      <AdminTestimonialPreview v-if="showPreview && testimonial" :testimonial="testimonial" @close="showPreview = false" />
    </div>
  </AdminShell>
</template>

<style scoped>
.testimonial-editor-page{width:min(1040px,calc(100% - 64px));margin:0 auto;padding:36px 0 80px}.testimonial-editor-page__header{display:flex;align-items:end;justify-content:space-between;gap:26px;margin-bottom:26px}.manager-back{display:inline-flex;align-items:center;gap:5px;margin-bottom:24px;color:#43675a;font-size:13px;font-weight:800}.manager-kicker{display:block;color:#2a7659;font-size:11px;font-weight:850;letter-spacing:.13em;text-transform:uppercase}.testimonial-editor-page h1{margin:8px 0 9px;color:#123629;font-size:clamp(34px,4vw,49px);letter-spacing:-.07em;line-height:.95}.testimonial-editor-page__header p{max-width:620px;margin:0;color:#68786f;font-size:15px;line-height:1.6}.testimonial-editor-page__actions,.manager-editor-footer>div{display:flex;gap:8px}.manager-action,.manager-secondary-button{display:inline-flex;min-height:43px;align-items:center;justify-content:center;gap:8px;padding:0 14px;border-radius:10px;font-size:13px;font-weight:800}.manager-action{border:0;background:#113e32;color:#fff}.manager-action:hover{background:#0e3028}.manager-secondary-button{border:1px solid #ccdbd3;background:#fff;color:#2d5042}.manager-secondary-button:hover{border-color:#8eaf9f;background:#f3f8f4}.manager-action:disabled,.manager-secondary-button:disabled{opacity:.6;cursor:wait}.manager-notice{margin:0 0 22px;padding:12px 14px;border-radius:10px;background:#fff0ed;color:#a43721;font-size:14px;font-weight:700}.manager-notice--success{background:#e9f6ee;color:#205e43}.manager-editor-loading{padding:70px 0;color:#718078;text-align:center}.testimonial-editor{display:grid;gap:18px}.manager-editor-card{display:grid;grid-template-columns:230px minmax(0,1fr);gap:35px;padding:29px;border:1px solid #dce7e0;border-radius:18px;background:#fff}.manager-editor-card h2{margin:8px 0 8px;color:#173c2e;font-size:25px;letter-spacing:-.055em;line-height:1}.manager-editor-card>div>p{margin:0;color:#728178;font-size:13px;line-height:1.6}.manager-form-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:15px}.manager-field{display:grid;gap:7px;color:#405f52;font-size:12px;font-weight:800}.manager-field>span{display:block}.manager-field small,.manager-rating-picker small{color:#88958e;font-size:10px;font-weight:650}.manager-field--wide{grid-column:1 / -1}.manager-field input,.manager-field textarea,.manager-image-url input{width:100%;border:1px solid #d3e0d8;border-radius:9px;outline:0;background:#fff;color:#173b2e;font-size:14px;font-weight:500;line-height:1.5}.manager-field input{height:43px;padding:0 11px}.manager-field textarea{min-height:43px;padding:10px 11px;resize:vertical}.manager-field input:focus,.manager-field textarea:focus,.manager-image-url input:focus{border-color:#277656;box-shadow:0 0 0 3px rgb(39 118 86 / 10%)}.manager-rating-picker{grid-column:1 / -1;padding:0;border:0}.manager-rating-picker legend{display:flex;align-items:baseline;gap:3px;color:#405f52;font-size:12px;font-weight:800}.manager-rating-picker legend small{margin-left:5px}.manager-rating-picker>div{display:flex;gap:8px;margin-top:9px}.manager-rating-picker button{display:inline-flex;min-width:54px;align-items:center;justify-content:center;gap:5px;padding:10px 11px;border:1px solid #d6e4db;border-radius:9px;background:#fff;color:#708279;font-size:13px;font-weight:850;cursor:pointer}.manager-rating-picker button i{color:#d4a03a;font-size:17px;font-style:normal;line-height:1}.manager-rating-picker button:hover{border-color:#9cc3ad;background:#f5faf6}.manager-rating-picker button.is-selected{border-color:#277656;background:#e9f5ed;color:#176245;box-shadow:0 0 0 3px rgb(39 118 86 / 10%)}.manager-consent{grid-column:1 / -1;display:flex;gap:10px;align-items:flex-start;padding:13px 14px;border:1px solid #d8e5dd;border-radius:11px;background:#f8fbf9;color:#2e5545;cursor:pointer}.manager-consent>input{width:17px;height:17px;flex:0 0 auto;margin:1px 0 0;accent-color:#277656}.manager-consent strong,.manager-consent small{display:block}.manager-consent strong{font-size:12px;line-height:1.45}.manager-consent small{margin-top:4px;color:#718178;font-size:11px;font-weight:600;line-height:1.45}.manager-consent--invalid{border-color:#d3775d;background:#fffaf8;box-shadow:0 0 0 3px rgb(200 93 57 / 10%)}.testimonial-media-grid{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(205px,.8fr);gap:22px}.testimonial-image-field{display:grid;grid-template-columns:150px minmax(0,1fr);gap:10px 15px;align-items:center}.testimonial-image-field img,.testimonial-image-field>span{grid-row:1 / 3;width:150px;height:122px;border-radius:14px;object-fit:cover}.testimonial-image-field>span{display:grid;place-items:center;gap:6px;background:#edf4ef;color:#608071;font-size:12px;font-weight:800;text-align:center}.manager-upload-button{display:inline-flex;justify-self:start;align-items:center;gap:7px;padding:8px 10px;border-radius:8px;background:#e8f3ec;color:#1f6549;cursor:pointer;font-size:12px;font-weight:800}.manager-upload-button input{position:absolute;width:1px;height:1px;opacity:0}.manager-image-url{display:grid;gap:7px;color:#405f52;font-size:12px;font-weight:800}.manager-image-url>span{display:block}.manager-image-url input{height:38px;padding:0 10px;font-size:12px}.testimonial-placement-fields{display:grid;align-content:start;gap:18px;padding:15px;border:1px solid #e0ebe4;border-radius:13px;background:#f9fbfa}.manager-toggle{display:flex;gap:10px;align-items:flex-start;color:#395b4c;cursor:pointer}.manager-toggle>input{position:absolute;width:1px;height:1px;opacity:0}.manager-toggle__track{display:flex;width:37px;height:22px;flex:0 0 auto;align-items:center;padding:3px;border-radius:999px;background:#bfcfc6;transition:background .18s ease}.manager-toggle__track i{display:block;width:16px;height:16px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgb(0 0 0 / 18%);transition:transform .18s ease}.manager-toggle input:checked+.manager-toggle__track{background:#277656}.manager-toggle input:checked+.manager-toggle__track i{transform:translateX(15px)}.manager-toggle input:focus-visible+.manager-toggle__track{outline:3px solid rgb(39 118 86 / 22%);outline-offset:3px}.manager-toggle strong,.manager-toggle small{display:block}.manager-toggle strong{font-size:12px}.manager-toggle small{margin-top:4px;color:#7e8d85;font-size:10px;font-weight:600;line-height:1.4}.manager-editor-footer{display:flex;align-items:center;justify-content:space-between;gap:18px;padding:5px 0;color:#718078;font-size:13px}.manager-editor-card--needs-attention{border-color:#e1a08b;background:#fffaf8;box-shadow:0 0 0 3px rgb(184 80 44 / 8%)}.manager-editor-card--needs-attention .manager-kicker{color:#99452d}.manager-editor-card>div>p strong{color:#8f452d}.manager-required{display:inline-flex;align-items:center;margin-left:5px;padding:2px 5px;border-radius:999px;background:#fbe2da;color:#a3472d;font-size:9px;font-style:normal;font-weight:850;letter-spacing:.025em;line-height:1.25;text-transform:uppercase}.manager-field--invalid input,.manager-field--invalid textarea{border-color:#d3775d;background:#fffaf8;box-shadow:0 0 0 3px rgb(200 93 57 / 10%)}.manager-rating-picker--invalid>div{padding:7px;border-radius:12px;outline:2px solid #d9866e;outline-offset:2px}@media(max-width:860px){.manager-editor-card{grid-template-columns:1fr;gap:22px}}@media(max-width:620px){.testimonial-editor-page{width:min(100% - 32px,1040px);padding:28px 0 60px}.testimonial-editor-page__header{align-items:start;flex-direction:column}.testimonial-editor-page__actions{width:100%;flex-wrap:wrap}.testimonial-editor-page__actions button{flex:1;min-width:calc(50% - 4px)}.manager-editor-card{padding:20px}.manager-form-grid,.testimonial-media-grid{grid-template-columns:1fr}.testimonial-image-field{grid-template-columns:120px minmax(0,1fr)}.testimonial-image-field img,.testimonial-image-field>span{width:120px;height:104px}.manager-rating-picker>div{flex-wrap:wrap}.manager-rating-picker button{min-width:48px}.manager-editor-footer{align-items:start;flex-direction:column}.manager-editor-footer>div{width:100%;flex-wrap:wrap}.manager-editor-footer button{flex:1;min-width:calc(50% - 4px)}.manager-required{margin-left:3px}}
</style>
