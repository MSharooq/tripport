<script setup lang="ts">
import { createCopySlug, type ManagedDestinationRow } from '~/data/manager'
import { destinationImageSource } from '~/data/destinations'

definePageMeta({ layout: 'admin', middleware: 'manager' })

const { request } = useManagerApi()
const destinations = ref<ManagedDestinationRow[]>([])
const loading = ref(true)
const query = ref('')
const filter = ref<'all' | 'published' | 'draft' | 'archived'>('all')
const message = ref('')

const filtered = computed(() => destinations.value.filter((item) => {
  const matchesQuery = `${item.name} ${item.region} ${item.slug}`.toLowerCase().includes(query.value.toLowerCase().trim())
  return matchesQuery && (filter.value === 'all' || item.status === filter.value)
}))

function imageSource(image: string) { return image ? destinationImageSource(image) : '' }

async function load() {
  loading.value = true
  try { destinations.value = await request<ManagedDestinationRow[]>('/api/admin/destinations') }
  catch (error) { message.value = error instanceof Error ? error.message : 'We could not load destinations.' }
  finally { loading.value = false }
}

async function archiveDestination(item: ManagedDestinationRow) {
  if (!window.confirm(`Archive “${item.name}”? It will no longer appear on the public website.`)) return
  try {
    await request(`/api/admin/destinations/${item.slug}`, { method: 'DELETE' })
    await load()
  } catch (error) { message.value = error instanceof Error ? error.message : 'The destination could not be archived.' }
}

async function duplicateDestination(item: ManagedDestinationRow) {
  const copy = structuredClone(item.data)
  copy.slug = createCopySlug(copy.slug)
  copy.name = `${copy.name} (copy)`
  copy.status = 'draft'
  try {
    await request('/api/admin/destinations', { method: 'POST', body: copy })
    await load()
    await navigateTo(`/admin/destinations/${copy.slug}`)
  } catch (error) { message.value = error instanceof Error ? error.message : 'The destination could not be duplicated.' }
}

onMounted(load)
</script>

<template>
  <AdminShell section="destinations">
    <div class="manager-list-page">
      <header class="manager-list-page__header">
        <div><span class="manager-kicker">Destinations</span><h1>Give every place its own story.</h1><p>Create the destination pages that help travellers understand a route before they enquire.</p></div>
        <NuxtLink class="manager-action" to="/admin/destinations/new"><MaterialIcon name="add" :size="19" />Add destination</NuxtLink>
      </header>

      <p v-if="message" class="manager-notice">{{ message }}</p>

      <section class="manager-list-panel">
        <div class="manager-list-tools">
          <label class="manager-search"><MaterialIcon name="search" :size="18" /><input v-model="query" type="search" placeholder="Search destinations"></label>
          <div class="manager-filter"><button v-for="option in ['all', 'published', 'draft', 'archived']" :key="option" :class="{ 'manager-filter--active': filter === option }" type="button" @click="filter = option as typeof filter">{{ option }}</button></div>
        </div>

        <div v-if="loading" class="manager-empty">Loading destinations…</div>
        <div v-else-if="filtered.length" class="manager-table">
          <div v-for="item in filtered" :key="item.slug" class="manager-destination-row">
            <img v-if="item.coverImage" :src="imageSource(item.coverImage)" alt="">
            <span v-else class="manager-destination-row__placeholder"><MaterialIcon name="image" :size="21" /></span>
            <div class="manager-destination-row__title"><strong>{{ item.name }}</strong><small>{{ [item.region, item.idealNights].filter(Boolean).join(' · ') || item.slug }}</small></div>
            <b :class="`manager-status manager-status--${item.status}`">{{ item.status }}</b>
            <div class="manager-row-actions">
              <NuxtLink :to="`/admin/destinations/${item.slug}`" aria-label="Edit destination"><MaterialIcon name="edit" :size="18" /></NuxtLink>
              <button type="button" aria-label="Duplicate destination" @click="duplicateDestination(item)"><MaterialIcon name="content_copy" :size="18" /></button>
              <button v-if="item.status !== 'archived'" type="button" aria-label="Archive destination" @click="archiveDestination(item)"><MaterialIcon name="archive" :size="18" /></button>
            </div>
          </div>
        </div>
        <div v-else class="manager-empty">No destinations match this view yet.</div>
      </section>
    </div>
  </AdminShell>
