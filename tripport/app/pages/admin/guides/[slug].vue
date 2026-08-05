<script setup lang="ts">
import type { TravelGuide } from '~/data/travelGuides'
import { createGuideDraft, guideValidationIssues, toSlug, validationMessage, type ManagedGuideRow } from '~/data/manager'

definePageMeta({ layout: 'admin', middleware: 'manager' })

const route = useRoute()
const { request } = useManagerApi()
const isNew = computed(() => route.params.slug === 'new')
const guide = ref<TravelGuide | null>(null)
const loading = ref(true)
const saving = ref(false)
const uploading = ref(false)
const imageUpload = useResponsiveImageUpload()
const message = ref('')
const showPreview = ref(false)
const showPublishValidation = ref(false)
const publishIssues = computed(() => guide.value ? guideValidationIssues(guide.value, 'published') : [])
const missingPublishRequirementIds = computed(() => new Set(publishIssues.value.map(issue => issue.id)))
const publishChecklist = computed(() => {
  const missing = missingPublishRequirementIds.value
  return [
    { label: 'Title and URL slug', complete: !missing.has('title') && !missing.has('slug') },
    { label: 'Category, summary and introduction', complete: !missing.has('category') && !missing.has('summary') && !missing.has('intro') },
    { label: 'Cover image', complete: !missing.has('image') },
    { label: 'A complete guide section', complete: !missing.has('article') },
    { label: 'SEO title and description', complete: !missing.has('seo-title') && !missing.has('seo-description') },
  ]
})
const takeawaysText = computed({
  get: () => guide.value?.takeaways.join('\n') ?? '',
  set: value => { if (guide.value) guide.value.takeaways = value.split('\n').map(item => item.trim()).filter(Boolean) },
})
const relatedText = computed({
  get: () => guide.value?.relatedItinerarySlugs.join(', ') ?? '',
  set: value => { if (guide.value) guide.value.relatedItinerarySlugs = value.split(',').map(item => item.trim()).filter(Boolean) },
})

function imageSource(image: string) { return image.startsWith('http') || image.startsWith('/') ? image : `/images/${image}` }
function guideVariantUrl() {
  const hero = guide.value?.imageVariants?.hero
  return typeof hero === 'string' ? hero : hero?.url || ''
}
function normaliseGuideImage() {
  if (!guide.value || !guideVariantUrl() || guideVariantUrl() === guide.value.image) return
  guide.value.imageVariants = undefined
  guide.value.imageWidth = undefined
  guide.value.imageHeight = undefined
}

async function load() {
  try {
    if (isNew.value) {
      guide.value = createGuideDraft()
      return
    }

    const result = await request<ManagedGuideRow>(`/api/admin/guides/${route.params.slug}`)
    guide.value = structuredClone(result.data)
    guide.value.status ||= result.status
  }
  catch (error) { message.value = error instanceof Error ? error.message : 'We could not load this guide.' }
  finally { loading.value = false }
}

function updateSlug() { if (isNew.value && guide.value) guide.value.slug = toSlug(guide.value.title) }
function addFact() { guide.value?.quickLook.push({ label: '', value: '' }) }
function addSection() { guide.value?.sections.push({ heading: '', lead: '', paragraphs: [''] }) }
function addParagraph(sectionIndex: number) { guide.value?.sections[sectionIndex]?.paragraphs.push('') }
function hasMissingRequirement(...ids: string[]) { return showPublishValidation.value && ids.some(id => missingPublishRequirementIds.value.has(id)) }
function sectionNeedsAttention(section: TravelGuide['sections'][number]) {
  return showPublishValidation.value && (!section.heading.trim() || !section.paragraphs.some(paragraph => paragraph.trim()))
}
function sectionHeadingNeedsAttention(section: TravelGuide['sections'][number]) { return showPublishValidation.value && !section.heading.trim() }
function sectionParagraphsNeedAttention(section: TravelGuide['sections'][number]) {
  return showPublishValidation.value && !section.paragraphs.some(paragraph => paragraph.trim())
}

