<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const { configured, session, initialise, updatePassword } = useManagerAuth()
const password = ref('')
const confirmation = ref('')
const status = ref<'idle' | 'saving' | 'error'>('idle')
const message = ref('')
const ready = ref(false)

onMounted(async () => {
  await initialise()
  ready.value = true
})

async function submit() {
  if (password.value.length < 12) {
    status.value = 'error'
    message.value = 'Choose a password with at least 12 characters.'
    return
  }

  if (password.value !== confirmation.value) {
    status.value = 'error'
    message.value = 'The two passwords do not match.'
    return
  }

  status.value = 'saving'
  message.value = ''
  try {
    await updatePassword(password.value)
    await navigateTo('/admin')
  } catch (error) {
    status.value = 'error'
    message.value = error instanceof Error ? error.message : 'We could not save your password.'
  }
}
</script>

<template>
  <main class="password-page">
    <section class="password-card">
      <NuxtLink class="password-brand" to="/"><span><img src="/images/tripport_logo.svg" alt=""></span>Tripport <i>Manager</i></NuxtLink>

      <template v-if="configured">
        <span class="password-kicker">Secure your account</span>
        <h1>Choose a password.</h1>
        <p v-if="!ready">Preparing your secure password form…</p>
        <template v-else-if="session">
          <p>Use this password with your work email whenever you sign in to Tripport Manager.</p>
          <form @submit.prevent="submit">
            <label>New password<input v-model="password" type="password" autocomplete="new-password" minlength="12" placeholder="At least 12 characters" required></label>
            <label>Confirm password<input v-model="confirmation" type="password" autocomplete="new-password" minlength="12" placeholder="Repeat your password" required></label>
            <button class="password-submit" :disabled="status === 'saving'" type="submit">{{ status === 'saving' ? 'Saving password…' : 'Save password' }} <MaterialIcon name="arrow_forward" :size="18" /></button>
          </form>
        </template>
        <template v-else>
          <p>This password setup link is invalid or has expired. Return to sign in and request a new one.</p>
          <NuxtLink class="password-back" to="/admin/login">Return to sign in</NuxtLink>
        </template>
        <p v-if="message" class="password-message">{{ message }}</p>
      </template>

      <template v-else>
        <span class="password-kicker">Setup pending</span>
        <h1>Connect Supabase first.</h1>
        <p>Tripport Manager will be ready once its Supabase project values are connected.</p>
      </template>
    </section>
  </main>
</template>

<style scoped>
.password-page{display:grid;min-height:100dvh;place-items:center;padding:28px;background:linear-gradient(135deg,#edf4ef 0%,#f9fbfa 55%,#e2efe7 100%)}.password-card{width:min(100%,450px);padding:38px;border:1px solid #dce8e1;border-radius:22px;background:#fff;box-shadow:0 24px 66px rgb(14 48 40 / 12%)}.password-brand{display:inline-flex;align-items:center;gap:9px;color:#113e32;font-size:17px;font-weight:850;letter-spacing:-.045em}.password-brand span{display:grid;width:34px;height:34px;place-items:center;padding:6px;border-radius:50%;background:#e8f1ec}.password-brand img{width:100%;height:100%;object-fit:contain}.password-brand i{color:#5b7669;font-size:12px;font-style:normal;font-weight:700;letter-spacing:0}.password-kicker{display:block;margin-top:35px;color:#297154;font-size:11px;font-weight:850;letter-spacing:.13em;text-transform:uppercase}.password-card h1{margin:10px 0 12px;color:#123629;font-size:40px;letter-spacing:-.065em;line-height:1}.password-card>p{margin:0;color:#68786f;font-size:15px;line-height:1.62}.password-card form{display:grid;gap:17px;margin-top:27px}.password-card label{display:grid;gap:7px;color:#365246;font-size:12px;font-weight:800}.password-card input{width:100%;height:48px;padding:0 13px;border:1px solid #cfded6;border-radius:10px;outline:0;color:#163e30;font-size:14px}.password-card input:focus{border-color:#1f7658;box-shadow:0 0 0 3px rgb(31 118 88 / 11%)}.password-submit{display:inline-flex;min-height:48px;align-items:center;justify-content:center;gap:8px;border:0;border-radius:10px;background:#113e32;color:#fff;font-size:14px;font-weight:800}.password-submit:hover{background:#0e3028}.password-submit:disabled{opacity:.65;cursor:wait}.password-message{margin-top:18px!important;padding:11px 12px;border-radius:9px;background:#fff0ed;color:#a43721!important;font-size:13px!important;font-weight:700}.password-back{display:inline-flex;margin-top:22px;color:#1f6549;font-size:13px;font-weight:800;text-decoration:underline;text-underline-offset:3px}@media(max-width:540px){.password-page{padding:18px}.password-card{padding:28px}.password-card h1{font-size:35px}}
</style>
