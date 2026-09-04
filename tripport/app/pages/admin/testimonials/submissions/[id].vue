<script setup lang="ts">
import type { TestimonialSubmission, TestimonialSubmissionStatus } from '~/data/testimonialSubmissions'

definePageMeta({ layout: 'admin', middleware: 'manager' })

const route = useRoute()
const { request } = useManagerApi()
const { initialise, profile } = useManagerAuth()
const submission = ref<TestimonialSubmission | null>(null)
const loading = ref(true)
const approving = ref(false)
const rejecting = ref(false)
const reviewerNote = ref('')
const message = ref('')

const isManager = computed(() => profile.value?.role === 'manager')
const isReviewable = computed(() => submission.value?.status === 'pending')
const isWorking = computed(() => approving.value || rejecting.value)
const viewableMedia = computed(() => submission.value?.media.filter(attachment => Boolean(attachment.signedUrl)) ?? [])

function formatDate(value?: string) {
  if (!value) return 'Not recorded'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Recently'
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

function statusLabel(status: TestimonialSubmissionStatus) {
  const labels: Record<TestimonialSubmissionStatus, string> = {
    uploading: 'Uploading',
    pending: 'Awaiting review',
    approved: 'Approved',
    rejected: 'Declined',
    archived: 'Archived',
  }
  return labels[status]
}

function mediaLabel(mimeType: string) {
  if (mimeType.startsWith('image/')) return 'Traveller photo'
  return 'Traveller video'
}

async function load() {
  loading.value = true
  try {
    await initialise()
    submission.value = await request<TestimonialSubmission>(`/api/admin/testimonial-submissions/${route.params.id}`)
    reviewerNote.value = submission.value.reviewerNote || ''
  } catch (error) {
    message.value = error instanceof Error ? error.message : 'We could not load this traveller submission.'
  } finally {
    loading.value = false
  }
}

async function approve() {
  if (!submission.value || !isManager.value || !isReviewable.value) return
  if (!window.confirm('Approve this submission? A private testimonial draft will be created for one final editorial review.')) return

  approving.value = true
  message.value = ''
  try {
    const result = await request<{ testimonialId: string }>(`/api/admin/testimonial-submissions/${submission.value.id}/approve`, { method: 'POST' })
    await navigateTo(`/admin/testimonials/${result.testimonialId}`)
  } catch (error) {
    message.value = error instanceof Error ? error.message : 'The traveller submission could not be approved.'
  } finally {
    approving.value = false
  }
}

async function reject() {
  if (!submission.value || !isManager.value || !isReviewable.value) return
  if (!window.confirm('Decline this submission? Any private photo or video attached to it will be deleted.')) return

  rejecting.value = true
  message.value = ''
  try {
    await request(`/api/admin/testimonial-submissions/${submission.value.id}/reject`, {
      method: 'POST',
      body: { note: reviewerNote.value },
    })
    await load()
  } catch (error) {
    message.value = error instanceof Error ? error.message : 'The traveller submission could not be declined.'
  } finally {
    rejecting.value = false
  }
}

onMounted(load)
</script>

<template>
  <AdminShell section="testimonials">
    <div class="testimonial-submission-page">
      <header class="testimonial-submission-page__header">
        <div>
          <NuxtLink class="manager-back" to="/admin/testimonials"><MaterialIcon name="arrow_back" :size="17" />Testimonials</NuxtLink>
          <span class="manager-kicker">Traveller submission</span>
          <h1>{{ loading ? 'Review traveller story.' : submission?.title || 'Traveller story' }}</h1>
          <p>Read the original feedback and private attachments before deciding whether to create a testimonial draft.</p>
        </div>
        <b v-if="submission" :class="`submission-status submission-status--${submission.status}`">{{ statusLabel(submission.status) }}</b>
      </header>

      <p v-if="message" class="manager-notice">{{ message }}</p>
      <div v-if="loading" class="manager-editor-loading">Loading traveller submission…</div>

      <template v-else-if="submission">
        <section class="submission-overview">
          <span class="submission-overview__avatar" aria-hidden="true">{{ submission.displayName.trim().slice(0, 1).toUpperCase() || 'T' }}</span>
          <div class="submission-overview__traveller">
            <span class="manager-kicker">Submitted by</span>
            <h2>{{ submission.displayName }}</h2>
            <p>{{ submission.location || 'Location not shared' }} · Received {{ formatDate(submission.createdAt) }}</p>
          </div>
          <div class="submission-overview__rating" :aria-label="`${submission.rating} out of 5 stars`">
            <span>Traveller rating</span>
            <strong>{{ submission.rating }}<small>/5</small></strong>
            <div aria-hidden="true"><MaterialIcon v-for="star in 5" :key="star" name="star" :size="18" :class="{ 'submission-overview__star--muted': star > submission.rating }" /></div>
          </div>
        </section>

        <div class="submission-content-grid">
          <section class="submission-card submission-card--review">
            <span class="manager-kicker">Their review</span>
            <h2>{{ submission.title }}</h2>
            <blockquote>“{{ submission.quote }}”</blockquote>
            <p v-if="submission.itinerarySlug" class="submission-card__linked"><MaterialIcon name="north_east" :size="16" />Linked itinerary: <strong>{{ submission.itinerarySlug }}</strong></p>
          </section>

          <aside class="submission-card submission-card--contact">
            <span class="manager-kicker">Private contact</span>
            <h2>Keep follow-up simple.</h2>
            <p>This email is only for Tripport’s internal review and is never shown on the public website.</p>
            <a :href="`mailto:${submission.email}`">{{ submission.email }}</a>
            <div class="submission-consent"><MaterialIcon name="check" :size="17" /><span>{{ submission.publicationConsent ? 'Permission to publish was confirmed.' : 'Permission to publish was not confirmed.' }}</span></div>
          </aside>
        </div>

        <section v-if="viewableMedia.length" class="submission-media">
          <div class="submission-media__heading">
            <div><span class="manager-kicker">Private attachments</span><h2>Traveller-shared moments.</h2></div>
            <p>These files are private. Only an approved testimonial draft can use them on the website.</p>
          </div>
          <div class="submission-media__grid">
            <figure v-for="attachment in viewableMedia" :key="attachment.path">
              <img v-if="attachment.type === 'image'" :src="attachment.signedUrl" :alt="attachment.fileName">
              <video v-else controls playsinline preload="metadata"><source :src="attachment.signedUrl" :type="attachment.mimeType"></video>
              <figcaption><strong>{{ mediaLabel(attachment.mimeType) }}</strong><span>{{ attachment.fileName }}</span></figcaption>
            </figure>
          </div>
        </section>

        <section class="submission-decision">
          <div>
            <span class="manager-kicker">Review decision</span>
            <h2>{{ isReviewable ? 'Turn a good story into a polished testimonial.' : 'This submission has already been reviewed.' }}</h2>
            <p v-if="isReviewable">Approving creates a private testimonial draft. You can edit the wording, choose whether to feature it and publish only when it is ready.</p>
            <p v-else-if="submission.status === 'approved'">The approved copy lives in the testimonial workspace as a draft until your team publishes it.</p>
            <p v-else-if="submission.status === 'rejected'">Any attached private media was removed when this submission was declined.</p>
            <p v-else>This submission cannot be reviewed in its current state.</p>
          </div>

          <div v-if="isManager && isReviewable" class="submission-decision__controls">
            <label class="submission-note"><span>Internal note <small>Optional · saved only if you decline</small></span><textarea v-model="reviewerNote" rows="3" placeholder="Why was this review declined? This is only visible to your team."></textarea></label>
            <div class="submission-decision__buttons">
              <button class="manager-secondary-button submission-decision__decline" type="button" :disabled="isWorking" @click="reject"><MaterialIcon name="close" :size="17" />{{ rejecting ? 'Declining…' : 'Decline submission' }}</button>
              <button class="manager-action" type="button" :disabled="isWorking" @click="approve"><MaterialIcon name="check" :size="17" />{{ approving ? 'Creating draft…' : 'Approve & create draft' }}</button>
            </div>
          </div>
          <div v-else-if="!isManager" class="submission-decision__restricted"><MaterialIcon name="visibility" :size="18" /><span>You can review this story, but only a manager can approve or decline it.</span></div>
          <NuxtLink v-else-if="submission.status === 'approved' && submission.testimonialId" class="manager-action" :to="`/admin/testimonials/${submission.testimonialId}`"><MaterialIcon name="edit" :size="17" />Open testimonial draft</NuxtLink>
        </section>

        <p v-if="submission.status === 'rejected' && submission.reviewerNote" class="submission-review-note"><strong>Internal note:</strong> {{ submission.reviewerNote }}</p>
      </template>
    </div>
  </AdminShell>
</template>

<style scoped>
.testimonial-submission-page { width: min(1040px, calc(100% - 64px)); margin: 0 auto; padding: 46px 0 70px; }
.testimonial-submission-page__header { display: flex; align-items: flex-start; justify-content: space-between; gap: 26px; }
.manager-back { display: inline-flex; align-items: center; gap: 5px; margin-bottom: 22px; color: #39725a; font-size: 12px; font-weight: 800; }
.manager-kicker { display: block; color: #2a7659; font-size: 11px; font-weight: 850; letter-spacing: .13em; text-transform: uppercase; }
.testimonial-submission-page h1 { margin: 9px 0 10px; color: #123629; font-size: clamp(35px, 4vw, 52px); letter-spacing: -.07em; line-height: .95; }
.testimonial-submission-page__header p { max-width: 650px; margin: 0; color: #66766e; font-size: 16px; line-height: 1.6; }
.submission-status { display: inline-flex; flex: 0 0 auto; align-items: center; min-height: 31px; margin-top: 22px; padding: 0 11px; border-radius: 999px; font-size: 11px; font-weight: 850; }
.submission-status--pending { background: #dff1e6; color: #216747; }
.submission-status--approved { background: #e2f4e8; color: #207046; }
.submission-status--rejected { background: #fbe8e3; color: #a1432b; }
.submission-status--uploading { background: #fff3d9; color: #9f6806; }
.submission-status--archived { background: #eef1ef; color: #66756d; }
.manager-notice { margin: 24px 0 0; padding: 12px 14px; border-radius: 10px; background: #fff0ed; color: #a43721; font-size: 14px; font-weight: 700; }
.manager-editor-loading { padding: 66px 0; color: #718078; font-size: 14px; text-align: center; }

.submission-overview { display: grid; grid-template-columns: 62px minmax(0, 1fr) auto; gap: 17px; align-items: center; margin-top: 30px; padding: 22px 24px; border: 1px solid #d8e6dd; border-radius: 18px; background: #fff; }
.submission-overview__avatar { display: grid; width: 62px; height: 62px; place-items: center; border-radius: 50%; background: #e4f1e8; color: #246548; font-size: 21px; font-weight: 850; }
.submission-overview h2 { margin: 7px 0 5px; color: #173d2f; font-size: 22px; letter-spacing: -.045em; }
.submission-overview p { margin: 0; color: #6d8076; font-size: 12px; }
.submission-overview__rating { min-width: 130px; padding: 4px 0 4px 24px; border-left: 1px solid #e0e9e3; }
.submission-overview__rating > span { display: block; color: #74857b; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; }
.submission-overview__rating strong { display: inline-block; margin: 5px 0 4px; color: #163d2f; font-size: 26px; letter-spacing: -.055em; line-height: 1; }
.submission-overview__rating strong small { color: #708076; font-size: 12px; letter-spacing: 0; }
.submission-overview__rating div { display: flex; gap: 1px; color: #d59118; }
.submission-overview__rating :deep(.submission-overview__star--muted) { color: #dce4df; }

.submission-content-grid { display: grid; grid-template-columns: minmax(0, 1.55fr) minmax(270px, .85fr); gap: 18px; margin-top: 18px; }
.submission-card { padding: 26px; border: 1px solid #d8e6dd; border-radius: 18px; background: #fff; }
.submission-card h2 { margin: 9px 0 15px; color: #153d2f; font-size: 25px; letter-spacing: -.055em; }
.submission-card--review blockquote { margin: 0; color: #3e584d; font-size: 17px; font-style: normal; line-height: 1.7; }
.submission-card__linked { display: inline-flex; align-items: center; gap: 6px; margin: 20px 0 0; color: #547366; font-size: 12px; }
.submission-card__linked strong { color: #2d634c; }
.submission-card--contact { background: #f7fbf8; }
.submission-card--contact h2 { margin-bottom: 8px; font-size: 21px; }
.submission-card--contact p { margin: 0; color: #60786c; font-size: 12px; line-height: 1.65; }
.submission-card--contact a { display: block; overflow-wrap: anywhere; margin-top: 17px; color: #1f6848; font-size: 14px; font-weight: 850; text-decoration: underline; text-decoration-color: #b3d4c2; text-underline-offset: 4px; }
.submission-consent { display: flex; gap: 7px; align-items: flex-start; margin-top: 22px; padding-top: 15px; border-top: 1px solid #dce9e0; color: #347054; font-size: 11px; font-weight: 750; line-height: 1.5; }

.submission-media { margin-top: 18px; padding: 26px; border: 1px solid #d8e6dd; border-radius: 18px; background: #fff; }
.submission-media__heading { display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; }
.submission-media h2 { margin: 8px 0 0; color: #153d2f; font-size: 25px; letter-spacing: -.055em; }
.submission-media__heading > p { max-width: 300px; margin: 0; color: #647b70; font-size: 12px; line-height: 1.6; }
.submission-media__grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; margin-top: 21px; }
.submission-media figure { min-width: 0; margin: 0; overflow: hidden; border: 1px solid #dfeae3; border-radius: 13px; background: #f4f8f5; }
.submission-media img,
.submission-media video { display: block; width: 100%; height: 190px; object-fit: cover; }
.submission-media figcaption { display: grid; gap: 3px; padding: 11px 12px; background: #fff; }
.submission-media figcaption strong { color: #2a5342; font-size: 12px; }
.submission-media figcaption span { overflow: hidden; color: #77877f; font-size: 10px; text-overflow: ellipsis; white-space: nowrap; }

.submission-decision { display: grid; grid-template-columns: minmax(0, .9fr) minmax(0, 1.1fr); gap: 30px; align-items: center; margin-top: 18px; padding: 28px; border: 1px solid #b8d5c6; border-radius: 18px; background: #eff8f2; }
.submission-decision h2 { margin: 9px 0; color: #173d2f; font-size: 25px; letter-spacing: -.055em; }
.submission-decision p { margin: 0; color: #557264; font-size: 13px; line-height: 1.6; }
.submission-decision__controls { display: grid; gap: 14px; }
.submission-note { display: grid; gap: 7px; color: #315d49; font-size: 12px; font-weight: 800; }
.submission-note small { color: #778a80; font-size: 10px; font-weight: 650; }
.submission-note textarea { width: 100%; min-height: 84px; resize: vertical; padding: 10px 11px; border: 1px solid #c6dbcf; border-radius: 10px; outline: none; background: #fff; color: #214636; font: inherit; font-weight: 500; line-height: 1.5; }
.submission-note textarea:focus { border-color: #72a58a; box-shadow: 0 0 0 3px rgb(50 117 82 / 12%); }
.submission-decision__buttons { display: flex; flex-wrap: wrap; gap: 8px; }
.manager-action,
.manager-secondary-button { display: inline-flex; min-height: 42px; align-items: center; justify-content: center; gap: 7px; padding: 0 14px; border-radius: 10px; font-size: 12px; font-weight: 800; }
.manager-action { border: 0; background: #113e32; color: #fff; }
.manager-action:hover { background: #0d3027; }
.manager-secondary-button { border: 1px solid #c5d8cd; background: #fff; color: #315e4a; }
.manager-secondary-button:hover { border-color: #88ae98; background: #f9fcfa; }
.submission-decision__decline { color: #8c3b2b; }
.manager-action:disabled,
.manager-secondary-button:disabled { cursor: wait; opacity: .62; }
.submission-decision__restricted { display: flex; align-items: flex-start; gap: 8px; padding: 14px; border: 1px solid #dae6de; border-radius: 11px; background: #fff; color: #617b6e; font-size: 12px; font-weight: 700; line-height: 1.5; }
.submission-review-note { margin: 18px 0 0; padding: 14px 16px; border: 1px solid #e2d5cd; border-radius: 12px; background: #fffaf8; color: #775445; font-size: 13px; line-height: 1.6; }

@media (max-width: 760px) {
  .testimonial-submission-page { width: min(100% - 32px, 1040px); padding: 30px 0 60px; }
  .testimonial-submission-page__header { display: grid; }
  .submission-status { margin-top: 0; justify-self: start; }
  .submission-overview { grid-template-columns: 50px minmax(0, 1fr); padding: 19px; }
  .submission-overview__avatar { width: 50px; height: 50px; font-size: 17px; }
  .submission-overview__rating { grid-column: 1 / -1; padding: 14px 0 0; border-top: 1px solid #e0e9e3; border-left: 0; }
  .submission-content-grid,
  .submission-decision { grid-template-columns: 1fr; }
  .submission-card,
  .submission-media,
  .submission-decision { padding: 20px; }
  .submission-media__heading { display: grid; }
}
</style>