async function uploadImage(event: Event) {
  const input = event.target as HTMLInputElement
  if (uploading.value) { input.value = ''; return }
  const file = input.files?.[0]
  const supabase = useTripportSupabase()
  if (!file || !guide.value) return
  if (!supabase) {
    message.value = 'Image uploads need a connected Supabase project.'
    return
  }
  uploading.value = true
  message.value = ''
  try {
    const image = await imageUpload.upload(file, supabase, { folder: `guides/${guide.value.slug || crypto.randomUUID()}` })
    guide.value.image = image.url
    guide.value.imageVariants = image.variants
    guide.value.imageWidth = image.width
    guide.value.imageHeight = image.height
  } catch (error) {
    message.value = error instanceof Error ? error.message : 'The image could not be processed.'
  } finally {
    input.value = ''
    uploading.value = false
  }
}

async function save(status?: 'draft' | 'published') {
  if (!guide.value) return
  normaliseGuideImage()
  const nextStatus = status ?? (guide.value.status === 'published' ? 'published' : 'draft')
  const issues = guideValidationIssues(guide.value, nextStatus === 'published' ? 'published' : 'draft')
  if (issues.length) {
    if (nextStatus === 'published') showPublishValidation.value = true
    message.value = validationMessage('travel guide', issues, nextStatus === 'published' ? 'publish' : 'save')
    return
  }

  if (nextStatus === 'published') showPublishValidation.value = false
  guide.value.status = nextStatus
  saving.value = true
  message.value = ''
  try {
    if (isNew.value) {
      await request('/api/admin/guides', { method: 'POST', body: guide.value })
      await navigateTo(`/admin/guides/${guide.value.slug}`)
    } else {
      const currentSlug = route.params.slug
      await request(`/api/admin/guides/${currentSlug}`, { method: 'PUT', body: guide.value })
      if (guide.value.slug !== currentSlug) {
        await navigateTo(`/admin/guides/${guide.value.slug}`)
        return
      }
      message.value = guide.value.status === 'published' ? 'Travel guide published and ready for the website.' : 'Draft saved.'
    }
  } catch (error) { message.value = error instanceof Error ? error.message : 'The guide could not be saved.' }
  finally { saving.value = false }
}

onMounted(load)
</script>

