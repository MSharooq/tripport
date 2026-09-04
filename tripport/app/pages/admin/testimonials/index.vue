<script setup lang="ts">
import { createTestimonialDraft, type ManagedTestimonialRow } from '~/data/manager'
import type { TestimonialSubmission } from '~/data/testimonialSubmissions'

definePageMeta({ layout: 'admin', middleware: 'manager' })

const { request } = useManagerApi()
const { profile } = useManagerAuth()
const testimonials = ref<ManagedTestimonialRow[]>([])
const submissions = ref<TestimonialSubmission[]>([])
const loading = ref(true)
const query = ref('')
const statusFilter = ref<'all' | 'draft' | 'published' | 'archived'>('all')
const featuredOnly = ref(false)
const message = ref('')
const submissionMessage = ref('')

const isManager = computed(() => profile.value?.role === 'manager')
const pendingSubmissions = computed(() => submissions.value.filter(submission => submission.status === 'pending'))

const filtered = computed(() => {
  const needle = query.value.toLowerCase().trim()
  return testimonials.value.filter((item) => {
    const text = [item.name, item.data.title, item.data.quote, item.data.location, item.data.travellerType].join(' ').toLowerCase()
    const matchesSearch = !needle || text.includes(needle)
    const matchesStatus = statusFilter.value === 'all' || item.status === statusFilter.value
    return matchesSearch && matchesStatus && (!featuredOnly.value || item.featured)
  })
})

function imageSource(image: string) {
  return image.startsWith('http') || image.startsWith('/') ? image : `/images/${image}`
}

function formatUpdated(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Recently updated'
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(date)
}

async function load() {
  loading.value = true
  submissionMessage.value = ''
  try {
    testimonials.value = await request<ManagedTestimonialRow[]>('/api/admin/testimonials')
    try {
      submissions.value = await request<TestimonialSubmission[]>('/api/admin/testimonial-submissions')
    } catch (error) {
      submissionMessage.value = error instanceof Error ? error.message : 'Traveller submissions could not be loaded.'
      submissions.value = []
    }
  } catch (error) {
    message.value = error instanceof Error ? error.message : 'We could not load testimonials.'
  } finally {
    loading.value = false
  }
}

async function archiveTestimonial(item: ManagedTestimonialRow) {
  if (!window.confirm(`Archive “${item.data.title || item.name}”? It will no longer appear on the public website.`)) return
  try {
    await request(`/api/admin/testimonials/${item.id}`, { method: 'DELETE' })
    await load()
  } catch (error) {
    message.value = error instanceof Error ? error.message : 'The testimonial could not be archived.'
  }
}

async function duplicateTestimonial(item: ManagedTestimonialRow) {
  const copy = structuredClone(item.data)
  copy.id = createTestimonialDraft().id
  copy.title = copy.title ? `${copy.title} (copy)` : ''
  copy.status = 'draft'
  copy.sortOrder = item.sortOrder + 1

  try {
    await request('/api/admin/testimonials', { method: 'POST', body: copy })
    await load()
    await navigateTo(`/admin/testimonials/${copy.id}`)
  } catch (error) {
    message.value = error instanceof Error ? error.message : 'The testimonial could not be duplicated.'
  }
}

onMounted(load)
</script>

