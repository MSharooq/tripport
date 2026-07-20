<script setup lang="ts">
import arrowBack from '@material-symbols/svg-400/rounded/arrow_back.svg?no-inline'
import arrowForward from '@material-symbols/svg-400/rounded/arrow_forward.svg?no-inline'
import check from '@material-symbols/svg-400/rounded/check.svg?no-inline'
import close from '@material-symbols/svg-400/rounded/close.svg?no-inline'
import expandMore from '@material-symbols/svg-400/rounded/keyboard_arrow_down.svg?no-inline'
import favorite from '@material-symbols/svg-400/rounded/favorite.svg?no-inline'
import menu from '@material-symbols/svg-400/rounded/menu.svg?no-inline'
import northEast from '@material-symbols/svg-400/rounded/north_east.svg?no-inline'
import remove from '@material-symbols/svg-400/rounded/remove.svg?no-inline'
import share from '@material-symbols/svg-400/rounded/share.svg?no-inline'

const props = withDefaults(defineProps<{
  name: string
  size?: number
}>(), {
  size: 20,
})

const icons: Record<string, string> = {
  arrow_back: arrowBack,
  arrow_forward: arrowForward,
  check,
  close,
  expand_more: expandMore,
  favorite_border: favorite,
  menu,
  north_east: northEast,
  remove,
  share,
}

const source = computed(() => icons[props.name])
</script>

<template>
  <span
    v-if="source"
    class="material-icon"
    :style="{ '--material-icon-size': `${size}px`, '--material-icon-source': `url('${source}')` }"
    aria-hidden="true"
  />
</template>

<style scoped>
.material-icon {
  display: inline-block;
  flex: 0 0 auto;
  width: var(--material-icon-size);
  height: var(--material-icon-size);
  background: currentColor;
  -webkit-mask-image: var(--material-icon-source);
  -webkit-mask-position: center;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-size: contain;
  mask-image: var(--material-icon-source);
  mask-position: center;
  mask-repeat: no-repeat;
  mask-size: contain;
}
</style>
