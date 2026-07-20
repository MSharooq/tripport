<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  modelValue: boolean
  selectedItineraryTitle?: string
  enquiryContext?: {
    enquiryType?: 'package' | 'planning'
    travelMonth?: string
    travellers?: number
  }
}>(), {
  selectedItineraryTitle: '',
  enquiryContext: () => ({}),
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const dialog = ref<HTMLElement | null>(null)
const nameInput = ref<HTMLInputElement | null>(null)
const submitted = ref(false)
const form = ref({
  name: '',
  phone: '',
  email: '',
  travelMonth: '',
  travellers: 2,
  message: '',
})

function close() {
  emit('update:modelValue', false)
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') close()
}

function onBackdrop(event: MouseEvent) {
  if (event.target === event.currentTarget) close()
}

function submit() {
  submitted.value = true
}

function resetFormForEnquiry() {
  form.value = {
    name: '',
    phone: '',
    email: '',
    travelMonth: props.enquiryContext?.travelMonth ?? '',
    travellers: props.enquiryContext?.travellers ?? 2,
    message: props.enquiryContext?.enquiryType === 'planning'
      ? 'I would like help planning a South India journey.'
      : '',
  }
}

watch(() => props.modelValue, async (open) => {
  if (open) {
    submitted.value = false
    resetFormForEnquiry()
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeydown)
    await nextTick()
    nameInput.value?.focus()
  } else {
    document.body.style.overflow = ''
    window.removeEventListener('keydown', onKeydown)
  }
})

onBeforeUnmount(() => {
  document.body.style.overflow = ''
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="enquiry-fade">
      <div
        v-if="modelValue"
        class="enquiry-backdrop"
        role="presentation"
        @mousedown="onBackdrop"
      >
        <section
          ref="dialog"
          class="enquiry-dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="enquiry-title"
          aria-describedby="enquiry-description"
        >
          <button class="enquiry-close" type="button" aria-label="Close enquiry form" @click="close">
            <MaterialIcon name="close" :size="22" />
          </button>

          <div v-if="submitted" class="enquiry-success" role="status">
            <span class="enquiry-check"><MaterialIcon name="check" :size="28" /></span>
            <p class="enquiry-kicker">Enquiry received</p>
            <h2 id="enquiry-title">Thank you, {{ form.name }}.</h2>
            <p id="enquiry-description">
              We have saved your trip details and the Tripport team will get in touch with you shortly.
            </p>
            <button class="enquiry-submit" type="button" @click="close">Done</button>
          </div>

          <template v-else>
            <header class="enquiry-header">
              <p class="enquiry-kicker">Plan with Tripport</p>
              <h2 id="enquiry-title">Tell us about your trip</h2>
              <p id="enquiry-description">
                <template v-if="selectedItineraryTitle">
                  Enquiring about <strong>{{ selectedItineraryTitle }}</strong>. Share a few details and our team will contact you.
                </template>
                <template v-else>
                  Share a few details and our team will help shape the right South India journey.
                </template>
              </p>
            </header>

            <form class="enquiry-form" @submit.prevent="submit">
              <label>
                <span>Name</span>
                <input ref="nameInput" v-model.trim="form.name" name="name" autocomplete="name" required>
              </label>
              <label>
                <span>Phone / WhatsApp</span>
                <input v-model.trim="form.phone" name="phone" type="tel" autocomplete="tel" required>
              </label>
              <label>
                <span>Email</span>
                <input v-model.trim="form.email" name="email" type="email" autocomplete="email" required>
              </label>
              <label>
                <span>Travel month</span>
                <input v-model="form.travelMonth" name="travelMonth" type="month">
              </label>
              <label>
                <span>Travellers</span>
                <input v-model.number="form.travellers" name="travellers" type="number" min="1" max="99" required>
              </label>
              <label class="enquiry-wide">
                <span>Message <small>(optional)</small></span>
                <textarea v-model.trim="form.message" name="message" rows="3" placeholder="Dates, preferences or anything else we should know" />
              </label>
              <button class="enquiry-submit enquiry-wide" type="submit">Send enquiry</button>
            </form>
          </template>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.enquiry-backdrop { position: fixed; inset: 0; z-index: 1000; display: grid; place-items: center; padding: 24px; background: rgb(9 36 29 / 58%); backdrop-filter: blur(6px); }
.enquiry-dialog { position: relative; width: min(680px, 100%); max-height: calc(100vh - 48px); overflow-y: auto; padding: 34px; border-radius: 24px; background: #fff; color: #17372f; box-shadow: 0 28px 90px rgb(6 49 37 / 30%); }
.enquiry-close { position: absolute; top: 16px; right: 16px; width: 38px; height: 38px; border: 0; border-radius: 50%; background: #eef6f2; color: #234b3f; font-size: 25px; line-height: 1; cursor: pointer; }
.enquiry-header { padding-right: 42px; }
.enquiry-kicker { margin: 0 0 8px; color: #087f5b; font-size: 13px; font-weight: 800; letter-spacing: .11em; text-transform: uppercase; }
h2 { margin: 0; font-size: clamp(30px, 5vw, 40px); letter-spacing: -.04em; }
.enquiry-header > p:last-child, .enquiry-success > p:last-of-type { margin: 12px 0 0; color: #647a72; line-height: 1.6; }
.enquiry-form { display: grid; grid-template-columns: 1fr 1fr; gap: 17px; margin-top: 26px; }
label { display: grid; gap: 7px; color: #35584d; font-size: 14px; font-weight: 700; }
label small { color: #7a8d87; font-weight: 500; }
input, textarea { width: 100%; border: 1px solid #cfddd7; border-radius: 11px; padding: 12px 13px; background: #fbfdfc; color: #17372f; font: inherit; outline: none; }
input:focus, textarea:focus { border-color: #087f5b; box-shadow: 0 0 0 3px rgb(8 127 91 / 12%); }
textarea { resize: vertical; }
.enquiry-wide { grid-column: 1 / -1; }
.enquiry-submit { min-height: 49px; border: 0; border-radius: 12px; background: #087f5b; color: #fff; font: inherit; font-weight: 800; cursor: pointer; }
.enquiry-submit:hover { background: #066b4c; }
.enquiry-success { padding: 34px 12px 18px; text-align: center; }
.enquiry-success .enquiry-submit { min-width: 130px; margin-top: 24px; }
.enquiry-check { display: grid; place-items: center; width: 58px; height: 58px; margin: 0 auto 20px; border-radius: 50%; background: #e6f7ef; color: #087f5b; font-size: 26px; font-weight: 800; }
.enquiry-fade-enter-active, .enquiry-fade-leave-active { transition: opacity .2s ease; }
.enquiry-fade-enter-from, .enquiry-fade-leave-to { opacity: 0; }
@media (max-width: 600px) { .enquiry-backdrop { padding: 12px; } .enquiry-dialog { padding: 28px 20px; border-radius: 19px; } .enquiry-form { grid-template-columns: 1fr; } .enquiry-wide { grid-column: auto; } }
</style>