<template>
  <AdminShell section="testimonials">
    <div class="testimonial-list-page">
      <header class="testimonial-list-page__header">
        <div>
          <span class="manager-kicker">Testimonials</span>
          <h1>Share real traveller stories.</h1>
          <p>Publish only feedback you have received from real travellers, then choose the stories that deserve more prominence on Tripport.</p>
        </div>
        <NuxtLink class="manager-action" to="/admin/testimonials/new"><MaterialIcon name="add" :size="19" />Add testimonial</NuxtLink>
      </header>

      <p v-if="message" class="manager-notice">{{ message }}</p>

      <section v-if="!loading && pendingSubmissions.length" class="manager-submission-panel">
        <div class="manager-submission-panel__heading">
          <div>
            <span class="manager-kicker">Traveller submissions</span>
            <h2>{{ pendingSubmissions.length }} awaiting {{ pendingSubmissions.length === 1 ? 'a review' : 'reviews' }}.</h2>
            <p>Reviews and attachments stay private until a manager turns them into a testimonial draft.</p>
          </div>
          <span class="manager-submission-panel__count"><MaterialIcon name="favorite_border" :size="17" />{{ pendingSubmissions.length }}</span>
        </div>

        <div class="manager-submission-list">
          <NuxtLink v-for="submission in pendingSubmissions.slice(0, 5)" :key="submission.id" :to="`/admin/testimonials/submissions/${submission.id}`" class="manager-submission-row">
            <span class="manager-submission-row__avatar" aria-hidden="true">{{ submission.displayName.trim().slice(0, 1).toUpperCase() || 'T' }}</span>
            <div class="manager-submission-row__copy">
              <strong>{{ submission.title }}</strong>
              <small>{{ submission.displayName }}<template v-if="submission.location"> · {{ submission.location }}</template></small>
            </div>
            <span class="manager-submission-row__rating" :aria-label="`${submission.rating} out of 5 stars`"><MaterialIcon name="star" :size="16" />{{ submission.rating }}/5</span>
            <time :datetime="submission.createdAt">{{ formatUpdated(submission.createdAt) }}</time>
            <b class="manager-status manager-status--pending">Awaiting review</b>
            <MaterialIcon class="manager-submission-row__arrow" name="chevron_right" :size="19" />
          </NuxtLink>
        </div>

        <p v-if="pendingSubmissions.length > 5" class="manager-submission-panel__more">Showing the five newest submissions. Review each story before it can appear on Tripport.</p>
        <p v-if="!isManager" class="manager-submission-panel__access">You can read these submissions, but only a manager can approve or decline them.</p>
      </section>
      <p v-else-if="!loading && submissionMessage" class="manager-submission-warning">{{ submissionMessage }}</p>

      <section class="manager-list-panel">
        <div class="manager-list-tools">
          <label class="manager-search"><MaterialIcon name="search" :size="18" /><input v-model="query" type="search" placeholder="Search testimonials"></label>
          <label class="manager-filter"><span>Status</span><select v-model="statusFilter"><option value="all">All statuses</option><option value="published">Published</option><option value="draft">Draft</option><option value="archived">Archived</option></select></label>
          <label class="manager-featured-filter"><input v-model="featuredOnly" type="checkbox"><span>Featured only</span></label>
        </div>

        <div v-if="loading" class="manager-empty">Loading testimonials…</div>
        <div v-else-if="filtered.length" class="manager-table">
          <article v-for="item in filtered" :key="item.id" class="manager-testimonial-row">
            <img v-if="item.image" :src="imageSource(item.image)" :alt="item.name ? `${item.name}, traveller` : 'Traveller'">
            <span v-else class="manager-testimonial-row__avatar" aria-hidden="true">{{ item.name.trim().slice(0, 1).toUpperCase() || 'T' }}</span>
            <div class="manager-testimonial-row__title"><strong>{{ item.data.title || 'Untitled testimonial' }}</strong><small>{{ item.name || 'Traveller name needed' }}<template v-if="item.data.location"> · {{ item.data.location }}</template></small></div>
            <div class="manager-testimonial-row__rating" :aria-label="`${item.rating} out of 5 stars`"><span>★</span>{{ item.rating }}/5</div>
            <b :class="`manager-status manager-status--${item.status}`">{{ item.status }}</b>
            <span v-if="item.featured" class="manager-featured">Featured</span><span v-else class="manager-muted">Standard</span>
            <time :datetime="item.updatedAt">{{ formatUpdated(item.updatedAt) }}</time>
            <div class="manager-row-actions"><NuxtLink :to="`/admin/testimonials/${item.id}`" aria-label="Edit testimonial"><MaterialIcon name="edit" :size="18" /></NuxtLink><button type="button" aria-label="Duplicate testimonial" @click="duplicateTestimonial(item)"><MaterialIcon name="content_copy" :size="18" /></button><button v-if="item.status !== 'archived'" type="button" aria-label="Archive testimonial" @click="archiveTestimonial(item)"><MaterialIcon name="archive" :size="18" /></button></div>
          </article>
        </div>
        <div v-else class="manager-empty">No testimonials match this view yet.</div>
      </section>
    </div>
  </AdminShell>
</template>

