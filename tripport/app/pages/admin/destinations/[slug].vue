<script setup lang="ts">
import type { Destination } from '~/data/destinations'
import { destinationImageSource } from '~/data/destinations'
import { createDestinationDraft, destinationValidationIssues, toSlug, validationMessage, type ManagedDestinationRow } from '~/data/manager'

definePageMeta({ layout: 'admin', middleware: 'manager' })

const route = useRoute()
const { request } = useManagerApi()
const isNew = computed(() => route.params.slug === 'new')
const destination = ref<Destination | null>(null)
const loading = ref(true)
const saving = ref(false)
const uploading = ref<'cover' | 'gallery' | null>(null)
const imageUpload = useResponsiveImageUpload()
const message = ref('')
const showPreview = ref(false)
const showPublishValidation = ref(false)

const highlightsText = computed({
  get: () => destination.value?.highlights.join('\n') ?? '',
  set: value => { if (destination.value) destination.value.highlights = splitLines(value) },
})
const bestForText = computed({
  get: () => destination.value?.bestFor.join('\n') ?? '',
  set: value => { if (destination.value) destination.value.bestFor = splitLines(value) },
})
const relatedText = computed({
  get: () => destination.value?.relatedItinerarySlugs.join(', ') ?? '',
  set: value => { if (destination.value) destination.value.relatedItinerarySlugs = splitValues(value) },
})
const publishIssues = computed(() => destination.value ? destinationValidationIssues(destination.value, 'published') : [])
const missingPublishRequirementIds = computed(() => new Set(publishIssues.value.map(issue => issue.id)))
const publishChecklist = computed(() => {
  const missing = missingPublishRequirementIds.value
  const complete = (...ids: string[]) => ids.every(id => !missing.has(id))
  return [
    { label: 'Destination name and URL slug', complete: complete('name', 'slug') },
    { label: 'Region and ideal stay', complete: complete('region', 'ideal-nights') },
    { label: 'Summary and destination introduction', complete: complete('summary', 'introduction') },
    { label: 'Cover image', complete: complete('image') },
    { label: 'SEO page title and description', complete: complete('seo-title', 'seo-description') },
  ]
})

function splitLines(value: string) { return value.split('\n').map(item => item.trim()).filter(Boolean) }
function splitValues(value: string) { return value.split(',').map(item => item.trim()).filter(Boolean) }
function imageSource(image: string) { return image ? destinationImageSource(image) : '' }
function updateSlug() { if (isNew.value && destination.value) destination.value.slug = toSlug(destination.value.name) }
function addFact() { destination.value?.facts.push({ label: '', value: '' }) }
function addGalleryImage() { destination.value?.gallery?.push({ url: '', alt: '' }) }
function removeGalleryImage(index: number) { destination.value?.gallery?.splice(index, 1) }
function hasMissingRequirement(...ids: string[]) { return showPublishValidation.value && ids.some(id => missingPublishRequirementIds.value.has(id)) }
function variantUrl(variants?: Destination['imageVariants']) {
  const hero = variants?.hero
  return typeof hero === 'string' ? hero : hero?.url || ''
}
function normaliseImageVariants(document: Destination) {
  if (variantUrl(document.imageVariants) && variantUrl(document.imageVariants) !== document.image) {
    document.imageVariants = undefined
    document.imageWidth = undefined
    document.imageHeight = undefined
  }
  document.gallery?.forEach((image) => {
    if (variantUrl(image.variants) && variantUrl(image.variants) !== image.url) {
      image.variants = undefined
      image.width = undefined
      image.height = undefined
    }
  })
}

function prepareDocument(document: Destination) {
  document.gallery ||= []
  document.highlights ||= []
  document.bestFor ||= []
  document.facts ||= []
  document.relatedItinerarySlugs ||= []
  document.seo ||= { metaTitle: '', metaDescription: '' }
  document.imageAlt ||= ''
}

async function load() {
  try {
    if (isNew.value) {
      destination.value = createDestinationDraft()
      prepareDocument(destination.value)
      return
    }

    const result = await request<ManagedDestinationRow>(`/api/admin/destinations/${route.params.slug}`)
    destination.value = structuredClone(result.data)
    destination.value.status ||= result.status
    prepareDocument(destination.value)
  } catch (error) {
    message.value = error instanceof Error ? error.message : 'We could not load this destination.'
  } finally { loading.value = false }
}

