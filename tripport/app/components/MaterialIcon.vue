<script setup lang="ts">
import arrowBack from '@material-symbols/svg-400/rounded/arrow_back.svg?no-inline'
import arrowForward from '@material-symbols/svg-400/rounded/arrow_forward.svg?no-inline'
import add from '@material-symbols/svg-400/rounded/add.svg?no-inline'
import archive from '@material-symbols/svg-400/rounded/archive.svg?no-inline'
import check from '@material-symbols/svg-400/rounded/check.svg?no-inline'
import chevronRight from '@material-symbols/svg-400/rounded/chevron_right.svg?no-inline'
import close from '@material-symbols/svg-400/rounded/close.svg?no-inline'
import contentCopy from '@material-symbols/svg-400/rounded/content_copy.svg?no-inline'
import dashboard from '@material-symbols/svg-400/rounded/dashboard.svg?no-inline'
import deleteIcon from '@material-symbols/svg-400/rounded/delete.svg?no-inline'
import edit from '@material-symbols/svg-400/rounded/edit.svg?no-inline'
import expandMore from '@material-symbols/svg-400/rounded/keyboard_arrow_down.svg?no-inline'
import favorite from '@material-symbols/svg-400/rounded/favorite.svg?no-inline'
import image from '@material-symbols/svg-400/rounded/image.svg?no-inline'
import logout from '@material-symbols/svg-400/rounded/logout.svg?no-inline'
import menu from '@material-symbols/svg-400/rounded/menu.svg?no-inline'
import moreHoriz from '@material-symbols/svg-400/rounded/more_horiz.svg?no-inline'
import northEast from '@material-symbols/svg-400/rounded/north_east.svg?no-inline'
import photoLibrary from '@material-symbols/svg-400/rounded/photo_library.svg?no-inline'
import progressActivity from '@material-symbols/svg-400/rounded/progress_activity.svg?no-inline'
import remove from '@material-symbols/svg-400/rounded/remove.svg?no-inline'
import search from '@material-symbols/svg-400/rounded/search.svg?no-inline'
import share from '@material-symbols/svg-400/rounded/share.svg?no-inline'
import settings from '@material-symbols/svg-400/rounded/settings.svg?no-inline'
import star from '@material-symbols/svg-400/rounded/star.svg?no-inline'
import uploadFile from '@material-symbols/svg-400/rounded/upload_file.svg?no-inline'
import videocam from '@material-symbols/svg-400/rounded/videocam.svg?no-inline'
import visibility from '@material-symbols/svg-400/rounded/visibility.svg?no-inline'

const props = withDefaults(defineProps<{
  name: string
  size?: number
}>(), {
  size: 20,
})

const icons: Record<string, string> = {
  add,
  archive,
  arrow_back: arrowBack,
  arrow_forward: arrowForward,
  check,
  chevron_right: chevronRight,
  close,
  content_copy: contentCopy,
  dashboard,
  delete: deleteIcon,
  edit,
  expand_more: expandMore,
  favorite_border: favorite,
  image,
  logout,
  menu,
  more_horiz: moreHoriz,
  north_east: northEast,
  photo_library: photoLibrary,
  progress_activity: progressActivity,
  remove,
  search,
  share,
  settings,
  star,
  upload_file: uploadFile,
  videocam,
  visibility,
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
