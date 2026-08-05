<script setup lang="ts">
import type { ManagedDestinationRow, ManagedGuideRow, ManagedPackageRow, ManagedTestimonialRow } from '~/data/manager'

definePageMeta({ layout: 'admin', middleware: 'manager' })

const { initialise, profile } = useManagerAuth()
const { request } = useManagerApi()
const packages = ref<ManagedPackageRow[]>([])
const guides = ref<ManagedGuideRow[]>([])
const destinations = ref<ManagedDestinationRow[]>([])
const testimonials = ref<ManagedTestimonialRow[]>([])
const loading = ref(true)
const importing = ref(false)
const notice = ref('')

const stats = computed(() => ({
  publishedPackages: packages.value.filter(item => item.status === 'published').length,
  draftPackages: packages.value.filter(item => item.status === 'draft').length,
  publishedGuides: guides.value.filter(item => item.status === 'published').length,
  publishedDestinations: destinations.value.filter(item => item.status === 'published').length,
  publishedTestimonials: testimonials.value.filter(item => item.status === 'published').length,
}))

async function load() {
  loading.value = true
  try {
    await initialise()
    ;[packages.value, guides.value, destinations.value, testimonials.value] = await Promise.all([
      request<ManagedPackageRow[]>('/api/admin/packages'),
      request<ManagedGuideRow[]>('/api/admin/guides'),
      request<ManagedDestinationRow[]>('/api/admin/destinations'),
      request<ManagedTestimonialRow[]>('/api/admin/testimonials'),
    ])
  } catch (error) {
    notice.value = error instanceof Error ? error.message : 'We could not load your content.'
  } finally {
    loading.value = false
  }
}

async function importCurrentContent() {
  importing.value = true
  notice.value = ''
  try {
    const result = await request<{ destinations: number }>('/api/admin/destinations/import', { method: 'POST' })
    notice.value = `Imported ${result.destinations} starter destinations without changing existing content.`
    await load()
  } catch (error) {
    notice.value = error instanceof Error ? error.message : 'The import could not be completed.'
  } finally {
    importing.value = false
  }
}

onMounted(load)
</script>

<template>
  <AdminShell section="overview">
    <div class="manager-page">
      <header class="manager-page__header">
        <div><span class="manager-kicker">Content workspace</span><h1>Good morning{{ profile?.email ? ',' : '' }} <em v-if="profile?.email">{{ profile.email.split('@')[0] }}</em>.</h1><p>Keep the journeys, stories and details on Tripport accurate and ready to inspire.</p></div>
        <NuxtLink class="manager-action" to="/admin/packages/new"><MaterialIcon name="add" :size="19" />Add package</NuxtLink>
      </header>

      <p v-if="notice" class="manager-notice">{{ notice }}</p>

      <section v-if="!loading && destinations.length === 0" class="manager-import-card">
        <div><span class="manager-kicker">One-time step</span><h2>Bring in the destination pages already on Tripport.</h2><p>Copy the current destination pages into this workspace so your team can manage them here. Existing manager content will not be changed.</p></div>
        <button class="manager-action" :disabled="importing" type="button" @click="importCurrentContent"><MaterialIcon name="content_copy" :size="18" />{{ importing ? 'Importing…' : 'Import destinations' }}</button>
      </section>

      <section class="manager-stats" :class="{ 'manager-stats--loading': loading }">
        <article><span>Live packages</span><strong>{{ loading ? '—' : stats.publishedPackages }}</strong><small>Visible on the website</small></article>
        <article><span>Draft packages</span><strong>{{ loading ? '—' : stats.draftPackages }}</strong><small>Still private to your team</small></article>
        <article><span>Travel guides</span><strong>{{ loading ? '—' : stats.publishedGuides }}</strong><small>Published planning stories</small></article>
        <article><span>Destinations</span><strong>{{ loading ? '—' : stats.publishedDestinations }}</strong><small>Live place pages</small></article>
        <article><span>Testimonials</span><strong>{{ loading ? '—' : stats.publishedTestimonials }}</strong><small>Published traveller stories</small></article>
      </section>

      <section class="manager-panel">
        <div class="manager-panel__heading"><div><span class="manager-kicker">Recently updated</span><h2>Keep the next journey moving.</h2></div><NuxtLink to="/admin/packages">View all packages <MaterialIcon name="chevron_right" :size="17" /></NuxtLink></div>
        <div v-if="loading" class="manager-empty">Loading your content…</div>
        <div v-else-if="packages.length" class="manager-recent-list">
          <NuxtLink v-for="item in packages.slice(0, 5)" :key="item.id" :to="`/admin/packages/${item.id}`" class="manager-recent-row">
            <img v-if="item.coverImage" :src="item.coverImage" alt=""><span v-else class="manager-recent-row__placeholder"><MaterialIcon name="image" :size="20" /></span>
            <div><strong>{{ item.title }}</strong><small>{{ item.durationDays }} days · {{ item.destinationState || 'Destination to be added' }}</small></div>
            <b :class="`manager-status manager-status--${item.status}`">{{ item.status }}</b><MaterialIcon name="chevron_right" :size="18" />
          </NuxtLink>
        </div>
        <div v-else class="manager-empty">Import your current content or add your first package to begin.</div>
      </section>
    </div>
  </AdminShell>
