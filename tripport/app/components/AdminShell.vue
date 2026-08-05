<script setup lang="ts">
import type { ImageProcessingProgress } from '~/composables/useImageProcessing'

const props = defineProps<{
  section: 'overview' | 'packages' | 'guides' | 'destinations' | 'testimonials' | 'settings'
}>()

const { profile, initialise, signOut } = useManagerAuth()
const imageProgress = useState<ImageProcessingProgress>('tripport-manager-image-progress', () => ({
  phase: 'idle',
  percentage: 0,
  message: '',
  activeVariant: null,
  completedVariants: 0,
  totalVariants: 3,
}))
const showImageProgress = computed(() => imageProgress.value.phase !== 'idle')
const imageProgressDetail = computed(() => {
  if (imageProgress.value.phase === 'compressing') return 'Creating card, gallery and hero WebP versions on this device.'
  if (imageProgress.value.phase === 'uploading') return 'Only the optimized WebP versions are uploaded.'
  if (imageProgress.value.phase === 'complete') return 'Your responsive image sources are ready.'
  if (imageProgress.value.phase === 'error') return 'No image files were added. Please try a different photo.'
  return 'Preparing your selected photo on this device.'
})

const items = [
  { id: 'overview', label: 'Overview', to: '/admin', icon: 'dashboard' },
  { id: 'packages', label: 'Packages', to: '/admin/packages', icon: 'edit' },
  { id: 'guides', label: 'Travel guides', to: '/admin/guides', icon: 'image' },
  { id: 'destinations', label: 'Destinations', to: '/admin/destinations', icon: 'image' },
  { id: 'testimonials', label: 'Testimonials', to: '/admin/testimonials', icon: 'favorite_border' },
]

onMounted(initialise)
</script>

<template>
  <div class="manager-shell">
    <aside class="manager-sidebar">
      <NuxtLink class="manager-brand" to="/admin">
        <span><img src="/images/tripport_logo.svg" alt=""></span>
        <strong>Tripport <i>Manager</i></strong>
      </NuxtLink>

      <nav class="manager-nav" aria-label="Manager navigation">
        <NuxtLink
          v-for="item in items"
          :key="item.id"
          :to="item.to"
          :class="{ 'manager-nav__item--active': props.section === item.id }"
        >
          <MaterialIcon :name="item.icon" :size="18" />
          <span>{{ item.label }}</span>
        </NuxtLink>
      </nav>

      <div class="manager-sidebar__bottom">
        <NuxtLink class="manager-view-site" to="/" target="_blank"><MaterialIcon name="visibility" :size="17" />View website</NuxtLink>
        <div class="manager-user">
          <span>{{ profile?.email?.slice(0, 1).toUpperCase() || 'T' }}</span>
          <div><strong>{{ profile?.email || 'Tripport team' }}</strong><small>{{ profile?.role || 'Checking access…' }}</small></div>
          <button type="button" aria-label="Sign out" @click="signOut"><MaterialIcon name="logout" :size="18" /></button>
        </div>
      </div>
    </aside>

    <main class="manager-main">
      <div v-if="showImageProgress" class="manager-image-status">
        <AdminImageProgress
          :progress="imageProgress.percentage"
          :label="imageProgress.message"
          :detail="imageProgressDetail"
        />
      </div>
      <slot />
    </main>
  </div>
</template>

<style scoped>
.manager-shell{min-height:100dvh;background:#f5f7f5;color:#122b22}.manager-sidebar{position:fixed;inset:0 auto 0 0;z-index:5;display:flex;width:264px;flex-direction:column;padding:26px 16px 18px;background:#113e32;color:#eef6f1}.manager-brand{display:flex;align-items:center;gap:10px;padding:0 10px;color:#fff}.manager-brand>span{display:grid;width:32px;height:32px;place-items:center;border-radius:50%;background:#fff;color:#113e32;font-size:11px;font-weight:900}.manager-brand strong{font-size:17px;letter-spacing:-.045em}.manager-brand i{color:#a9cabd;font-size:12px;font-style:normal;font-weight:650;letter-spacing:0}.manager-nav{display:grid;gap:5px;margin-top:48px}.manager-nav a{display:flex;align-items:center;gap:12px;padding:12px 13px;border-radius:12px;color:rgb(238 246 241 / 70%);font-size:14px;font-weight:720}.manager-nav a:hover{background:rgb(255 255 255 / 9%);color:#fff}.manager-nav__item--active{background:#fff!important;color:#113e32!important}.manager-sidebar__bottom{display:grid;gap:16px;margin-top:auto}.manager-view-site{display:inline-flex;align-items:center;gap:8px;padding:9px 11px;color:#b7d1c6;font-size:13px;font-weight:750}.manager-user{display:grid;grid-template-columns:34px minmax(0,1fr) 30px;gap:9px;align-items:center;padding:12px 10px;border-top:1px solid rgb(255 255 255 / 13%)}.manager-user>span{display:grid;width:32px;height:32px;place-items:center;border-radius:50%;background:#29634f;color:#fff;font-size:13px;font-weight:850}.manager-user div{min-width:0}.manager-user strong,.manager-user small{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.manager-user strong{color:#fff;font-size:11px}.manager-user small{margin-top:2px;color:#a9cabd;font-size:10px;text-transform:capitalize}.manager-user button{display:grid;width:30px;height:30px;place-items:center;border:0;border-radius:8px;background:transparent;color:#b7d1c6}.manager-user button:hover{background:rgb(255 255 255 / 10%);color:#fff}.manager-main{min-height:100dvh;margin-left:264px}@media(max-width:760px){.manager-sidebar{position:static;width:auto;min-height:0;padding:16px;background:#113e32}.manager-nav{display:flex;gap:5px;overflow:auto;margin:18px -16px 0;padding:0 16px}.manager-nav a{flex:0 0 auto;padding:9px 10px;font-size:12px}.manager-sidebar__bottom{display:none}.manager-main{margin-left:0}}
</style>

<style scoped>
.manager-brand > span { padding: 6px; }
.manager-brand > span img { width: 100%; height: 100%; object-fit: contain; }
</style>

<style scoped>
.manager-image-status{position:sticky;top:16px;z-index:30;width:min(1040px,calc(100% - 64px));margin:16px auto -16px;pointer-events:none}.manager-image-status :deep(.admin-image-progress){margin-left:auto;box-shadow:0 14px 36px rgb(15 57 43 / 14%);pointer-events:auto}@media(max-width:760px){.manager-image-status{width:min(100% - 32px,1040px);top:8px;margin-top:12px}}
</style>