<template>
  <AdminShell section="guides">
    <div class="guide-editor-page">
      <header class="guide-editor-page__header">
        <div>
          <NuxtLink class="manager-back" to="/admin/guides"><MaterialIcon name="arrow_back" :size="17" />Travel guides</NuxtLink>
          <span class="manager-kicker">{{ isNew ? 'New travel guide' : guide?.status || 'Travel guide' }}</span>
          <h1>{{ isNew ? 'Share a useful story.' : guide?.title || 'Edit travel guide' }}</h1>
          <p>Give travellers clear, genuinely useful planning guidance—and publish only when it is ready.</p>
        </div>
        <div class="guide-editor-page__actions">
          <button class="manager-secondary-button" :disabled="saving || !guide" type="button" @click="showPreview = true"><MaterialIcon name="visibility" :size="17" />Preview</button>
          <button class="manager-secondary-button" :disabled="saving || !guide" type="button" @click="save('draft')">Save draft</button>
          <button class="manager-action" :disabled="saving || !guide" type="button" @click="save('published')"><MaterialIcon name="check" :size="17" />{{ saving ? 'Saving…' : 'Publish' }}</button>
        </div>
      </header>
      <p v-if="message" class="manager-notice" :class="{ 'manager-notice--success': message.includes('saved') || message.includes('published') }">{{ message }}</p>
      <div v-if="loading" class="manager-editor-loading">Loading travel guide…</div>
      <form v-else-if="guide" class="guide-editor" @submit.prevent="save()">
        <AdminPublishChecklist :items="publishChecklist" />

        <section class="manager-editor-card" :class="{ 'manager-editor-card--needs-attention': hasMissingRequirement('title', 'slug', 'category', 'summary', 'intro') }">
          <div>
            <span class="manager-kicker">01 · Guide basics</span>
            <h2>Set the story up well.</h2>
            <p><strong>Required to publish:</strong> a title, URL slug, category, card summary and guide introduction. Title and URL slug are also needed to save a draft.</p>
          </div>
          <div class="manager-form-grid">
            <label class="manager-field manager-field--wide" :class="{ 'manager-field--invalid': hasMissingRequirement('title') }"><span>Guide title <em class="manager-required">Required</em></span><input v-model="guide.title" type="text" placeholder="e.g. Best time to visit Kerala" required @input="updateSlug"></label>
            <label class="manager-field" :class="{ 'manager-field--invalid': hasMissingRequirement('slug') }"><span>URL slug <em class="manager-required">Required</em></span><input v-model="guide.slug" type="text" placeholder="best-time-to-visit-kerala" required></label>
            <label class="manager-field" :class="{ 'manager-field--invalid': hasMissingRequirement('category') }"><span>Category <em class="manager-required">Required to publish</em></span><input v-model="guide.category" type="text" placeholder="Seasonality"></label>
            <label class="manager-field"><span>Read time <small>Optional</small></span><input v-model="guide.readTime" type="text" placeholder="5 min read"></label>
            <label class="manager-field manager-field--wide" :class="{ 'manager-field--invalid': hasMissingRequirement('summary') }"><span>Card summary <em class="manager-required">Required to publish</em></span><textarea v-model="guide.summary" rows="3" placeholder="A concise, useful introduction"></textarea></label>
            <label class="manager-field manager-field--wide" :class="{ 'manager-field--invalid': hasMissingRequirement('intro') }"><span>Guide introduction <em class="manager-required">Required to publish</em></span><textarea v-model="guide.intro" rows="4" placeholder="A welcoming opening paragraph"></textarea></label>
          </div>
        </section>

        <section class="manager-editor-card" :class="{ 'manager-editor-card--needs-attention': hasMissingRequirement('image') }">
          <div>
            <span class="manager-kicker">02 · Cover image</span>
            <h2>Let the guide feel like a journey.</h2>
            <p><strong>Required to publish:</strong> one strong destination image. It becomes the visual introduction to this story.</p>
          </div>
          <div class="guide-image-field" :class="{ 'guide-image-field--invalid': hasMissingRequirement('image') }">
            <img v-if="guide.image" :src="imageSource(guide.image)" alt="">
            <span v-else><MaterialIcon name="image" :size="28" />Cover image</span>
            <label class="manager-upload-button"><input accept="image/jpeg,image/png,image/webp" type="file" @change="uploadImage"><MaterialIcon name="add" :size="17" />{{ uploading ? 'Uploading…' : 'Upload image' }}</label>
            <label class="manager-image-url"><span>Image URL <em class="manager-required">Required to publish</em></span><input v-model="guide.image" type="url" placeholder="or paste an image URL"></label>
          </div>
        </section>

        <section class="manager-editor-card">
          <div>
            <span class="manager-kicker">03 · Useful details</span>
            <h2>Make it easy to scan.</h2>
            <p>Optional quick facts and concise takeaways help visitors get the point before reading the full guide.</p>
          </div>
          <div>
            <div class="guide-facts">
              <article v-for="(fact, index) in guide.quickLook" :key="index"><label class="manager-field"><span>Fact label</span><input v-model="fact.label" type="text" placeholder="Classic season"></label><label class="manager-field"><span>Fact value</span><input v-model="fact.value" type="text" placeholder="October–February"></label><button class="manager-icon-button" type="button" aria-label="Remove fact" @click="guide.quickLook.splice(index, 1)"><MaterialIcon name="close" :size="17" /></button></article>
              <button class="manager-text-button" type="button" @click="addFact"><MaterialIcon name="add" :size="16" />Add quick fact</button>
            </div>
            <label class="manager-field guide-takeaways-field"><span>Key takeaways <small>Optional · one point per line</small></span><textarea v-model="takeawaysText" rows="6" placeholder="Choose cool-weather routes from October to February…"></textarea></label>
          </div>
        </section>

        <section class="manager-editor-card" :class="{ 'manager-editor-card--needs-attention': hasMissingRequirement('article') }">
          <div>
            <span class="manager-kicker">04 · The guide</span>
            <h2>Write the helpful bits.</h2>
            <p><strong>Required to publish:</strong> at least one section with a heading and one completed paragraph. Leads and additional paragraphs are optional.</p>
          </div>
          <div class="guide-sections">
            <article v-for="(section, sectionIndex) in guide.sections" :key="sectionIndex" :class="{ 'guide-sections__article--needs-attention': sectionNeedsAttention(section) }">
              <div class="guide-sections__top"><strong>Section {{ String(sectionIndex + 1).padStart(2, '0') }}</strong><button class="manager-icon-button" type="button" aria-label="Remove section" @click="guide.sections.splice(sectionIndex, 1)"><MaterialIcon name="delete" :size="17" /></button></div>
              <label class="manager-field" :class="{ 'manager-field--invalid': sectionHeadingNeedsAttention(section) }"><span>Heading <em class="manager-required">Required</em></span><input v-model="section.heading" type="text" placeholder="October to February"></label>
              <label class="manager-field"><span>Short lead <small>Optional</small></span><input v-model="section.lead" type="text" placeholder="The classic Kerala window."></label>
              <div class="guide-paragraphs">
                <label v-for="(_paragraph, paragraphIndex) in section.paragraphs" :key="paragraphIndex" class="manager-field" :class="{ 'manager-field--invalid': sectionParagraphsNeedAttention(section) }"><span>Paragraph {{ paragraphIndex + 1 }} <em v-if="paragraphIndex === 0" class="manager-required">At least one required</em><small v-else>Optional additional paragraph</small></span><textarea v-model="section.paragraphs[paragraphIndex]" rows="4" placeholder="Write a useful, clear paragraph."></textarea><button v-if="section.paragraphs.length > 1" class="manager-text-button manager-text-button--left" type="button" @click="section.paragraphs.splice(paragraphIndex, 1)"><MaterialIcon name="close" :size="15" />Remove paragraph</button></label>
                <button class="manager-text-button manager-text-button--left" type="button" @click="addParagraph(sectionIndex)"><MaterialIcon name="add" :size="16" />Add paragraph</button>
              </div>
            </article>
            <button class="manager-add-section" type="button" @click="addSection"><MaterialIcon name="add" :size="19" />Add another section</button>
          </div>
        </section>

        <section class="manager-editor-card" :class="{ 'manager-editor-card--needs-attention': hasMissingRequirement('seo-title', 'seo-description') }">
          <div>
            <span class="manager-kicker">05 · Related journeys & search</span>
            <h2>Close the loop.</h2>
            <p>Related itineraries are optional. <strong>Required to publish:</strong> a clear SEO page title and search description.</p>
          </div>
          <div class="manager-form-grid">
            <label class="manager-field manager-field--wide"><span>Related itinerary slugs <small>Optional · separate with commas</small></span><input v-model="relatedText" type="text" placeholder="classic-kerala-6-nights, munnar-alleppey-3-nights"></label>
            <label class="manager-field manager-field--wide" :class="{ 'manager-field--invalid': hasMissingRequirement('seo-title') }"><span>SEO page title <em class="manager-required">Required to publish</em></span><input v-model="guide.seo.metaTitle" type="text" placeholder="Best Time to Visit Kerala | Tripport Travel Guide"></label>
            <label class="manager-field manager-field--wide" :class="{ 'manager-field--invalid': hasMissingRequirement('seo-description') }"><span>SEO description <em class="manager-required">Required to publish</em></span><textarea v-model="guide.seo.metaDescription" rows="3" placeholder="A concise search result description"></textarea></label>
          </div>
        </section>

        <footer class="manager-editor-footer">
          <span>Drafts need a title and URL slug. Every checklist item is required before publishing.</span>
          <div>
            <button class="manager-secondary-button" :disabled="saving" type="button" @click="showPreview = true"><MaterialIcon name="visibility" :size="17" />Preview</button>
            <button class="manager-secondary-button" :disabled="saving" type="button" @click="save('draft')">Save draft</button>
            <button class="manager-action" :disabled="saving" type="button" @click="save('published')"><MaterialIcon name="check" :size="17" />{{ guide.status === 'published' ? 'Save published changes' : 'Publish guide' }}</button>
          </div>
        </footer>
      </form>
      <AdminGuidePreview v-if="showPreview && guide" :guide="guide" @close="showPreview = false" />
    </div>
  </AdminShell>
