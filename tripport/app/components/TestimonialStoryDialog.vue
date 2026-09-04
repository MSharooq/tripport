<script setup lang="ts">
import type { Testimonial } from '~/data/testimonials'

const props = defineProps<{
  testimonial: Testimonial
}>()

const emit = defineEmits<{ close: [] }>()
const closeButton = ref<HTMLButtonElement | null>(null)
const panel = ref<HTMLElement | null>(null)

const imageSource = computed(() => props.testimonial.image?.trim() ? {
  url: props.testimonial.image,
  variants: props.testimonial.imageVariants,
  width: props.testimonial.imageWidth,
  height: props.testimonial.imageHeight,
} : null)
const initials = computed(() => props.testimonial.name.trim().split(/\s+/).filter(Boolean).slice(0, 2).map(word => word[0]).join('').toUpperCase() || 'T')
const travellerMeta = computed(() => [props.testimonial.location, props.testimonial.travellerType].filter(Boolean).join(' · '))
const storyMedia = computed(() => props.testimonial.storyMedia?.filter((media) => media.url?.trim()) || [])
const stars = computed(() => Array.from({ length: 5 }, (_, index) => index < Number(props.testimonial.rating || 0)))
let previousOverflow = ''

function close() {
  emit('close')
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') close()
  if (event.key !== 'Tab' || !panel.value) return

  const focusable = Array.from(panel.value.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
  ))
  if (!focusable.length) return

  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  if (!first || !last) return
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

onMounted(() => {
  previousOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
  document.addEventListener('keydown', onKeydown)
  nextTick(() => closeButton.value?.focus())
})

onBeforeUnmount(() => {
  document.body.style.overflow = previousOverflow
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="story-dialog">
      <div class="story-dialog" role="presentation" @click.self="close">
        <section ref="panel" class="story-dialog__panel" role="dialog" aria-modal="true" :aria-labelledby="`story-dialog-${testimonial.id}`">
          <button ref="closeButton" class="story-dialog__close" type="button" aria-label="Close traveller story" @click="close"><MaterialIcon name="close" :size="20" /></button>

          <header class="story-dialog__header">
            <div class="story-dialog__traveller">
              <TripportImage v-if="imageSource" :image="imageSource" :alt="testimonial.name ? `${testimonial.name}, traveller` : 'Traveller'" sizes="56px" />
              <span v-else class="story-dialog__avatar" aria-hidden="true">{{ initials }}</span>
              <div><span>Traveller story</span><strong>{{ testimonial.name || 'Tripport traveller' }}</strong><small v-if="travellerMeta">{{ travellerMeta }}</small></div>
            </div>
            <div class="story-dialog__rating" :aria-label="`${testimonial.rating || 0} out of 5 stars`"><MaterialIcon v-for="(active, index) in stars" :key="index" name="star" :size="18" :style="{ color: active ? '#d38b1f' : '#dfe6e2' }" /></div>
          </header>

          <div class="story-dialog__body">
            <span v-if="testimonial.featured" class="story-dialog__featured">Featured story</span>
            <h2 :id="`story-dialog-${testimonial.id}`">{{ testimonial.title || 'A Tripport journey' }}</h2>
            <blockquote>“{{ testimonial.quote }}”</blockquote>

            <div v-if="storyMedia.length" class="story-dialog__media">
              <figure v-for="media in storyMedia" :key="media.url">
                <img v-if="media.type === 'image'" :src="media.url" :alt="media.alt || 'Traveller shared photo'">
                <video v-else controls playsinline preload="metadata"><source :src="media.url">Your browser does not support this traveller video.</video>
              </figure>
            </div>
          </div>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.story-dialog{position:fixed;z-index:100;inset:0;display:grid;place-items:center;padding:24px;background:rgb(10 29 21 / 54%);backdrop-filter:blur(8px)}.story-dialog__panel{position:relative;width:min(690px,100%);max-height:min(760px,calc(100vh - 48px));overflow:auto;border:1px solid rgb(255 255 255 / 48%);border-radius:24px;background:#fff;color:#173b2e;box-shadow:0 28px 90px rgb(3 19 13 / 28%)}.story-dialog__close{position:absolute;z-index:1;top:18px;right:18px;display:grid;width:39px;height:39px;place-items:center;border:1px solid #d9e5de;border-radius:50%;background:rgb(255 255 255 / 94%);color:#1c4938;transition:background .18s ease,color .18s ease}.story-dialog__close:hover{background:var(--forest);color:#fff}.story-dialog__close:focus-visible{outline:3px solid rgb(15 115 85 / 28%);outline-offset:3px}.story-dialog__header{display:flex;align-items:center;justify-content:space-between;gap:22px;padding:28px 76px 25px 29px;border-bottom:1px solid #e4ece7}.story-dialog__traveller{display:flex;align-items:center;gap:13px;min-width:0}.story-dialog__traveller :deep(img),.story-dialog__avatar{display:grid;width:56px;height:56px;flex:0 0 auto;place-items:center;border-radius:50%;object-fit:cover}.story-dialog__traveller :deep(img){background:#dbe9e1}.story-dialog__avatar{background:#dceee2;color:#276349;font-size:16px;font-weight:850}.story-dialog__traveller span,.story-dialog__traveller strong,.story-dialog__traveller small{display:block}.story-dialog__traveller span{color:#73827a;font-size:10px;font-weight:850;letter-spacing:.1em;text-transform:uppercase}.story-dialog__traveller strong{overflow:hidden;margin-top:4px;color:#183b2e;font-size:16px;text-overflow:ellipsis;white-space:nowrap}.story-dialog__traveller small{margin-top:3px;color:#78867f;font-size:12px}.story-dialog__rating{display:flex;flex:0 0 auto;gap:2px}.story-dialog__body{padding:31px}.story-dialog__featured{display:inline-flex;padding:5px 8px;border-radius:999px;background:#e9f5ed;color:#23714f;font-size:10px;font-weight:850;letter-spacing:.06em;text-transform:uppercase}.story-dialog h2{margin:13px 0 17px;color:#173b2e;font-size:clamp(27px,4vw,39px);letter-spacing:-.06em;line-height:1.02}.story-dialog blockquote{margin:0;color:#40574c;font-size:17px;font-weight:520;line-height:1.75}.story-dialog__media{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:12px;margin-top:29px}.story-dialog__media figure{height:225px;margin:0;overflow:hidden;border-radius:15px;background:#e7efe9}.story-dialog__media img,.story-dialog__media video{display:block;width:100%;height:100%;object-fit:cover}.story-dialog__media video{background:#143d31}.story-dialog-enter-active,.story-dialog-leave-active{transition:opacity .22s ease}.story-dialog-enter-active .story-dialog__panel,.story-dialog-leave-active .story-dialog__panel{transition:transform .24s ease,opacity .24s ease}.story-dialog-enter-from,.story-dialog-leave-to{opacity:0}.story-dialog-enter-from .story-dialog__panel,.story-dialog-leave-to .story-dialog__panel{opacity:0;transform:translateY(12px) scale(.985)}@media(max-width:560px){.story-dialog{align-items:end;padding:0}.story-dialog__panel{max-height:calc(100vh - 18px);border-bottom-right-radius:0;border-bottom-left-radius:0}.story-dialog__header{padding:23px 65px 20px 21px}.story-dialog__body{padding:25px 21px 31px}.story-dialog blockquote{font-size:15px}.story-dialog__media figure{height:190px}}
</style>