async function uploadImage(event: Event, target: 'cover' | 'gallery') {
  const input = event.target as HTMLInputElement
  if (uploading.value) { input.value = ''; return }
  const file = input.files?.[0]
  const supabase = useTripportSupabase()
  if (!file || !destination.value) return
  if (!supabase) {
    message.value = 'Image uploads need a connected Supabase project.'
    return
  }

  uploading.value = target
  message.value = ''
  try {
    const image = await imageUpload.upload(file, supabase, { folder: `destinations/${destination.value.slug || crypto.randomUUID()}` })
    if (target === 'cover') {
      destination.value.image = image.url
      destination.value.imageVariants = image.variants
      destination.value.imageWidth = image.width
      destination.value.imageHeight = image.height
    } else {
      destination.value.gallery?.push({ ...image, alt: '' })
    }
  } catch (error) {
    message.value = error instanceof Error ? error.message : 'The image could not be processed.'
  } finally {
    input.value = ''
    uploading.value = null
  }
}

async function save(status?: Destination['status']) {
  if (!destination.value) return
  normaliseImageVariants(destination.value)
  const nextStatus = status ?? (destination.value.status === 'published' ? 'published' : 'draft')
  const issues = destinationValidationIssues(destination.value, nextStatus === 'published' ? 'published' : 'draft')
  if (issues.length) {
    if (nextStatus === 'published') showPublishValidation.value = true
    message.value = validationMessage('destination', issues, nextStatus === 'published' ? 'publish' : 'save')
    return
  }

  if (nextStatus === 'published') showPublishValidation.value = false
  destination.value.status = nextStatus
  saving.value = true
  message.value = ''
  try {
    if (isNew.value) {
      await request('/api/admin/destinations', { method: 'POST', body: destination.value })
      await navigateTo(`/admin/destinations/${destination.value.slug}`)
    } else {
      const currentSlug = String(route.params.slug)
      await request(`/api/admin/destinations/${currentSlug}`, { method: 'PUT', body: destination.value })
      if (destination.value.slug !== currentSlug) {
        await navigateTo(`/admin/destinations/${destination.value.slug}`)
        return
      }
      message.value = destination.value.status === 'published' ? 'Destination published and ready for the website.' : 'Draft saved.'
    }
  } catch (error) {
    message.value = error instanceof Error ? error.message : 'The destination could not be saved.'
  } finally { saving.value = false }
}

onMounted(load)
</script>

