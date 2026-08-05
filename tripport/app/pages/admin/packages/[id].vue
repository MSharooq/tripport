<script setup lang="ts">
import type { ImageAsset, Meal, PackageDay, TripPackage } from '~/data/packages/types'
import { createPackageDraft, packageValidationIssues, toSlug, validationMessage, type ManagedPackageRow } from '~/data/manager'

definePageMeta({ layout: 'admin', middleware: 'manager' })

const route = useRoute()
const { request } = useManagerApi()
const isNew = computed(() => route.params.id === 'new')
const packageDocument = ref<TripPackage | null>(null)
const loading = ref(true)
const saving = ref(false)
const message = ref('')
const uploading = ref<'cover' | 'gallery' | 'day' | null>(null)
const imageUpload = useResponsiveImageUpload()
const uploadProgress = imageUpload.progress
const showPreview = ref(false)
const showPublishValidation = ref(false)
const mealOptions: Meal[] = ['Breakfast', 'Lunch', 'Dinner']
const destinationText = computed({
  get: () => packageDocument.value?.destination.locations.join(', ') ?? '',
  set: value => { if (packageDocument.value) packageDocument.value.destination.locations = splitValues(value) },
})
const highlightsText = computed({
  get: () => packageDocument.value?.highlights?.join('\n') ?? '',
  set: value => { if (packageDocument.value) packageDocument.value.highlights = splitLines(value) },
})
const suitableForText = computed({
  get: () => packageDocument.value?.suitableFor?.join('\n') ?? '',
  set: value => { if (packageDocument.value) packageDocument.value.suitableFor = splitLines(value) },
})
const inclusionsText = computed({
  get: () => packageDocument.value?.inclusions.join('\n') ?? '',
  set: value => { if (packageDocument.value) packageDocument.value.inclusions = splitLines(value) },
})
const exclusionsText = computed({
  get: () => packageDocument.value?.exclusions.join('\n') ?? '',
  set: value => { if (packageDocument.value) packageDocument.value.exclusions = splitLines(value) },
})
const termsText = computed({
  get: () => packageDocument.value?.additionalTerms?.join('\n') ?? '',
  set: value => { if (packageDocument.value) packageDocument.value.additionalTerms = splitLines(value) },
})
const importantText = computed({
  get: () => packageDocument.value?.importantInformation?.join('\n') ?? '',
  set: value => { if (packageDocument.value) packageDocument.value.importantInformation = splitLines(value) },
})
const keywordsText = computed({
  get: () => packageDocument.value?.seo.keywords?.join(', ') ?? '',
  set: value => { if (packageDocument.value) packageDocument.value.seo.keywords = splitValues(value) },
})
const publishIssues = computed(() => packageDocument.value ? packageValidationIssues(packageDocument.value, 'published') : [])
const publishChecklist = computed(() => {
  const missing = new Set(publishIssues.value.map(issue => issue.id))
  const complete = (...ids: string[]) => ids.every(id => !missing.has(id))
  return [
    { label: 'Title and URL slug', complete: complete('title', 'slug') },
    { label: 'Destination and duration', complete: complete('duration', 'destination') },
    { label: 'Summary and journey introduction', complete: complete('summary', 'description') },
    { label: 'Cover image', complete: complete('cover') },
    { label: 'Every day has a title and description', complete: complete('itinerary') },
    { label: 'Inclusions and exclusions', complete: complete('inclusions', 'exclusions') },
    { label: 'SEO page title and description', complete: complete('seo-title', 'seo-description') },
  ]
})

function splitLines(value: string) { return value.split('\n').map(item => item.trim()).filter(Boolean) }
function splitValues(value: string) { return value.split(',').map(item => item.trim()).filter(Boolean) }

async function load() {
  try {
    if (isNew.value) {
      packageDocument.value = createPackageDraft()
      prepareDocument(packageDocument.value)
      return
    }

    const result = await request<ManagedPackageRow>(`/api/admin/packages/${route.params.id}`)
    packageDocument.value = structuredClone(result.data)
    prepareDocument(packageDocument.value)
  } catch (error) {
    message.value = error instanceof Error ? error.message : 'We could not load this package.'
  } finally { loading.value = false }
}

function prepareDocument(document: TripPackage) {
  document.images.gallery ||= []
  document.highlights ||= []
  document.suitableFor ||= []
  document.importantInformation ||= []
  document.additionalTerms ||= []
  document.faq ||= []
  document.seo.keywords ||= []
  document.accommodation ||= { category: '', roomType: '', occupancy: '', properties: [], hotelNote: '' }
  document.transport ||= { type: 'Private road transport', vehicle: '', pickupLocations: [], dropLocations: [], driverIncluded: true, fuelIncluded: true, tollsAndParkingIncluded: true, vehicleNote: '' }
  document.itinerary.forEach((day) => {
    day.routeLegs ||= []
    day.activities ||= []
    day.optionalActivities ||= []
    day.meals ||= []
  })
}

function updateSlug() {
  if (isNew.value && packageDocument.value) packageDocument.value.slug = toSlug(packageDocument.value.title)
}

