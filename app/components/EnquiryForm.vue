<template>
  <form class="rounded-[2rem] border border-mist-200 bg-white p-5 shadow-mist sm:p-8" @submit.prevent="submitted = true">
    <div class="grid gap-4 md:grid-cols-2">
      <label v-for="field in fields" :key="field.name" class="grid gap-2 text-sm font-bold text-forest-950" :class="field.type === 'textarea' ? 'md:col-span-2' : ''">
        {{ field.label }}
        <textarea
          v-if="field.type === 'textarea'"
          class="min-h-32 rounded-2xl border border-mist-200 bg-mist-50 px-4 py-3 font-normal outline-none transition focus:border-sage-600"
          :name="field.name"
          :placeholder="field.placeholder"
        />
        <input
          v-else
          class="rounded-full border border-mist-200 bg-mist-50 px-4 py-3 font-normal outline-none transition focus:border-sage-600"
          :name="field.name"
          :placeholder="field.placeholder"
          :type="field.type"
        >
      </label>
    </div>
    <div class="mt-6 flex flex-wrap items-center gap-3">
      <button class="rounded-full bg-forest-950 px-6 py-3 text-sm font-bold text-white" type="submit">{{ submitLabel }}</button>
      <a class="rounded-full border border-sage-300 px-6 py-3 text-sm font-bold text-forest-950" :href="whatsappLink" rel="noreferrer" target="_blank">{{ whatsappLabel }}</a>
      <p v-if="submitted" class="text-sm font-semibold text-sage-600">{{ successMessage }}</p>
    </div>
  </form>
</template>

<script setup lang="ts">
const props = defineProps<{
  submitLabel: string
  whatsappLabel: string
  whatsappNumber: string
}>()

const submitted = ref(false)
const successMessage = 'Your enquiry is ready to connect. Use WhatsApp for the fastest response.'
const whatsappLink = computed(() => `https://wa.me/${props.whatsappNumber}`)
const fields = [
  { name: 'name', label: 'Name', type: 'text', placeholder: 'Your name' },
  { name: 'phone', label: 'Phone', type: 'tel', placeholder: '+91' },
  { name: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
  { name: 'destination', label: 'Destination interest', type: 'text', placeholder: 'Kerala, Coorg, Wayanad' },
  { name: 'travelMonth', label: 'Travel month', type: 'text', placeholder: 'January, February...' },
  { name: 'travellers', label: 'Number of travellers', type: 'number', placeholder: '2' },
  { name: 'message', label: 'Message', type: 'textarea', placeholder: 'Tell us your dates, pace, stay style, and anything important.' }
]
</script>