<template>
  <AdminShell section="destinations">
    <div class="destination-editor-page">
      <header class="destination-editor-page__header">
        <div>
          <NuxtLink class="manager-back" to="/admin/destinations"><MaterialIcon name="arrow_back" :size="17" />Destinations</NuxtLink>
          <span class="manager-kicker">{{ isNew ? 'New destination' : destination?.status || 'Destination' }}</span>
          <h1>{{ isNew ? 'Give a place its own story.' : destination?.name || 'Edit destination' }}</h1>
          <p>Help travellers understand the character, pace and natural route pairings of this place.</p>
        </div>
        <div class="destination-editor-page__actions">
          <button class="manager-secondary-button" :disabled="saving || !destination" type="button" @click="showPreview = true"><MaterialIcon name="visibility" :size="17" />Preview</button>
          <button class="manager-secondary-button" :disabled="saving || !destination" type="button" @click="save('draft')">Save draft</button>
          <button class="manager-action" :disabled="saving || !destination" type="button" @click="save('published')"><MaterialIcon name="check" :size="17" />{{ saving ? 'Saving…' : 'Publish' }}</button>
        </div>
      </header>

      <p v-if="message" class="manager-notice" :class="{ 'manager-notice--success': message.includes('saved') || message.includes('published') }">{{ message }}</p>
      <div v-if="loading" class="manager-editor-loading">Loading destination…</div>

      <form v-else-if="destination" class="destination-editor" @submit.prevent="save()">
        <AdminPublishChecklist :items="publishChecklist" />

        <section class="manager-editor-card" :class="{ 'manager-editor-card--needs-attention': hasMissingRequirement('name', 'slug', 'region', 'ideal-nights', 'summary', 'introduction') }">
          <div>
            <span class="manager-kicker">01 · Destination basics</span>
            <h2>Set the place up well.</h2>
            <p><strong>Required to publish:</strong> destination name, URL slug, region, ideal stay, card summary and a welcoming introduction. Name and URL slug are also needed to save a draft.</p>
          </div>
          <div class="manager-form-grid">
            <label class="manager-field manager-field--wide" :class="{ 'manager-field--invalid': hasMissingRequirement('name') }"><span>Destination name <em class="manager-required">Required</em></span><input v-model="destination.name" type="text" placeholder="e.g. Munnar" required @input="updateSlug"></label>
            <label class="manager-field" :class="{ 'manager-field--invalid': hasMissingRequirement('slug') }"><span>URL slug <em class="manager-required">Required</em></span><input v-model="destination.slug" type="text" placeholder="munnar" required></label>
            <label class="manager-field" :class="{ 'manager-field--invalid': hasMissingRequirement('region') }"><span>Region <em class="manager-required">Required to publish</em></span><input v-model="destination.region" type="text" placeholder="Idukki"></label>
            <label class="manager-field"><span>State <small>Optional</small></span><input v-model="destination.state" type="text" placeholder="Kerala"></label>
            <label class="manager-field"><span>Country <small>Optional</small></span><input v-model="destination.country" type="text" placeholder="India"></label>
            <label class="manager-field" :class="{ 'manager-field--invalid': hasMissingRequirement('ideal-nights') }"><span>Ideal stay <em class="manager-required">Required to publish</em></span><input v-model="destination.idealNights" type="text" placeholder="2–3 nights"></label>
            <label class="manager-field manager-field--wide" :class="{ 'manager-field--invalid': hasMissingRequirement('summary') }"><span>Card summary <em class="manager-required">Required to publish</em></span><textarea v-model="destination.summary" rows="3" placeholder="A concise reason to include this place in a journey"></textarea></label>
            <label class="manager-field manager-field--wide" :class="{ 'manager-field--invalid': hasMissingRequirement('introduction') }"><span>Destination introduction <em class="manager-required">Required to publish</em></span><textarea v-model="destination.introduction" rows="5" placeholder="Describe the character, pace and appeal of this destination."></textarea></label>
          </div>
        </section>

        <section class="manager-editor-card" :class="{ 'manager-editor-card--needs-attention': hasMissingRequirement('image') }">
          <div>
            <span class="manager-kicker">02 · Visuals</span>
            <h2>Make the first impression count.</h2>
            <p><strong>Required to publish:</strong> one strong cover image. Add a gallery only when it helps tell a fuller story.</p>
          </div>
          <div class="manager-images">
            <div class="manager-cover-field" :class="{ 'manager-cover-field--invalid': hasMissingRequirement('image') }">
              <img v-if="destination.image" :src="imageSource(destination.image)" :alt="destination.imageAlt || ''">
              <div v-else class="manager-image-placeholder"><MaterialIcon name="image" :size="27" />Cover image <em class="manager-required">Required</em></div>
              <label class="manager-upload-button"><input accept="image/jpeg,image/png,image/webp" type="file" @change="uploadImage($event, 'cover')"><MaterialIcon name="add" :size="17" />{{ uploading === 'cover' ? 'Uploading…' : 'Upload cover' }}</label>
              <label class="manager-image-url"><span>Cover image URL <em class="manager-required">Required to publish</em></span><input v-model="destination.image" type="url" placeholder="or paste an image URL"></label>
              <label class="manager-image-url"><span>Image description <small>Optional but recommended</small></span><input v-model="destination.imageAlt" type="text" placeholder="Describe the image for accessibility"></label>
            </div>

            <div class="manager-gallery">
              <article v-for="(image, index) in destination.gallery" :key="index">
                <img v-if="image.url" :src="imageSource(image.url)" :alt="image.alt || ''"><span v-else><MaterialIcon name="image" :size="20" /></span>
                <input v-model="image.url" type="url" placeholder="Image URL">
                <input v-model="image.alt" type="text" placeholder="Image description">
                <button type="button" @click="removeGalleryImage(index)"><MaterialIcon name="close" :size="17" />Remove</button>
              </article>
              <label class="manager-gallery-add"><input accept="image/jpeg,image/png,image/webp" type="file" @change="uploadImage($event, 'gallery')"><MaterialIcon name="add" :size="20" />{{ uploading === 'gallery' ? 'Uploading…' : 'Upload gallery image' }}</label>
              <button class="manager-text-button" type="button" @click="addGalleryImage"><MaterialIcon name="add" :size="17" />Add image link</button>
            </div>
          </div>
        </section>

        <section class="manager-editor-card">
          <div>
            <span class="manager-kicker">03 · Useful details</span>
            <h2>Make the page easy to scan.</h2>
            <p>Highlights, traveller fit and practical facts are optional, but they help someone quickly see whether this stop is right for them.</p>
          </div>
          <div>
            <div class="manager-form-grid">
              <label class="manager-field manager-field--wide"><span>Highlights <small>Optional · one per line</small></span><textarea v-model="highlightsText" rows="5" placeholder="Tea-covered landscapes&#10;Cool weather and scenic drives"></textarea></label>
              <label class="manager-field manager-field--wide"><span>Best for <small>Optional · one per line</small></span><textarea v-model="bestForText" rows="4" placeholder="Honeymoons&#10;First-time Kerala journeys"></textarea></label>
            </div>
            <div class="destination-facts">
              <div class="destination-facts__heading"><strong>Quick facts <small>Optional</small></strong><button class="manager-text-button" type="button" @click="addFact"><MaterialIcon name="add" :size="16" />Add fact</button></div>
              <article v-for="(fact, index) in destination.facts" :key="index"><label class="manager-field"><span>Fact label</span><input v-model="fact.label" type="text" placeholder="Best for"></label><label class="manager-field"><span>Fact value</span><input v-model="fact.value" type="text" placeholder="Hills + tea country"></label><button class="manager-icon-button" type="button" aria-label="Remove fact" @click="destination.facts.splice(index, 1)"><MaterialIcon name="close" :size="17" /></button></article>
            </div>
          </div>
        </section>

        <section class="manager-editor-card" :class="{ 'manager-editor-card--needs-attention': hasMissingRequirement('seo-title', 'seo-description') }">
          <div>
            <span class="manager-kicker">04 · Related journeys & search</span>
            <h2>Close the loop.</h2>
            <p>Related package slugs are optional. <strong>Required to publish:</strong> a clear SEO page title and search description.</p>
          </div>
          <div class="manager-form-grid">
            <label class="manager-field manager-field--wide"><span>Related itinerary slugs <small>Optional · separate with commas</small></span><input v-model="relatedText" type="text" placeholder="classic-kerala-6-nights, munnar-alleppey-3-nights"></label>
            <label class="manager-field manager-field--wide" :class="{ 'manager-field--invalid': hasMissingRequirement('seo-title') }"><span>SEO page title <em class="manager-required">Required to publish</em></span><input v-model="destination.seo.metaTitle" type="text" placeholder="Munnar Travel Guide | Tripport"></label>
            <label class="manager-field manager-field--wide" :class="{ 'manager-field--invalid': hasMissingRequirement('seo-description') }"><span>SEO description <em class="manager-required">Required to publish</em></span><textarea v-model="destination.seo.metaDescription" rows="3" placeholder="A concise search result description"></textarea></label>
          </div>
        </section>

        <footer class="manager-editor-footer">
          <span>Drafts need a destination name and URL slug. Every checklist item is required before publishing.</span>
          <div>
            <button class="manager-secondary-button" :disabled="saving" type="button" @click="showPreview = true"><MaterialIcon name="visibility" :size="17" />Preview</button>
            <button class="manager-secondary-button" :disabled="saving" type="button" @click="save('draft')">Save draft</button>
            <button class="manager-action" :disabled="saving" type="button" @click="save('published')"><MaterialIcon name="check" :size="17" />{{ destination.status === 'published' ? 'Save published changes' : 'Publish destination' }}</button>
          </div>
        </footer>
      </form>
      <AdminDestinationPreview v-if="showPreview && destination" :destination="destination" @close="showPreview = false" />
    </div>
  </AdminShell>