function addDay() {
  const itinerary = packageDocument.value?.itinerary
  if (!itinerary) return
  itinerary.push({ day: itinerary.length + 1, title: '', description: '', routeLegs: [], activities: [], optionalActivities: [], meals: [], overnightAt: '' })
}

function removeDay(index: number) {
  const itinerary = packageDocument.value?.itinerary
  if (!itinerary || itinerary.length === 1) return
  itinerary.splice(index, 1)
  itinerary.forEach((day, dayIndex) => { day.day = dayIndex + 1 })
}

function addRoute(day: PackageDay) { day.routeLegs ||= []; day.routeLegs.push({ from: '', to: '', mode: 'Private road transfer', distanceKm: undefined, estimatedTravelTime: '' }) }
function addActivity(day: PackageDay, optional = false) {
  if (optional) { day.optionalActivities ||= []; day.optionalActivities.push({ title: '', description: '', duration: '', availabilityNote: 'Available on request' }) }
  else { day.activities ||= []; day.activities.push({ title: '', description: '', duration: '', included: true }) }
}
function removeImage(index: number) { packageDocument.value?.images.gallery?.splice(index, 1) }
function removeCoverImage() {
  if (!packageDocument.value) return
  packageDocument.value.images.cover = { url: '', alt: '' }
}
function addGalleryImage() { packageDocument.value?.images.gallery?.push({ url: '', alt: '' }) }
function addFaq() { packageDocument.value?.faq?.push({ question: '', answer: '' }) }
function addDayImage(day: PackageDay) {
  if (import.meta.server || uploading.value) return
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/jpeg,image/png,image/webp'
  input.addEventListener('change', event => { void uploadImage(event, 'day', day) }, { once: true })
  input.click()
}
function clearImageVariants(image: ImageAsset) {
  image.variants = undefined
  image.width = undefined
  image.height = undefined
}
function imageVariantUrl(image: ImageAsset) {
  const hero = image.variants?.hero
  return typeof hero === 'string' ? hero : hero?.url || ''
}
function normaliseImageVariants(document: TripPackage) {
  const images = [document.images.cover, ...(document.images.gallery ?? []), ...document.itinerary.flatMap(day => day.image ? [day.image] : [])]
  images.forEach((image) => {
    if (imageVariantUrl(image) && imageVariantUrl(image) !== image.url) clearImageVariants(image)
  })
}
function toggleMeal(day: PackageDay, meal: Meal) {
  day.meals ||= []
  const index = day.meals.indexOf(meal)
  if (index === -1) day.meals.push(meal)
  else day.meals.splice(index, 1)
}
function hasMissingRequirement(...ids: string[]) {
  return showPublishValidation.value && ids.some(id => publishIssues.value.some(issue => issue.id === id))
}

async function uploadImage(event: Event, target: 'cover' | 'gallery' | 'day', day?: PackageDay) {
  const input = event.target as HTMLInputElement
  if (uploading.value) { input.value = ''; return }
  const file = input.files?.[0]
  const supabase = useTripportSupabase()
  if (!file || !packageDocument.value) return
  if (!supabase) {
    message.value = 'Image uploads need a connected Supabase project.'
    return
  }

  uploading.value = target
  message.value = ''
  try {
    const image = await imageUpload.upload(file, supabase, { folder: `packages/${packageDocument.value.id}` })
    if (target === 'cover') {
      packageDocument.value.images.cover = { ...image, alt: packageDocument.value.images.cover.alt || '' }
    } else if (target === 'gallery') {
      packageDocument.value.images.gallery?.push({ ...image, alt: '' })
    } else if (day) {
      day.image = { ...image, alt: day.image?.alt || '' }
    }
  } catch (error) {
    message.value = error instanceof Error ? error.message : 'The image could not be processed.'
  } finally {
    input.value = ''
    uploading.value = null
  }
}

async function save(status?: TripPackage['status']) {
  if (!packageDocument.value) return
  normaliseImageVariants(packageDocument.value)
  const nextStatus = status ?? packageDocument.value.status
  const issues = packageValidationIssues(packageDocument.value, nextStatus === 'published' ? 'published' : 'draft')
  if (issues.length) {
    if (nextStatus === 'published') showPublishValidation.value = true
    message.value = validationMessage('package', issues, nextStatus === 'published' ? 'publish' : 'save')
    return
  }

  packageDocument.value.status = nextStatus
  saving.value = true
  message.value = ''
  try {
    if (isNew.value) {
      await request('/api/admin/packages', { method: 'POST', body: packageDocument.value })
      await navigateTo(`/admin/packages/${packageDocument.value.id}`)
    } else {
      await request(`/api/admin/packages/${packageDocument.value.id}`, { method: 'PUT', body: packageDocument.value })
      message.value = packageDocument.value.status === 'published' ? 'Package published and ready for the website.' : 'Draft saved.'
    }
  } catch (error) {
    message.value = error instanceof Error ? error.message : 'The package could not be saved.'
  } finally { saving.value = false }
}

onMounted(load)
</script>