</template>

<style scoped>
.manager-list-page{width:min(1160px,calc(100% - 64px));margin:0 auto;padding:46px 0 70px}.manager-list-page__header{display:flex;justify-content:space-between;gap:30px}.manager-kicker{display:block;color:#2a7659;font-size:11px;font-weight:850;letter-spacing:.13em;text-transform:uppercase}.manager-list-page h1{margin:9px 0 10px;color:#123629;font-size:clamp(35px,4vw,52px);letter-spacing:-.07em;line-height:.95}.manager-list-page__header p{max-width:630px;margin:0;color:#66766e;font-size:16px;line-height:1.6}.manager-action{display:inline-flex;min-height:44px;flex:0 0 auto;align-items:center;justify-content:center;gap:8px;padding:0 15px;border:0;border-radius:10px;background:#113e32;color:#fff;font-size:13px;font-weight:800}.manager-action:hover{background:#0e3028}.manager-notice{margin:24px 0 0;padding:12px 14px;border-radius:10px;background:#fff0ed;color:#a43721;font-size:14px;font-weight:700}.manager-list-panel{margin-top:34px;padding:20px;border:1px solid #dce7e0;border-radius:18px;background:#fff}.manager-list-tools{display:flex;justify-content:space-between;gap:18px;padding-bottom:17px;border-bottom:1px solid #e7eee9}.manager-search{display:flex;min-width:260px;align-items:center;gap:8px;padding:0 11px;border:1px solid #d6e3db;border-radius:9px;color:#668076}.manager-search input{width:100%;height:39px;border:0;outline:0;background:transparent;color:#183b2e;font-size:13px}.manager-filter{display:flex;gap:5px}.manager-filter button{padding:7px 10px;border:0;border-radius:8px;background:#f2f5f3;color:#617168;font-size:12px;font-weight:750;text-transform:capitalize}.manager-filter button:hover,.manager-filter--active{background:#113e32!important;color:#fff!important}.manager-table{display:grid}.manager-destination-row{display:grid;grid-template-columns:50px minmax(0,1fr) 83px 105px;gap:15px;align-items:center;padding:14px 4px;border-bottom:1px solid #e7eee9}.manager-destination-row:last-child{border:0}.manager-destination-row img,.manager-destination-row__placeholder{width:50px;height:50px;border-radius:10px;object-fit:cover}.manager-destination-row__placeholder{display:grid;place-items:center;background:#e9f2ed;color:#38715a}.manager-destination-row__title strong,.manager-destination-row__title small{display:block}.manager-destination-row__title strong{overflow:hidden;color:#183b2e;font-size:14px;text-overflow:ellipsis;white-space:nowrap}.manager-destination-row__title small{margin-top:4px;color:#78867f;font-size:12px}.manager-status{justify-self:start;padding:5px 8px;border-radius:999px;font-size:10px;font-weight:850;text-transform:capitalize}.manager-status--published{background:#e6f5eb;color:#23844f}.manager-status--draft{background:#fff3d9;color:#a66a08}.manager-status--archived{background:#eff1f0;color:#64716a}.manager-row-actions{display:flex;justify-content:flex-end;gap:5px}.manager-row-actions a,.manager-row-actions button{display:grid;width:31px;height:31px;place-items:center;border:1px solid #dde7e1;border-radius:8px;background:#fff;color:#466359}.manager-row-actions a:hover,.manager-row-actions button:hover{border-color:#8fb5a3;background:#edf6f0;color:#113e32}.manager-empty{padding:45px 4px;color:#718078;font-size:14px;text-align:center}@media(max-width:760px){.manager-list-page{width:min(100% - 32px,1160px);padding:30px 0}.manager-list-page__header{display:grid}.manager-list-tools{display:grid}.manager-search{min-width:0}.manager-filter{overflow:auto}.manager-destination-row{grid-template-columns:42px minmax(0,1fr) auto;gap:10px}.manager-destination-row img,.manager-destination-row__placeholder{width:42px;height:42px}.manager-destination-row__title small{font-size:11px}.manager-status{display:none}.manager-row-actions{grid-column:2 / 4;justify-content:flex-start}}
</style>