</template>

<style scoped>
.guide-editor-page{width:min(1040px,calc(100% - 64px));margin:0 auto;padding:36px 0 80px}.guide-editor-page__header{display:flex;align-items:end;justify-content:space-between;gap:26px;margin-bottom:26px}.manager-back{display:inline-flex;align-items:center;gap:5px;margin-bottom:24px;color:#43675a;font-size:13px;font-weight:800}.manager-kicker{display:block;color:#2a7659;font-size:11px;font-weight:850;letter-spacing:.13em;text-transform:uppercase}.guide-editor-page h1{margin:8px 0 9px;color:#123629;font-size:clamp(34px,4vw,49px);letter-spacing:-.07em;line-height:.95}.guide-editor-page__header p{max-width:600px;margin:0;color:#68786f;font-size:15px;line-height:1.6}.guide-editor-page__actions,.manager-editor-footer>div{display:flex;gap:8px}.manager-action,.manager-secondary-button{display:inline-flex;min-height:43px;align-items:center;justify-content:center;gap:8px;padding:0 14px;border-radius:10px;font-size:13px;font-weight:800}.manager-action{border:0;background:#113e32;color:#fff}.manager-action:hover{background:#0e3028}.manager-secondary-button{border:1px solid #ccdbd3;background:#fff;color:#2d5042}.manager-secondary-button:hover{border-color:#8eaf9f;background:#f3f8f4}.manager-action:disabled,.manager-secondary-button:disabled{opacity:.6;cursor:wait}.manager-notice{margin:0 0 22px;padding:12px 14px;border-radius:10px;background:#fff0ed;color:#a43721;font-size:14px;font-weight:700}.manager-notice--success{background:#e9f6ee;color:#205e43}.manager-editor-loading{padding:70px 0;color:#718078;text-align:center}.guide-editor{display:grid;gap:18px}.manager-editor-card{display:grid;grid-template-columns:230px minmax(0,1fr);gap:35px;padding:29px;border:1px solid #dce7e0;border-radius:18px;background:#fff}.manager-editor-card h2{margin:8px 0 8px;color:#173c2e;font-size:25px;letter-spacing:-.055em;line-height:1}.manager-editor-card>div>p{margin:0;color:#728178;font-size:13px;line-height:1.6}.manager-form-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:15px}.manager-field{display:grid;gap:7px;color:#405f52;font-size:12px;font-weight:800}.manager-field>span{display:block}.manager-field small{color:#88958e;font-size:10px;font-weight:650}.manager-field--wide{grid-column:1 / -1}.manager-field input,.manager-field textarea{width:100%;border:1px solid #d3e0d8;border-radius:9px;outline:0;background:#fff;color:#173b2e;font-size:14px;font-weight:500;line-height:1.5}.manager-field input{height:43px;padding:0 11px}.manager-field textarea{min-height:43px;padding:10px 11px;resize:vertical}.manager-field input:focus,.manager-field textarea:focus{border-color:#277656;box-shadow:0 0 0 3px rgb(39 118 86 / 10%)}.guide-image-field{display:grid;grid-template-columns:180px minmax(0,1fr);gap:10px 15px;align-items:center}.guide-image-field img,.guide-image-field>span{grid-row:1 / 3;width:180px;height:126px;border-radius:12px;object-fit:cover}.guide-image-field>span{display:grid;place-items:center;gap:6px;background:#edf4ef;color:#608071;font-size:12px;font-weight:800}.manager-upload-button{display:inline-flex;justify-self:start;align-items:center;gap:7px;padding:8px 10px;border-radius:8px;background:#e8f3ec;color:#1f6549;cursor:pointer;font-size:12px;font-weight:800}.manager-upload-button input{position:absolute;width:1px;height:1px;opacity:0}.guide-image-field>input{width:100%;height:38px;padding:0 10px;border:1px solid #d6e3db;border-radius:8px;color:#345749;font-size:12px;outline:none}.guide-facts{display:grid;gap:10px}.guide-facts article{display:grid;grid-template-columns:1fr 1fr 32px;gap:10px;align-items:end;padding:12px;border:1px solid #e0ebe4;border-radius:10px;background:#f9fbfa}.manager-icon-button{display:grid;width:32px;height:32px;flex:0 0 auto;place-items:center;border:1px solid #d7e2db;border-radius:8px;background:#fff;color:#63746c}.manager-icon-button:hover{border-color:#e8b8ad;background:#fff5f2;color:#b34830}.manager-text-button{display:inline-flex;align-items:center;justify-content:center;gap:5px;border:0;background:transparent;color:#2b7658;font-size:12px;font-weight:800}.manager-text-button--left{justify-content:flex-start}.guide-takeaways-field{margin-top:22px}.guide-sections{display:grid;gap:13px}.guide-sections>article{display:grid;gap:13px;padding:18px;border:1px solid #dce8e0;border-radius:13px}.guide-sections__top{display:flex;align-items:center;justify-content:space-between}.guide-sections__top strong{color:#2a6550;font-size:11px;letter-spacing:.1em;text-transform:uppercase}.guide-paragraphs{display:grid;gap:9px}.manager-add-section{display:flex;min-height:48px;align-items:center;justify-content:center;gap:7px;border:1px dashed #8db89f;border-radius:10px;background:#f6fbf7;color:#287052;font-size:13px;font-weight:800}.manager-editor-footer{display:flex;align-items:center;justify-content:space-between;gap:18px;padding:5px 0;color:#718078;font-size:13px}@media(max-width:860px){.manager-editor-card{grid-template-columns:1fr;gap:22px}}@media(max-width:620px){.guide-editor-page{width:min(100% - 32px,1040px);padding:28px 0 60px}.guide-editor-page__header{align-items:start;flex-direction:column}.guide-editor-page__actions{width:100%}.guide-editor-page__actions button{flex:1}.manager-editor-card{padding:20px}.manager-form-grid,.guide-facts article{grid-template-columns:1fr}.guide-facts .manager-icon-button{justify-self:end}.guide-image-field{grid-template-columns:130px minmax(0,1fr)}.guide-image-field img,.guide-image-field>span{width:130px;height:104px}.manager-editor-footer{align-items:start;flex-direction:column}.manager-editor-footer>div{width:100%}.manager-editor-footer button{flex:1}}
.manager-editor-card--needs-attention{border-color:#e1a08b;background:#fffaf8;box-shadow:0 0 0 3px rgb(184 80 44 / 8%)}.manager-editor-card--needs-attention .manager-kicker{color:#99452d}.manager-editor-card>div>p strong{color:#8f452d}.manager-required{display:inline-flex;align-items:center;margin-left:5px;padding:2px 5px;border-radius:999px;background:#fbe2da;color:#a3472d;font-size:9px;font-style:normal;font-weight:850;letter-spacing:.025em;line-height:1.25;text-transform:uppercase}.manager-field--invalid input,.manager-field--invalid textarea{border-color:#d3775d;background:#fffaf8;box-shadow:0 0 0 3px rgb(200 93 57 / 10%)}.guide-image-field--invalid{padding:9px;border-radius:13px;outline:2px solid #d9866e;outline-offset:2px}.manager-image-url{display:grid;gap:7px;color:#405f52;font-size:12px;font-weight:800}.manager-image-url>span{display:block}.manager-image-url input{width:100%;height:38px;padding:0 10px;border:1px solid #d6e3db;border-radius:8px;color:#345749;font-size:12px;outline:none}.manager-image-url input:focus{border-color:#277656;box-shadow:0 0 0 3px rgb(39 118 86 / 10%)}.guide-sections__article--needs-attention{border-color:#df9f8a!important;background:#fffaf8}.guide-sections__article--needs-attention .guide-sections__top strong{color:#9b482f}@media(max-width:620px){.guide-editor-page__actions{flex-wrap:wrap}.guide-editor-page__actions button{min-width:calc(50% - 4px)}.manager-required{margin-left:3px}.guide-image-field--invalid{padding:7px}}
</style>