<template>
  <AdminShell section="packages">
    <div class="package-editor-page">
      <header class="package-editor-page__header">
        <div><NuxtLink class="manager-back" to="/admin/packages"><MaterialIcon name="arrow_back" :size="17" />Packages</NuxtLink><span class="manager-kicker">{{ isNew ? 'New package' : packageDocument?.status || 'Package' }}</span><h1>{{ isNew ? 'Build a new journey.' : packageDocument?.title || 'Edit package' }}</h1><p>Work through the sections below. Save it as a draft until everything is ready.</p></div>
        <div class="package-editor-page__actions"><button class="manager-secondary-button" :disabled="saving" type="button" @click="showPreview = true"><MaterialIcon name="visibility" :size="17" />Preview</button><button class="manager-secondary-button" :disabled="saving" type="button" @click="save('draft')">Save draft</button><button class="manager-action" :disabled="saving" type="button" @click="save('published')"><MaterialIcon name="check" :size="17" />{{ saving ? 'Saving…' : 'Publish' }}</button></div>
      </header>

      <p v-if="message" class="manager-notice" :class="{ 'manager-notice--success': message.includes('saved') || message.includes('published') }">{{ message }}</p>
      <div v-if="loading" class="manager-editor-loading">Loading package…</div>

      <form v-else-if="packageDocument" class="package-editor" @submit.prevent="save()">
        <AdminPublishChecklist :items="publishChecklist" />

        <section class="manager-editor-card manager-editor-card--intro" :class="{ 'manager-editor-card--needs-attention': hasMissingRequirement('title', 'slug', 'duration', 'destination', 'summary', 'description') }">
          <div>
            <span class="manager-kicker">01 · The essentials</span>
            <h2>Give the journey its shape.</h2>
            <p><strong>Required to publish:</strong> title, URL slug, duration, state, destinations, card summary and journey introduction.</p>
          </div>
          <div class="manager-form-grid">
            <label class="manager-field manager-field--wide"><span>Package title <em class="manager-required">Required</em></span><input v-model="packageDocument.title" :aria-invalid="hasMissingRequirement('title')" aria-required="true" type="text" placeholder="e.g. Munnar & Backwaters Escape" @input="updateSlug"></label>
            <label class="manager-field"><span>URL slug <em class="manager-required">Required</em></span><input v-model="packageDocument.slug" :aria-invalid="hasMissingRequirement('slug')" aria-required="true" type="text" placeholder="munnar-backwaters-escape"></label>
            <label class="manager-field"><span>Package type</span><select v-model="packageDocument.packageType"><option value="private-tour">Private tour</option><option value="family-holiday">Family holiday</option><option value="honeymoon">Honeymoon</option><option value="group-tour">Group tour</option><option value="fixed-departure">Fixed departure</option></select></label>
            <label class="manager-field manager-field--wide"><span>Subtitle <small>Optional</small></span><input v-model="packageDocument.subtitle" type="text" placeholder="A short supporting line"></label>
            <label class="manager-field"><span>Days <em class="manager-required">Required</em></span><input v-model.number="packageDocument.duration.days" :aria-invalid="hasMissingRequirement('duration')" aria-required="true" min="1" type="number"></label>
            <label class="manager-field"><span>Nights <em class="manager-required">Required</em></span><input v-model.number="packageDocument.duration.nights" :aria-invalid="hasMissingRequirement('duration')" aria-required="true" min="0" type="number"></label>
            <label class="manager-field"><span>State <em class="manager-required">Required</em></span><input v-model="packageDocument.destination.state" :aria-invalid="hasMissingRequirement('destination')" aria-required="true" type="text" placeholder="Kerala"></label>
            <label class="manager-field manager-field--wide"><span>Destinations <em class="manager-required">Required</em> <small>Separate with commas</small></span><input v-model="destinationText" :aria-invalid="hasMissingRequirement('destination')" aria-required="true" type="text" placeholder="Kochi, Munnar, Alleppey"></label>
            <label class="manager-field manager-field--wide"><span>Card summary <em class="manager-required">Required</em></span><textarea v-model="packageDocument.summary" :aria-invalid="hasMissingRequirement('summary')" aria-required="true" rows="3" placeholder="A concise reason to choose this route"></textarea></label>
            <label class="manager-field manager-field--wide"><span>Journey introduction <em class="manager-required">Required</em></span><textarea v-model="packageDocument.description" :aria-invalid="hasMissingRequirement('description')" aria-required="true" rows="4" placeholder="Describe the rhythm and character of this itinerary"></textarea></label>
          </div>
        </section>

        <section class="manager-editor-card" :class="{ 'manager-editor-card--needs-attention': hasMissingRequirement('cover') }">
          <div><span class="manager-kicker">02 · Visuals</span><h2>Make the first impression count.</h2><p><strong>Required to publish:</strong> one landscape cover image. Gallery images are optional.</p></div>
          <div class="manager-images">
            <div class="manager-cover-field">
              <img v-if="packageDocument.images.cover.url" :src="packageDocument.images.cover.url" :alt="packageDocument.images.cover.alt || ''">
              <div v-else class="manager-image-placeholder" :class="{ 'is-required': hasMissingRequirement('cover') }"><MaterialIcon name="image" :size="27" />Cover image <em class="manager-required">Required</em></div>
              <div class="manager-cover-actions">
                <label class="manager-upload-button"><input accept="image/jpeg,image/png,image/webp" type="file" @change="uploadImage($event, 'cover')"><MaterialIcon name="add" :size="17" />{{ uploading === 'cover' ? 'Uploading…' : packageDocument.images.cover.url ? 'Replace cover' : 'Upload cover' }}</label>
                <button v-if="packageDocument.images.cover.url" class="manager-remove-cover" type="button" @click="removeCoverImage"><MaterialIcon name="close" :size="16" />Remove cover</button>
              </div>
              <input v-model="packageDocument.images.cover.url" :aria-invalid="hasMissingRequirement('cover')" aria-required="true" class="manager-image-url" type="url" placeholder="or paste an image URL">
              <input v-model="packageDocument.images.cover.alt" class="manager-image-url" type="text" placeholder="Describe the image for accessibility">
            </div>
            <div class="manager-gallery"><article v-for="(image, index) in packageDocument.images.gallery" :key="index"><img v-if="image.url" :src="image.url" :alt="image.alt || ''"><span v-else><MaterialIcon name="image" :size="20" /></span><input v-model="image.url" type="url" placeholder="Image URL"><input v-model="image.alt" type="text" placeholder="Image description"><button type="button" @click="removeImage(index)"><MaterialIcon name="close" :size="17" />Remove</button></article><label class="manager-gallery-add"><input accept="image/jpeg,image/png,image/webp" type="file" @change="uploadImage($event, 'gallery')"><MaterialIcon name="add" :size="20" />{{ uploading === 'gallery' ? 'Uploading…' : 'Upload gallery image' }}</label><button class="manager-text-button" type="button" @click="addGalleryImage"><MaterialIcon name="add" :size="17" />Add image link</button></div>
          </div>
        </section>

        <section class="manager-editor-card" :class="{ 'manager-editor-card--needs-attention': hasMissingRequirement('itinerary') }">
          <div><span class="manager-kicker">03 · Day-by-day plan</span><h2>Make each day easy to understand.</h2><p><strong>Required to publish:</strong> every day needs a title and description. Routes, meals, images and activities are optional.</p></div>
          <div class="manager-days"><article v-for="(day, dayIndex) in packageDocument.itinerary" :key="dayIndex" class="manager-day" :class="{ 'manager-day--needs-attention': showPublishValidation && (!day.title.trim() || !day.description.trim()) }"><div class="manager-day__rail"><span>Day</span><strong>{{ String(day.day).padStart(2, '0') }}</strong></div><div class="manager-day__content"><div class="manager-day__heading"><label class="manager-field"><span>Day title <em class="manager-required">Required</em></span><input v-model="day.title" :aria-invalid="showPublishValidation && !day.title.trim()" aria-required="true" type="text" placeholder="e.g. Kochi to Munnar"></label><button v-if="packageDocument.itinerary.length > 1" class="manager-icon-button" type="button" aria-label="Remove day" @click="removeDay(dayIndex)"><MaterialIcon name="delete" :size="18" /></button></div><label class="manager-field"><span>What happens today? <em class="manager-required">Required</em></span><textarea v-model="day.description" :aria-invalid="showPublishValidation && !day.description.trim()" aria-required="true" rows="3" placeholder="Describe the day in a clear, welcoming way."></textarea></label><template v-if="day.image"><label class="manager-field"><span>Day image URL <small>Optional</small></span><input v-model="day.image.url" type="url" placeholder="Paste a day-level image URL"></label><div class="manager-inline-grid"><label class="manager-field"><span>Image description</span><input v-model="day.image.alt" type="text" placeholder="Describe this day’s image"></label><button class="manager-text-button" type="button" @click="day.image = undefined"><MaterialIcon name="close" :size="16" />Remove day image</button></div></template><button v-else class="manager-text-button manager-text-button--left" type="button" @click="addDayImage(day)"><MaterialIcon name="add" :size="16" />Add a day image</button><div class="manager-day-block"><div class="manager-day-block__heading"><strong>Route legs <small>Optional</small></strong><button class="manager-text-button" type="button" @click="addRoute(day)"><MaterialIcon name="add" :size="16" />Add route</button></div><div v-for="(leg, legIndex) in day.routeLegs" :key="legIndex" class="manager-inline-grid manager-inline-grid--route"><label class="manager-field"><span>From</span><input v-model="leg.from" type="text" placeholder="Kochi"></label><label class="manager-field"><span>To</span><input v-model="leg.to" type="text" placeholder="Munnar"></label><label class="manager-field"><span>Distance (km)</span><input v-model.number="leg.distanceKm" min="0" type="number"></label><label class="manager-field"><span>Travel time</span><input v-model="leg.estimatedTravelTime" type="text" placeholder="4–5 hours"></label><button class="manager-icon-button manager-icon-button--inline" type="button" aria-label="Remove route" @click="day.routeLegs?.splice(legIndex, 1)"><MaterialIcon name="close" :size="17" /></button></div></div><div class="manager-day-block"><div class="manager-day-block__heading"><strong>Included experiences <small>Optional</small></strong><button class="manager-text-button" type="button" @click="addActivity(day)"><MaterialIcon name="add" :size="16" />Add experience</button></div><div v-for="(activity, activityIndex) in day.activities" :key="activityIndex" class="manager-activity"><label class="manager-field"><span>Experience</span><input v-model="activity.title" type="text" placeholder="e.g. Tea garden viewpoints"></label><label class="manager-field"><span>Details</span><input v-model="activity.description" type="text" placeholder="Optional short note"></label><label class="manager-field"><span>Duration</span><input v-model="activity.duration" type="text" placeholder="2–3 hours"></label><button class="manager-icon-button manager-icon-button--inline" type="button" aria-label="Remove experience" @click="day.activities?.splice(activityIndex, 1)"><MaterialIcon name="close" :size="17" /></button></div></div><div class="manager-day-block"><div class="manager-day-block__heading"><strong>More to explore <small>Optional</small></strong><button class="manager-text-button" type="button" @click="addActivity(day, true)"><MaterialIcon name="add" :size="16" />Add optional activity</button></div><div v-for="(activity, activityIndex) in day.optionalActivities" :key="activityIndex" class="manager-activity"><label class="manager-field"><span>Activity</span><input v-model="activity.title" type="text" placeholder="e.g. Tea museum"></label><label class="manager-field"><span>Availability note</span><input v-model="activity.availabilityNote" type="text" placeholder="Available on request"></label><button class="manager-icon-button manager-icon-button--inline" type="button" aria-label="Remove activity" @click="day.optionalActivities?.splice(activityIndex, 1)"><MaterialIcon name="close" :size="17" /></button></div></div><div class="manager-inline-grid"><label class="manager-field"><span>Overnight at <small>Optional</small></span><input v-model="day.overnightAt" type="text" placeholder="Munnar"></label><fieldset class="manager-meal-picker"><legend>Meals included <small>Optional · choose every meal included for this day</small></legend><div><button v-for="meal in mealOptions" :key="meal" type="button" :class="{ 'is-selected': day.meals?.includes(meal) }" :aria-pressed="day.meals?.includes(meal)" @click="toggleMeal(day, meal)"><MaterialIcon :name="day.meals?.includes(meal) ? 'check' : 'add'" :size="15" />{{ meal }}</button></div></fieldset></div></div></article><button class="manager-add-day" type="button" @click="addDay"><MaterialIcon name="add" :size="19" />Add another day</button></div>
        </section>

        <section class="manager-editor-card" :class="{ 'manager-editor-card--needs-attention': hasMissingRequirement('inclusions', 'exclusions') }">
          <div><span class="manager-kicker">04 · What is included</span><h2>Set clear expectations.</h2><p><strong>Required to publish:</strong> at least one inclusion and one exclusion. One line equals one bullet point.</p></div>
          <div class="manager-form-grid"><label class="manager-field manager-field--wide"><span>Journey highlights <small>Optional · one per line</small></span><textarea v-model="highlightsText" rows="5" placeholder="Tea country&#10;Backwater houseboat stay"></textarea></label><label class="manager-field manager-field--wide"><span>Well suited for <small>Optional · one per line</small></span><textarea v-model="suitableForText" rows="5" placeholder="Couples&#10;First-time Kerala visitors"></textarea></label><label class="manager-field manager-field--wide"><span>Inclusions <em class="manager-required">Required</em> <small>One per line</small></span><textarea v-model="inclusionsText" :aria-invalid="hasMissingRequirement('inclusions')" aria-required="true" rows="7" placeholder="One inclusion per line"></textarea></label><label class="manager-field manager-field--wide"><span>Exclusions <em class="manager-required">Required</em> <small>One per line</small></span><textarea v-model="exclusionsText" :aria-invalid="hasMissingRequirement('exclusions')" aria-required="true" rows="7" placeholder="One exclusion per line"></textarea></label><label class="manager-field manager-field--wide"><span>Important information <small>Optional · one per line</small></span><textarea v-model="importantText" rows="5" placeholder="One useful note per line"></textarea></label><label class="manager-field manager-field--wide"><span>Package-specific terms <small>Optional</small></span><textarea v-model="termsText" rows="5" placeholder="Only add exceptions or package-specific terms"></textarea></label></div>
        </section>

        <section class="manager-editor-card"><div><span class="manager-kicker">05 · Stay & transport</span><h2>Give the operational outline.</h2><p>All fields in this section are optional. They help your team shape the right enquiry response.</p></div><div class="manager-form-grid"><template v-if="packageDocument.accommodation && packageDocument.transport"><label class="manager-field"><span>Accommodation style</span><input v-model="packageDocument.accommodation.category" type="text" placeholder="Comfort boutique stays"></label><label class="manager-field"><span>Room type</span><input v-model="packageDocument.accommodation.roomType" type="text" placeholder="Standard double room"></label><label class="manager-field"><span>Occupancy</span><input v-model="packageDocument.accommodation.occupancy" type="text" placeholder="2 guests per room"></label><label class="manager-field"><span>Vehicle</span><input v-model="packageDocument.transport.vehicle" type="text" placeholder="Air-conditioned premium MPV"></label><label class="manager-field"><span>Transport type</span><input v-model="packageDocument.transport.type" type="text" placeholder="Private road transport"></label><label class="manager-field"><span>Vehicle note</span><input v-model="packageDocument.transport.vehicleNote" type="text" placeholder="Optional note"></label></template></div></section>

        <section class="manager-editor-card" :class="{ 'manager-editor-card--needs-attention': hasMissingRequirement('seo-title', 'seo-description') }"><div><span class="manager-kicker">06 · Questions & search</span><h2>Help travellers find the right answer.</h2><p>FAQs are optional. <strong>SEO title and description are required to publish.</strong></p></div><div class="manager-faqs"><article v-for="(faq, index) in packageDocument.faq" :key="index"><label class="manager-field"><span>Question</span><input v-model="faq.question" type="text" placeholder="e.g. Are the hotels shown guaranteed?"></label><label class="manager-field"><span>Answer</span><textarea v-model="faq.answer" rows="2" placeholder="Write a clear, helpful answer."></textarea></label><button class="manager-icon-button" type="button" aria-label="Remove question" @click="packageDocument.faq?.splice(index, 1)"><MaterialIcon name="close" :size="18" /></button></article><button class="manager-text-button" type="button" @click="addFaq"><MaterialIcon name="add" :size="16" />Add a question</button></div><div class="manager-form-grid manager-form-grid--seo"><label class="manager-field manager-field--wide"><span>SEO page title <em class="manager-required">Required</em></span><input v-model="packageDocument.seo.metaTitle" :aria-invalid="hasMissingRequirement('seo-title')" aria-required="true" type="text" placeholder="Munnar & Alleppey 4-Day Kerala Itinerary | Tripport"></label><label class="manager-field manager-field--wide"><span>SEO description <em class="manager-required">Required</em></span><textarea v-model="packageDocument.seo.metaDescription" :aria-invalid="hasMissingRequirement('seo-description')" aria-required="true" rows="3" placeholder="A concise search result description"></textarea></label><label class="manager-field manager-field--wide"><span>SEO keywords <small>Optional · separate with commas</small></span><input v-model="keywordsText" type="text" placeholder="Munnar Alleppey itinerary, Kerala houseboat tour"></label></div></section>

        <footer class="manager-editor-footer"><span>Nothing is public until you choose Publish.</span><div><button class="manager-secondary-button" :disabled="saving" type="button" @click="showPreview = true"><MaterialIcon name="visibility" :size="17" />Preview</button><button class="manager-secondary-button" :disabled="saving" type="button" @click="save('draft')">Save draft</button><button class="manager-action" :disabled="saving" type="submit"><MaterialIcon name="check" :size="17" />{{ packageDocument.status === 'published' ? 'Save published changes' : 'Publish package' }}</button></div></footer>
      </form>
      <AdminPackagePreview v-if="showPreview && packageDocument" :package-document="packageDocument" @close="showPreview = false" />
    </div>
  </AdminShell>
