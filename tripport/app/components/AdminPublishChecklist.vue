<script setup lang="ts">
const props = defineProps<{
  items: Array<{ label: string, complete: boolean }>
}>()

const remaining = computed(() => props.items.filter(item => !item.complete).length)
</script>

<template>
  <aside class="publish-checklist" :class="{ 'publish-checklist--ready': remaining === 0 }">
    <div class="publish-checklist__heading"><div><span>Publishing checklist</span><strong>{{ remaining === 0 ? 'Ready to publish' : `${remaining} required item${remaining === 1 ? '' : 's'} left` }}</strong></div><MaterialIcon :name="remaining === 0 ? 'check' : 'edit'" :size="21" /></div>
    <ul><li v-for="item in items" :key="item.label" :class="{ 'is-complete': item.complete }"><MaterialIcon :name="item.complete ? 'check' : 'remove'" :size="15" /><span>{{ item.label }}</span></li></ul>
    <p>Drafts can be saved with only a title and URL slug. Publishing is blocked until this checklist is complete.</p>
  </aside>
</template>

<style scoped>
.publish-checklist{display:grid;gap:14px;padding:18px 19px;border:1px solid #e9c7b9;border-radius:15px;background:#fffaf7}.publish-checklist--ready{border-color:#b7dbc5;background:#f3faf5}.publish-checklist__heading{display:flex;align-items:center;justify-content:space-between;gap:14px;color:#a14e34}.publish-checklist--ready .publish-checklist__heading{color:#1c714c}.publish-checklist__heading span{display:block;font-size:10px;font-weight:850;letter-spacing:.12em;text-transform:uppercase}.publish-checklist__heading strong{display:block;margin-top:4px;font-size:17px;letter-spacing:-.04em}.publish-checklist ul{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;padding:0;margin:0;list-style:none}.publish-checklist li{display:flex;gap:6px;align-items:flex-start;color:#925845;font-size:12px;font-weight:720;line-height:1.35}.publish-checklist li .material-icon{margin-top:1px;color:#bd735a}.publish-checklist li.is-complete{color:#276147}.publish-checklist li.is-complete .material-icon{color:#168058}.publish-checklist p{margin:0;color:#6f756f;font-size:11px;line-height:1.55}@media(max-width:620px){.publish-checklist ul{grid-template-columns:1fr}}
</style>