<style scoped>
.testimonial-list-page{width:min(1200px,calc(100% - 64px));margin:0 auto;padding:46px 0 70px}.testimonial-list-page__header{display:flex;justify-content:space-between;gap:30px}.manager-kicker{display:block;color:#2a7659;font-size:11px;font-weight:850;letter-spacing:.13em;text-transform:uppercase}.testimonial-list-page h1{margin:9px 0 10px;color:#123629;font-size:clamp(35px,4vw,52px);letter-spacing:-.07em;line-height:.95}.testimonial-list-page__header p{max-width:660px;margin:0;color:#66766e;font-size:16px;line-height:1.6}.manager-action{display:inline-flex;min-height:44px;flex:0 0 auto;align-items:center;justify-content:center;gap:8px;padding:0 15px;border:0;border-radius:10px;background:#113e32;color:#fff;font-size:13px;font-weight:800}.manager-action:hover{background:#0e3028}.manager-notice{margin:24px 0 0;padding:12px 14px;border-radius:10px;background:#fff0ed;color:#a43721;font-size:14px;font-weight:700}.manager-list-panel{margin-top:34px;padding:20px;border:1px solid #dce7e0;border-radius:18px;background:#fff}.manager-list-tools{display:flex;align-items:center;gap:12px;padding-bottom:17px;border-bottom:1px solid #e7eee9}.manager-search{display:flex;min-width:260px;align-items:center;gap:8px;padding:0 11px;border:1px solid #d6e3db;border-radius:9px;color:#668076}.manager-search input{width:100%;height:39px;border:0;outline:0;background:transparent;color:#183b2e;font-size:13px}.manager-filter{display:flex;align-items:center;gap:7px;color:#6a7b72;font-size:11px;font-weight:800}.manager-filter select{height:39px;padding:0 27px 0 10px;border:1px solid #d6e3db;border-radius:9px;background:#fff;color:#24483a;font:inherit;outline:0}.manager-featured-filter{display:inline-flex;align-items:center;gap:7px;color:#4f665a;font-size:12px;font-weight:750;white-space:nowrap}.manager-featured-filter input{width:15px;height:15px;accent-color:#166746}.manager-table{display:grid}.manager-testimonial-row{display:grid;grid-template-columns:46px minmax(190px,1.6fr) 62px 84px 76px 112px 108px;gap:14px;align-items:center;padding:14px 4px;border-bottom:1px solid #e7eee9}.manager-testimonial-row:last-child{border:0}.manager-testimonial-row>img,.manager-testimonial-row__avatar{display:grid;width:46px;height:46px;place-items:center;border-radius:50%;background:#e8f1eb;color:#367159;font-size:13px;font-weight:850;object-fit:cover}.manager-testimonial-row__title{min-width:0}.manager-testimonial-row__title strong,.manager-testimonial-row__title small{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.manager-testimonial-row__title strong{color:#183b2e;font-size:14px}.manager-testimonial-row__title small{margin-top:4px;color:#78867f;font-size:12px}.manager-testimonial-row__rating{display:flex;align-items:center;gap:4px;color:#7b897f;font-size:11px;font-weight:800}.manager-testimonial-row__rating span{color:#d89623;font-size:16px;line-height:1}.manager-status{justify-self:start;padding:5px 8px;border-radius:999px;font-size:10px;font-weight:850;text-transform:capitalize}.manager-status--published{background:#e6f5eb;color:#23844f}.manager-status--draft{background:#fff3d9;color:#a66a08}.manager-status--archived{background:#eff1f0;color:#64716a}.manager-featured{justify-self:start;padding:5px 7px;border-radius:999px;background:#eef7f1;color:#277052;font-size:10px;font-weight:850}.manager-muted{color:#89958f;font-size:11px}.manager-testimonial-row time{color:#76847c;font-size:11px}.manager-row-actions{display:flex;justify-content:flex-end;gap:5px}.manager-row-actions a,.manager-row-actions button{display:grid;width:31px;height:31px;place-items:center;border:1px solid #dde7e1;border-radius:8px;background:#fff;color:#466359}.manager-row-actions a:hover,.manager-row-actions button:hover{border-color:#8fb5a3;background:#edf6f0;color:#113e32}.manager-empty{padding:45px 4px;color:#718078;font-size:14px;text-align:center}@media(max-width:1020px){.manager-testimonial-row{grid-template-columns:46px minmax(0,1fr) 62px 84px 108px}.manager-testimonial-row>time,.manager-muted,.manager-featured{display:none}}@media(max-width:760px){.testimonial-list-page{width:min(100% - 32px,1200px);padding:30px 0}.testimonial-list-page__header{display:grid}.manager-list-tools{align-items:stretch;flex-wrap:wrap}.manager-search{min-width:0;flex:1 1 100%}.manager-testimonial-row{grid-template-columns:42px minmax(0,1fr) auto;gap:10px}.manager-testimonial-row>img,.manager-testimonial-row__avatar{width:42px;height:42px}.manager-testimonial-row__rating,.manager-status{display:none}.manager-row-actions{grid-column:2 / 4;justify-content:flex-start}}
</style>

<style scoped>
.manager-submission-panel {
  margin-top: 28px;
  padding: 24px;
  border: 1px solid #bad8c9;
  border-radius: 18px;
  background: linear-gradient(135deg, #f7fcf8 0%, #edf7f0 100%);
}

.manager-submission-panel__heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
}

.manager-submission-panel h2 {
  margin: 8px 0 7px;
  color: #153d2f;
  font-size: 25px;
  letter-spacing: -.055em;
}

.manager-submission-panel p {
  margin: 0;
  color: #577266;
  font-size: 13px;
  line-height: 1.55;
}

.manager-submission-panel__count {
  display: inline-flex;
  min-width: 46px;
  height: 37px;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 0 11px;
  border: 1px solid #c8ded0;
  border-radius: 999px;
  background: #fff;
  color: #206546;
  font-size: 13px;
  font-weight: 850;
}

.manager-submission-list {
  display: grid;
  margin-top: 20px;
  border-top: 1px solid #d7e8dd;
}

.manager-submission-row {
  display: grid;
  grid-template-columns: 40px minmax(0, 1fr) 58px 95px 101px 19px;
  gap: 13px;
  align-items: center;
  padding: 12px 2px;
  border-bottom: 1px solid #dfece3;
  color: inherit;
}

.manager-submission-row:last-child { border-bottom: 0; }

.manager-submission-row:hover {
  margin: 0 -8px;
  padding-right: 10px;
  padding-left: 10px;
  border-radius: 12px;
  background: rgb(255 255 255 / 66%);
}

.manager-submission-row__avatar {
  display: grid;
  width: 40px;
  height: 40px;
  place-items: center;
  border-radius: 50%;
  background: #d9ede0;
  color: #246548;
  font-size: 13px;
  font-weight: 850;
}

.manager-submission-row__copy { min-width: 0; }

.manager-submission-row__copy strong,
.manager-submission-row__copy small {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.manager-submission-row__copy strong { color: #173d2f; font-size: 13px; }
.manager-submission-row__copy small { margin-top: 4px; color: #678075; font-size: 11px; }

.manager-submission-row__rating {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  color: #506e60;
  font-size: 11px;
  font-weight: 800;
}

.manager-submission-row__rating :deep(.material-icon) { color: #d59118; }
.manager-submission-row time { color: #708278; font-size: 11px; }

.manager-status--pending {
  background: #e2f2e8;
  color: #206445;
  text-transform: none;
}

.manager-submission-row__arrow { color: #51806a; }

.manager-submission-panel__more,
.manager-submission-panel__access {
  margin-top: 14px !important;
  font-size: 11px !important;
}

.manager-submission-panel__access { color: #7f6550 !important; }

.manager-submission-warning {
  margin: 22px 0 -8px;
  padding: 11px 13px;
  border: 1px solid #f0d9a8;
  border-radius: 10px;
  background: #fff9e9;
  color: #8a6715;
  font-size: 12px;
  font-weight: 700;
}

@media (max-width: 1020px) {
  .manager-submission-row { grid-template-columns: 40px minmax(0, 1fr) 58px 101px 19px; }
  .manager-submission-row time { display: none; }
}

@media (max-width: 760px) {
  .manager-submission-panel { padding: 19px; }
  .manager-submission-panel__heading { align-items: flex-start; }
  .manager-submission-panel__count { min-width: 39px; padding: 0 9px; }
  .manager-submission-row { grid-template-columns: 40px minmax(0, 1fr) auto; gap: 10px; }
  .manager-submission-row__rating,
  .manager-submission-row time,
  .manager-submission-row .manager-status { display: none; }
}
</style>
