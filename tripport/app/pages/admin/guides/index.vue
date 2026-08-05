<script setup lang="ts">
import { createCopySlug, type ManagedGuideRow } from '~/data/manager'

definePageMeta({ layout: 'admin', middleware: 'manager' })

const { request } = useManagerApi()
const guides = ref<ManagedGuideRow[]>([])
const loading = ref(true)
const query = ref('')
const message = ref('')

const filtered = computed(() => guides.value.filter(item => `${item.title} ${item.slug}`.toLowerCase().includes(query.value.toLowerCase().trim())))

async function load() {
  loading.value = true
  try { guides.value = await request<ManagedGuideRow[]>('/api/admin/guides') }
  catch (error) { message.value = error instanceof Error ? error.message : 'We could not load travel guides.' }
  finally { loading.value = false }
}

async function archiveGuide(item: ManagedGuideRow) {
  if (!window.confirm(`Archive “${item.title}”? It will no longer appear on the public website.`)) return
  try { await request(`/api/admin/guides/${item.slug}`, { method: 'DELETE' }); await load() }
  catch (error) { message.value = error instanceof Error ? error.message : 'The guide could not be archived.' }
}

async function duplicateGuide(item: ManagedGuideRow) {
  const copy = structuredClone(item.data)
  copy.slug = createCopySlug(copy.slug)
  copy.title = `${copy.title} (copy)`
  copy.status = 'draft'
  try {
    await request('/api/admin/guides', { method: 'POST', body: copy })
    await load()
    await navigateTo(`/admin/guides/${copy.slug}`)
  } catch (error) {
    message.value = error instanceof Error ? error.message : 'The travel guide could not be duplicated.'
  }
}

onMounted(load)
</script>

<template>
  <AdminShell section="guides">
    <div class="manager-list-page">
      <header class="manager-list-page__header"><div><span class="manager-kicker">Travel guides</span><h1>Make planning feel easier.</h1><p>Create useful destination stories that build confidence before someone is ready to enquire.</p></div><NuxtLink class="manager-action" to="/admin/guides/new"><MaterialIcon name="add" :size="19" />Add travel guide</NuxtLink></header>
      <p v-if="message" class="manager-notice">{{ message }}</p>
      <section class="manager-list-panel"><div class="manager-list-tools"><label class="manager-search"><MaterialIcon name="search" :size="18" /><input v-model="query" type="search" placeholder="Search travel guides"></label></div><div v-if="loading" class="manager-empty">Loading travel guides…</div><div v-else-if="filtered.length" class="manager-table"><div v-for="item in filtered" :key="item.slug" class="manager-guide-row"><img v-if="item.coverImage" :src="item.coverImage.startsWith('http') || item.coverImage.startsWith('/') ? item.coverImage : `/images/${item.coverImage}`" alt=""><span v-else class="manager-guide-row__placeholder"><MaterialIcon name="image" :size="21" /></span><div class="manager-guide-row__title"><strong>{{ item.title }}</strong><small>{{ item.slug }}</small></div><b :class="`manager-status manager-status--${item.status}`">{{ item.status }}</b><div class="manager-row-actions"><NuxtLink :to="`/admin/guides/${item.slug}`" aria-label="Edit guide"><MaterialIcon name="edit" :size="18" /></NuxtLink><button type="button" aria-label="Duplicate guide" @click="duplicateGuide(item)"><MaterialIcon name="content_copy" :size="18" /></button><button v-if="item.status !== 'archived'" type="button" aria-label="Archive guide" @click="archiveGuide(item)"><MaterialIcon name="archive" :size="18" /></button></div></div></div><div v-else class="manager-empty">No travel guides match this view yet.</div></section>
    </div>
  </AdminShell>
</template>

<style scoped>
.manager-list-page{width:min(1160px,calc(100% - 64px));margin:0 auto;padding:46px 0 70px}.manager-list-page__header{display:flex;justify-content:space-between;gap:30px}.manager-kicker{display:block;color:#2a7659;font-size:11px;font-weight:850;letter-spacing:.13em;text-transform:uppercase}.manager-list-page h1{margin:9px 0 10px;color:#123629;font-size:clamp(35px,4vw,52px);letter-spacing:-.07em;line-height:.95}.manager-list-page__header p{max-width:630px;margin:0;color:#66766e;font-size:16px;line-height:1.6}.manager-action{display:inline-flex;min-height:44px;flex:0 0 auto;align-items:center;justify-content:center;gap:8px;padding:0 15px;border:0;border-radius:10px;background:#113e32;color:#fff;font-size:13px;font-weight:800}.manager-action:hover{background:#0e3028}.manager-notice{margin:24px 0 0;padding:12px 14px;border-radius:10px;background:#fff0ed;color:#a43721;font-size:14px;font-weight:700}.manager-list-panel{margin-top:34px;padding:20px;border:1px solid #dce7e0;border-radius:18px;background:#fff}.manager-list-tools{display:flex;gap:18px;padding-bottom:17px;border-bottom:1px solid #e7eee9}.manager-search{display:flex;min-width:280px;align-items:center;gap:8px;padding:0 11px;border:1px solid #d6e3db;border-radius:9px;color:#668076}.manager-search input{width:100%;height:39px;border:0;outline:0;background:transparent;color:#183b2e;font-size:13px}.manager-table{display:grid}.manager-guide-row{display:grid;grid-template-columns:50px minmax(0,1fr) 83px 108px;gap:15px;align-items:center;padding:14px 4px;border-bottom:1px solid #e7eee9}.manager-guide-row:last-child{border:0}.manager-guide-row img,.manager-guide-row__placeholder{width:50px;height:50px;border-radius:10px;object-fit:cover}.manager-guide-row__placeholder{display:grid;place-items:center;background:#e9f2ed;color:#38715a}.manager-guide-row__title strong,.manager-guide-row__title small{display:block}.manager-guide-row__title strong{overflow:hidden;color:#183b2e;font-size:14px;text-overflow:ellipsis;white-space:nowrap}.manager-guide-row__title small{margin-top:4px;color:#78867f;font-size:12px}.manager-status{justify-self:start;padding:5px 8px;border-radius:999px;font-size:10px;font-weight:850;text-transform:capitalize}.manager-status--published{background:#e6f5eb;color:#23844f}.manager-status--draft{background:#fff3d9;color:#a66a08}.manager-status--archived{background:#eff1f0;color:#64716a}.manager-row-actions{display:flex;justify-content:flex-end;gap:5px}.manager-row-actions a,.manager-row-actions button{display:grid;width:31px;height:31px;place-items:center;border:1px solid #dde7e1;border-radius:8px;background:#fff;color:#466359}.manager-row-actions a:hover,.manager-row-actions button:hover{border-color:#8fb5a3;background:#edf6f0;color:#113e32}.manager-empty{padding:45px 4px;color:#718078;font-size:14px;text-align:center}@media(max-width:760px){.manager-list-page{width:min(100% - 32px,1160px);padding:30px 0}.manager-list-page__header{display:grid}.manager-search{min-width:0}.manager-guide-row{grid-template-columns:42px minmax(0,1fr) auto;gap:10px}.manager-guide-row img,.manager-guide-row__placeholder{width:42px;height:42px}.manager-status{display:none}.manager-row-actions{grid-column:2 / 4;justify-content:flex-start}}
</style>