</template>

<style scoped>
.destination-editor-page{width:min(1040px,calc(100% - 64px));margin:0 auto;padding:36px 0 80px}.destination-editor-page__header{display:flex;align-items:end;justify-content:space-between;gap:26px;margin-bottom:26px}.manager-back{display:inline-flex;align-items:center;gap:5px;margin-bottom:24px;color:#43675a;font-size:13px;font-weight:800}.manager-kicker{display:block;color:#2a7659;font-size:11px;font-weight:850;letter-spacing:.13em;text-transform:uppercase}.destination-editor-page h1{margin:8px 0 9px;color:#123629;font-size:clamp(34px,4vw,49px);letter-spacing:-.07em;line-height:.95}.destination-editor-page__header p{max-width:600px;margin:0;color:#68786f;font-size:15px;line-height:1.6}.destination-editor-page__actions,.manager-editor-footer>div{display:flex;gap:8px}.manager-action,.manager-secondary-button{display:inline-flex;min-height:43px;align-items:center;justify-content:center;gap:8px;padding:0 14px;border-radius:10px;font-size:13px;font-weight:800}.manager-action{border:0;background:#113e32;color:#fff}.manager-action:hover{background:#0e3028}.manager-secondary-button{border:1px solid #ccdbd3;background:#fff;color:#2d5042}.manager-secondary-button:hover{border-color:#8eaf9f;background:#f3f8f4}.manager-action:disabled,.manager-secondary-button:disabled{opacity:.6;cursor:wait}.manager-notice{margin:0 0 22px;padding:12px 14px;border-radius:10px;background:#fff0ed;color:#a43721;font-size:14px;font-weight:700}.manager-notice--success{background:#e9f6ee;color:#205e43}.manager-editor-loading{padding:70px 0;color:#718078;text-align:center}.destination-editor{display:grid;gap:18px}.manager-editor-card{display:grid;grid-template-columns:230px minmax(0,1fr);gap:35px;padding:29px;border:1px solid #dce7e0;border-radius:18px;background:#fff}.manager-editor-card h2{margin:8px 0 8px;color:#173c2e;font-size:25px;letter-spacing:-.055em;line-height:1}.manager-editor-card>div>p{margin:0;color:#728178;font-size:13px;line-height:1.6}.manager-form-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:15px}.manager-field{display:grid;gap:7px;color:#405f52;font-size:12px;font-weight:800}.manager-field>span{display:block}.manager-field small{color:#88958e;font-size:10px;font-weight:650}.manager-field--wide{grid-column:1 / -1}.manager-field input,.manager-field textarea{width:100%;border:1px solid #d3e0d8;border-radius:9px;outline:0;background:#fff;color:#173b2e;font-size:14px;font-weight:500;line-height:1.5}.manager-field input{height:43px;padding:0 11px}.manager-field textarea{min-height:43px;padding:10px 11px;resize:vertical}.manager-field input:focus,.manager-field textarea:focus{border-color:#277656;box-shadow:0 0 0 3px rgb(39 118 86 / 10%)}.manager-images{display:grid;gap:18px}.manager-cover-field{display:grid;grid-template-columns:180px minmax(0,1fr);grid-template-rows:auto auto;gap:10px 15px;align-items:center}.manager-cover-field>img,.manager-image-placeholder{grid-row:1 / 3;width:180px;height:126px;border-radius:12px;object-fit:cover}.manager-image-placeholder{display:grid;place-items:center;gap:6px;background:#edf4ef;color:#608071;font-size:12px;font-weight:800}.manager-upload-button,.manager-gallery-add{display:inline-flex;align-items:center;justify-content:center;gap:7px;cursor:pointer}.manager-upload-button{justify-self:start;padding:8px 10px;border-radius:8px;background:#e8f3ec;color:#1f6549;font-size:12px;font-weight:800}.manager-upload-button input,.manager-gallery-add input{position:absolute;width:1px;height:1px;opacity:0;pointer-events:none}.manager-image-url{display:grid;gap:7px;color:#405f52;font-size:12px;font-weight:800}.manager-image-url>span{display:block}.manager-image-url input{width:100%;height:38px;padding:0 10px;border:1px solid #d6e3db;border-radius:8px;color:#345749;font-size:12px;outline:none}.manager-image-url input:focus{border-color:#277656;box-shadow:0 0 0 3px rgb(39 118 86 / 10%)}.manager-gallery{display:grid;gap:10px}.manager-gallery article{display:grid;grid-template-columns:58px minmax(0,1fr) minmax(0,1fr) auto;gap:8px;align-items:center}.manager-gallery article img,.manager-gallery article>span{width:58px;height:48px;border-radius:8px;object-fit:cover}.manager-gallery article>span{display:grid;place-items:center;background:#edf4ef;color:#638173}.manager-gallery article input{min-width:0;height:38px;padding:0 9px;border:1px solid #d6e3db;border-radius:8px;font-size:12px;outline:none}.manager-gallery article button,.manager-text-button{display:inline-flex;align-items:center;justify-content:center;gap:5px;border:0;background:transparent;color:#2b7658;font-size:12px;font-weight:800}.manager-gallery article button{color:#856156}.manager-gallery-add{min-height:46px;border:1px dashed #a6c9b5;border-radius:9px;background:#f6faf7;color:#2b7658;font-size:12px;font-weight:800}.destination-facts{display:grid;gap:10px;margin-top:23px}.destination-facts__heading{display:flex;align-items:center;justify-content:space-between;gap:12px}.destination-facts__heading strong{color:#315449;font-size:12px}.destination-facts__heading small{color:#87958d;font-size:10px;font-weight:600}.destination-facts article{display:grid;grid-template-columns:1fr 1.25fr 32px;gap:10px;align-items:end;padding:12px;border:1px solid #e0ebe4;border-radius:10px;background:#f9fbfa}.manager-icon-button{display:grid;width:32px;height:32px;flex:0 0 auto;place-items:center;border:1px solid #d7e2db;border-radius:8px;background:#fff;color:#63746c}.manager-icon-button:hover{border-color:#e8b8ad;background:#fff5f2;color:#b34830}.manager-editor-footer{display:flex;align-items:center;justify-content:space-between;gap:18px;padding:5px 0;color:#718078;font-size:13px}.manager-editor-card--needs-attention{border-color:#e1a08b;background:#fffaf8;box-shadow:0 0 0 3px rgb(184 80 44 / 8%)}.manager-editor-card--needs-attention .manager-kicker{color:#99452d}.manager-editor-card>div>p strong{color:#8f452d}.manager-required{display:inline-flex;align-items:center;margin-left:5px;padding:2px 5px;border-radius:999px;background:#fbe2da;color:#a3472d;font-size:9px;font-style:normal;font-weight:850;letter-spacing:.025em;line-height:1.25;text-transform:uppercase}.manager-field--invalid input,.manager-field--invalid textarea,.manager-cover-field--invalid .manager-image-url input{border-color:#d3775d;background:#fffaf8;box-shadow:0 0 0 3px rgb(200 93 57 / 10%)}.manager-cover-field--invalid{padding:9px;border-radius:13px;outline:2px solid #d9866e;outline-offset:2px}@media(max-width:860px){.manager-editor-card{grid-template-columns:1fr;gap:22px}}@media(max-width:620px){.destination-editor-page{width:min(100% - 32px,1040px);padding:28px 0 60px}.destination-editor-page__header{align-items:start;flex-direction:column}.destination-editor-page__actions{width:100%;flex-wrap:wrap}.destination-editor-page__actions button{min-width:calc(50% - 4px);flex:1}.manager-editor-card{padding:20px}.manager-form-grid,.destination-facts article{grid-template-columns:1fr}.destination-facts .manager-icon-button{justify-self:end}.manager-cover-field{grid-template-columns:130px minmax(0,1fr)}.manager-cover-field>img,.manager-image-placeholder{width:130px;height:104px}.manager-gallery article{grid-template-columns:48px 1fr auto}.manager-gallery article input:nth-of-type(2){grid-column:2 / -1}.manager-gallery article img,.manager-gallery article>span{width:48px}.manager-editor-footer{align-items:start;flex-direction:column}.manager-editor-footer>div{width:100%}.manager-editor-footer button{flex:1}.manager-required{margin-left:3px}.manager-cover-field--invalid{padding:7px}}
</style>