</template>

<style scoped>
.manager-page{width:min(1160px,calc(100% - 64px));margin:0 auto;padding:46px 0 70px}.manager-page__header{display:flex;align-items:flex-start;justify-content:space-between;gap:30px}.manager-kicker{display:block;color:#2a7659;font-size:11px;font-weight:850;letter-spacing:.13em;text-transform:uppercase}.manager-page h1{margin:9px 0 10px;color:#123629;font-size:clamp(36px,4vw,54px);letter-spacing:-.07em;line-height:.95}.manager-page h1 em{font-style:normal}.manager-page__header p{max-width:590px;margin:0;color:#66766e;font-size:16px;line-height:1.6}.manager-action{display:inline-flex;min-height:44px;flex:0 0 auto;align-items:center;justify-content:center;gap:8px;padding:0 15px;border:0;border-radius:10px;background:#113e32;color:#fff;font-size:13px;font-weight:800}.manager-action:hover{background:#0e3028}.manager-action:disabled{opacity:.65}.manager-notice{margin:26px 0 0;padding:12px 14px;border-radius:10px;background:#e9f6ee;color:#205e43;font-size:14px;font-weight:700}.manager-import-card{display:flex;align-items:center;justify-content:space-between;gap:30px;margin-top:32px;padding:28px;border:1px solid #bad5c7;border-radius:18px;background:#eef7f1}.manager-import-card h2{margin:8px 0;font-size:25px;letter-spacing:-.05em}.manager-import-card p{max-width:620px;margin:0;color:#527064;font-size:14px;line-height:1.6}.manager-stats{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:14px;margin:32px 0}.manager-stats article{padding:22px;border:1px solid #dce7e0;border-radius:16px;background:#fff}.manager-stats span,.manager-stats small{display:block;color:#718078;font-size:12px}.manager-stats span{font-weight:750}.manager-stats strong{display:block;margin:14px 0 5px;color:#143d31;font-size:42px;letter-spacing:-.075em;line-height:.9}.manager-panel{padding:27px;border:1px solid #dce7e0;border-radius:18px;background:#fff}.manager-panel__heading{display:flex;align-items:end;justify-content:space-between;gap:20px}.manager-panel__heading h2{margin:8px 0 0;font-size:26px;letter-spacing:-.055em}.manager-panel__heading>a{display:inline-flex;align-items:center;gap:3px;color:#23664b;font-size:13px;font-weight:800}.manager-recent-list{display:grid;margin-top:22px;border-top:1px solid #e8eee9}.manager-recent-row{display:grid;grid-template-columns:46px minmax(0,1fr) auto 18px;gap:13px;align-items:center;padding:12px 0;border-bottom:1px solid #e8eee9}.manager-recent-row img,.manager-recent-row__placeholder{width:46px;height:46px;border-radius:10px;object-fit:cover}.manager-recent-row__placeholder{display:grid;place-items:center;background:#e9f2ed;color:#38715a}.manager-recent-row strong,.manager-recent-row small{display:block}.manager-recent-row strong{overflow:hidden;color:#183b2e;font-size:14px;text-overflow:ellipsis;white-space:nowrap}.manager-recent-row small{margin-top:4px;color:#78867f;font-size:12px}.manager-status{padding:5px 8px;border-radius:999px;font-size:10px;font-weight:850;text-transform:capitalize}.manager-status--published{background:#e6f5eb;color:#23844f}.manager-status--draft{background:#fff3d9;color:#a66a08}.manager-status--archived{background:#eff1f0;color:#64716a}.manager-empty{padding:32px 0;color:#718078;font-size:14px}@media(max-width:980px){.manager-stats{grid-template-columns:repeat(3,1fr)}}@media(max-width:720px){.manager-page{width:min(100% - 32px,1160px);padding:30px 0 50px}.manager-page__header{display:grid}.manager-import-card{display:grid}.manager-stats{grid-template-columns:1fr}.manager-panel__heading{align-items:start;flex-direction:column}.manager-recent-row{grid-template-columns:42px minmax(0,1fr) auto}.manager-recent-row>.material-icon{display:none}}
</style>
