<script setup lang="ts">
withDefaults(defineProps<{
  progress: number
  label: string
  detail?: string
}>(), {
  detail: '',
})
</script>

<template>
  <div class="admin-image-progress" role="status" aria-live="polite">
    <div class="admin-image-progress__heading">
      <span><MaterialIcon name="progress_activity" :size="17" />{{ label }}</span>
      <strong>{{ Math.round(progress) }}%</strong>
    </div>
    <div
      class="admin-image-progress__track"
      role="progressbar"
      aria-label="Image upload progress"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-valuenow="Math.round(progress)"
    >
      <i :style="{ width: `${Math.max(0, Math.min(100, progress))}%` }" />
    </div>
    <small v-if="detail">{{ detail }}</small>
  </div>
</template>

<style scoped>
.admin-image-progress{display:grid;gap:8px;max-width:430px;padding:12px 13px;border:1px solid #c9ded1;border-radius:11px;background:#f4faf6;color:#245440}.admin-image-progress__heading{display:flex;align-items:center;justify-content:space-between;gap:12px}.admin-image-progress__heading span{display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:800}.admin-image-progress__heading .material-icon{animation:admin-image-progress-spin 1.15s linear infinite}.admin-image-progress__heading strong{color:#124434;font-size:12px}.admin-image-progress__track{height:7px;overflow:hidden;border-radius:999px;background:#dce9e0}.admin-image-progress__track i{display:block;width:0;height:100%;border-radius:inherit;background:linear-gradient(90deg,var(--forest,#113e32),#3b8d69);transition:width .2s ease}.admin-image-progress small{color:#688174;font-size:11px;font-weight:600;line-height:1.4}@keyframes admin-image-progress-spin{to{transform:rotate(360deg)}}@media(max-width:620px){.admin-image-progress{max-width:none}}
</style>
