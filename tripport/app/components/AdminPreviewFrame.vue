<script setup lang="ts">
defineProps<{
  label: string
}>()

defineEmits<{ close: [] }>()
</script>

<template>
  <Teleport to="body">
    <div class="preview-frame" role="dialog" aria-modal="true" :aria-label="`${label} preview`" @click.self="$emit('close')">
      <section class="preview-frame__surface">
        <header class="preview-frame__header">
          <div><span>Unsaved live preview</span><strong>{{ label }}</strong></div>
          <button type="button" aria-label="Close preview" @click="$emit('close')"><MaterialIcon name="close" :size="20" /></button>
        </header>
        <div class="preview-frame__notice"><MaterialIcon name="visibility" :size="17" />This is how the current form content will appear on Tripport. Nothing has been published.</div>
        <div class="preview-frame__page"><slot /></div>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.preview-frame{position:fixed;z-index:100;inset:0;display:grid;place-items:center;padding:24px;background:rgb(12 34 27 / 58%);backdrop-filter:blur(8px)}.preview-frame__surface{display:grid;grid-template-rows:auto auto minmax(0,1fr);width:min(1120px,100%);height:min(900px,calc(100dvh - 48px));overflow:hidden;border-radius:22px;background:#f7faf8;box-shadow:0 26px 90px rgb(0 0 0 / 28%)}.preview-frame__header{display:flex;align-items:center;justify-content:space-between;gap:18px;padding:15px 20px;border-bottom:1px solid #dce8e0;background:#113e32;color:#fff}.preview-frame__header div{display:flex;align-items:baseline;gap:8px}.preview-frame__header span{color:#a8ccbb;font-size:10px;font-weight:850;letter-spacing:.11em;text-transform:uppercase}.preview-frame__header strong{font-size:15px;letter-spacing:-.03em}.preview-frame__header button{display:grid;width:34px;height:34px;place-items:center;border:1px solid rgb(255 255 255 / 17%);border-radius:9px;background:transparent;color:#fff;cursor:pointer}.preview-frame__header button:hover{background:rgb(255 255 255 / 10%)}.preview-frame__notice{display:flex;align-items:center;gap:8px;padding:10px 20px;border-bottom:1px solid #dce8e0;background:#edf7f1;color:#246146;font-size:12px;font-weight:750}.preview-frame__page{min-height:0;height:100%;overflow-x:hidden;overflow-y:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;background:#fff}@media(max-width:620px){.preview-frame{padding:0}.preview-frame__surface{height:100dvh;border-radius:0}.preview-frame__header{padding:13px 16px}.preview-frame__notice{padding:10px 16px}}
</style>