</template>

<style scoped>
.package-editor-page{width:min(1040px,calc(100% - 64px));margin:0 auto;padding:36px 0 80px}.package-editor-page__header{display:flex;align-items:end;justify-content:space-between;gap:26px;margin-bottom:26px}.manager-back{display:inline-flex;align-items:center;gap:5px;margin-bottom:24px;color:#43675a;font-size:13px;font-weight:800}.manager-kicker{display:block;color:#2a7659;font-size:11px;font-weight:850;letter-spacing:.13em;text-transform:uppercase}.package-editor-page h1{margin:8px 0 9px;color:#123629;font-size:clamp(34px,4vw,49px);letter-spacing:-.07em;line-height:.95}.package-editor-page__header p{max-width:600px;margin:0;color:#68786f;font-size:15px;line-height:1.6}.package-editor-page__actions,.manager-editor-footer>div{display:flex;gap:8px}.manager-action,.manager-secondary-button{display:inline-flex;min-height:43px;align-items:center;justify-content:center;gap:8px;padding:0 14px;border-radius:10px;font-size:13px;font-weight:800}.manager-action{border:0;background:#113e32;color:#fff}.manager-action:hover{background:#0e3028}.manager-secondary-button{border:1px solid #ccdbd3;background:#fff;color:#2d5042}.manager-secondary-button:hover{border-color:#8eaf9f;background:#f3f8f4}.manager-action:disabled,.manager-secondary-button:disabled{opacity:.6;cursor:wait}.manager-notice{margin:0 0 22px;padding:12px 14px;border-radius:10px;background:#fff0ed;color:#a43721;font-size:14px;font-weight:700}.manager-notice--success{background:#e9f6ee;color:#205e43}.manager-editor-loading{padding:70px 0;color:#718078;text-align:center}.package-editor{display:grid;gap:18px}.manager-editor-card{display:grid;grid-template-columns:230px minmax(0,1fr);gap:35px;padding:29px;border:1px solid #dce7e0;border-radius:18px;background:#fff}.manager-editor-card h2{margin:8px 0 8px;color:#173c2e;font-size:25px;letter-spacing:-.055em;line-height:1}.manager-editor-card>div>p{margin:0;color:#728178;font-size:13px;line-height:1.6}.manager-form-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:15px}.manager-form-grid--seo{margin-top:24px}.manager-field{display:grid;gap:7px;color:#405f52;font-size:12px;font-weight:800}.manager-field>span{display:block}.manager-field small{color:#88958e;font-size:10px;font-weight:650}.manager-field--wide{grid-column:1 / -1}.manager-field input,.manager-field select,.manager-field textarea{width:100%;border:1px solid #d3e0d8;border-radius:9px;outline:0;background:#fff;color:#173b2e;font-size:14px;font-weight:500;line-height:1.5}.manager-field input,.manager-field select{height:43px;padding:0 11px}.manager-field textarea{min-height:43px;padding:10px 11px;resize:vertical}.manager-field select[multiple]{height:86px;padding:6px 10px}.manager-field input:focus,.manager-field select:focus,.manager-field textarea:focus{border-color:#277656;box-shadow:0 0 0 3px rgb(39 118 86 / 10%)}.manager-images{display:grid;gap:18px}.manager-cover-field{display:grid;grid-template-columns:180px minmax(0,1fr);grid-template-rows:auto auto;gap:9px 15px;align-items:center}.manager-cover-field>img,.manager-image-placeholder{grid-row:1 / 3;width:180px;height:126px;border-radius:12px;object-fit:cover}.manager-image-placeholder{display:grid;place-items:center;gap:6px;background:#edf4ef;color:#608071;font-size:12px;font-weight:800}.manager-upload-button,.manager-gallery-add{display:inline-flex;align-items:center;justify-content:center;gap:7px;cursor:pointer}.manager-upload-button{justify-self:start;padding:8px 10px;border-radius:8px;background:#e8f3ec;color:#1f6549;font-size:12px;font-weight:800}.manager-upload-button input,.manager-gallery-add input{position:absolute;width:1px;height:1px;opacity:0;pointer-events:none}.manager-image-url{width:100%;height:38px;padding:0 10px;border:1px solid #d6e3db;border-radius:8px;color:#345749;font-size:12px;outline:none}.manager-image-url:focus{border-color:#277656}.manager-gallery{display:grid;gap:10px}.manager-gallery article{display:grid;grid-template-columns:58px minmax(0,1fr) minmax(0,1fr) auto;gap:8px;align-items:center}.manager-gallery article img,.manager-gallery article>span{width:58px;height:48px;border-radius:8px;object-fit:cover}.manager-gallery article>span{display:grid;place-items:center;background:#edf4ef;color:#638173}.manager-gallery article input{min-width:0;height:38px;padding:0 9px;border:1px solid #d6e3db;border-radius:8px;font-size:12px;outline:none}.manager-gallery article button,.manager-text-button{display:inline-flex;align-items:center;justify-content:center;gap:5px;border:0;background:transparent;color:#2b7658;font-size:12px;font-weight:800}.manager-gallery article button{color:#856156}.manager-gallery-add{min-height:46px;border:1px dashed #a6c9b5;border-radius:9px;background:#f6faf7;color:#2b7658;font-size:12px;font-weight:800}.manager-days{display:grid;gap:13px}.manager-day{display:grid;grid-template-columns:86px minmax(0,1fr);overflow:hidden;border:1px solid #dce8e0;border-radius:14px}.manager-day__rail{padding:18px 12px;background:#eff6f1;color:#235b45}.manager-day__rail span{display:block;font-size:9px;font-weight:850;letter-spacing:.14em;text-transform:uppercase}.manager-day__rail strong{display:block;margin-top:4px;font-size:34px;letter-spacing:-.075em}.manager-day__content{display:grid;gap:17px;padding:18px}.manager-day__heading{display:flex;align-items:end;gap:9px}.manager-day__heading .manager-field{flex:1}.manager-icon-button{display:grid;width:32px;height:32px;flex:0 0 auto;place-items:center;border:1px solid #d7e2db;border-radius:8px;background:#fff;color:#63746c}.manager-icon-button:hover{border-color:#e8b8ad;background:#fff5f2;color:#b34830}.manager-icon-button--inline{align-self:end;margin-bottom:5px}.manager-day-block{display:grid;gap:10px;padding-top:15px;border-top:1px solid #e6eee8}.manager-day-block__heading{display:flex;align-items:center;justify-content:space-between;gap:10px}.manager-day-block__heading strong{color:#315449;font-size:12px}.manager-day-block__heading small{color:#87958d;font-size:10px;font-weight:600}.manager-inline-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.manager-inline-grid--route{grid-template-columns:1fr 1fr 100px 130px 32px}.manager-activity{display:grid;grid-template-columns:1fr 1.25fr 110px 32px;gap:10px}.manager-add-day{display:flex;min-height:48px;align-items:center;justify-content:center;gap:7px;border:1px dashed #8db89f;border-radius:10px;background:#f6fbf7;color:#287052;font-size:13px;font-weight:800}.manager-faqs{display:grid;gap:11px}.manager-faqs article{display:grid;grid-template-columns:1fr 1.3fr 32px;gap:10px;align-items:end;padding:13px;border:1px solid #e3ece6;border-radius:10px;background:#f9fbfa}.manager-editor-footer{display:flex;align-items:center;justify-content:space-between;gap:18px;padding:5px 0;color:#718078;font-size:13px}@media(max-width:860px){.manager-editor-card{grid-template-columns:1fr;gap:22px}.manager-cover-field{grid-template-columns:130px minmax(0,1fr)}.manager-cover-field>img,.manager-image-placeholder{width:130px;height:104px}.manager-inline-grid--route{grid-template-columns:1fr 1fr}.manager-inline-grid--route .manager-icon-button{grid-column:2;justify-self:end}.manager-activity{grid-template-columns:1fr 1fr}.manager-activity .manager-icon-button{justify-self:end}.manager-faqs article{grid-template-columns:1fr}.manager-faqs .manager-icon-button{justify-self:end}}@media(max-width:620px){.package-editor-page{width:min(100% - 32px,1040px);padding:28px 0 60px}.package-editor-page__header{align-items:start;flex-direction:column}.package-editor-page__actions{width:100%}.package-editor-page__actions button{flex:1}.manager-editor-card{padding:20px}.manager-form-grid,.manager-inline-grid{grid-template-columns:1fr}.manager-gallery article{grid-template-columns:48px 1fr auto}.manager-gallery article input:nth-of-type(2){grid-column:2 / -1}.manager-gallery article img,.manager-gallery article>span{width:48px}.manager-day{grid-template-columns:1fr}.manager-day__rail{display:flex;align-items:center;gap:7px;padding:11px 14px}.manager-day__rail strong{margin:0;font-size:18px}.manager-editor-footer{align-items:start;flex-direction:column}.manager-editor-footer>div{width:100%}.manager-editor-footer button{flex:1}}
</style>

<style scoped>
.manager-editor-card--needs-attention {
  border-color: #d98b72;
  background: #fffaf8;
  box-shadow: 0 0 0 3px rgb(217 139 114 / 12%);
}

.manager-editor-card--needs-attention .manager-kicker { color: #a84a31; }
.manager-editor-card > div > p strong { color: #315449; }

.manager-required {
  display: inline-flex;
  align-items: center;
  margin-left: 5px;
  padding: 2px 5px;
  border-radius: 999px;
  background: #fff0ea;
  color: #a94d32;
  font-size: 9px;
  font-style: normal;
  font-weight: 850;
  letter-spacing: .04em;
  line-height: 1.2;
  text-transform: uppercase;
}

.manager-field [aria-invalid="true"],
.manager-image-url[aria-invalid="true"] {
  border-color: #c96d53;
  background: #fffaf8;
  box-shadow: 0 0 0 3px rgb(201 109 83 / 10%);
}

.manager-image-placeholder.is-required {
  border: 1px dashed #d98b72;
  background: #fff7f4;
  color: #a34e36;
}

.manager-cover-field > img,
.manager-cover-field > .manager-image-placeholder {
  grid-row: 1 / 4;
}

.manager-cover-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.manager-remove-cover {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 8px 10px;
  border: 1px solid #ead1c9;
  border-radius: 8px;
  background: #fff;
  color: #9a4e3d;
  cursor: pointer;
  font-size: 12px;
  font-weight: 800;
}

.manager-remove-cover:hover {
  border-color: #d79b8c;
  background: #fff6f3;
}

.manager-day--needs-attention {
  border-color: #d98b72;
  box-shadow: 0 0 0 3px rgb(217 139 114 / 10%);
}

.manager-meal-picker {
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;
}

.manager-meal-picker legend {
  display: block;
  padding: 0;
  color: #405f52;
  font-size: 12px;
  font-weight: 800;
}

.manager-meal-picker legend small {
  display: block;
  margin-top: 3px;
  color: #88958e;
  font-size: 10px;
  font-weight: 650;
}

.manager-meal-picker > div {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-top: 8px;
}

.manager-meal-picker button {
  display: inline-flex;
  min-height: 36px;
  align-items: center;
  gap: 5px;
  padding: 0 10px;
  border: 1px solid #d2dfd7;
  border-radius: 999px;
  background: #fff;
  color: #53675e;
  cursor: pointer;
  font-size: 11px;
  font-weight: 800;
}

.manager-meal-picker button:hover {
  border-color: #85ac99;
  background: #f3f8f4;
}

.manager-meal-picker button.is-selected {
  border-color: #113e32;
  background: #113e32;
  color: #fff;
}

@media (max-width: 620px) {
  .manager-meal-picker > div { gap: 6px; }
  .manager-meal-picker button { flex: 1; justify-content: center; }
}
</style>
