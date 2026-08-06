<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const route = useRoute()
const { configured, session, initialise, signInWithPassword, sendPasswordReset } = useManagerAuth()
const email = ref('')
const password = ref('')
const status = ref<'idle' | 'signing-in' | 'sending-reset' | 'reset-sent' | 'error'>('idle')
const message = ref('')

onMounted(async () => {
  await initialise()
  if (session.value) await navigateTo('/admin')
  if (route.query.reason === 'access') {
    status.value = 'error'
    message.value = 'This email does not have access to Tripport Manager.'
  }
})

async function submit() {
  if (!email.value || !password.value) return
  status.value = 'signing-in'
  message.value = ''
  try {
    await signInWithPassword(email.value.trim(), password.value)
    await navigateTo('/admin')
  } catch (error) {
    status.value = 'error'
    message.value = error instanceof Error && error.message === 'Invalid login credentials'
      ? 'Your email or password is incorrect.'
      : error instanceof Error ? error.message : 'We could not sign you in.'
  }
}

async function requestPasswordReset() {
  if (!email.value) {
    status.value = 'error'
    message.value = 'Enter your work email first, then select this option.'
    return
  }

  status.value = 'sending-reset'
  message.value = ''
  try {
    await sendPasswordReset(email.value.trim())
    status.value = 'reset-sent'
    message.value = 'Check your inbox for the one-time link to set your password.'
  } catch (error) {
    status.value = 'error'
    message.value = error instanceof Error ? error.message : 'We could not send a password setup email.'
  }
}
</script>

<template>
  <main class="manager-login">
    <section class="manager-login__intro">
      <NuxtLink class="manager-login__brand" to="/"><span><img src="/images/tripport_logo.svg" alt=""></span>Tripport</NuxtLink>
      <div><span class="manager-login__eyebrow">Private content workspace</span><h1>Keep every journey beautifully organised.</h1><p>Add packages, update guides, manage images and publish only when every detail is ready.</p></div>
      <small>Tripport Manager · Kochi, Kerala</small>
    </section>

    <section class="manager-login__panel">
      <div class="manager-login__card">
        <span class="manager-login__mark"><MaterialIcon name="dashboard" :size="25" /></span>
        <template v-if="configured">
          <span class="manager-login__eyebrow">Tripport Manager</span>
          <h2>Welcome back.</h2>
          <p>Sign in with your approved work email and password.</p>
          <form @submit.prevent="submit">
            <label>Email address<input v-model="email" type="email" autocomplete="email" placeholder="name@company.com" required></label>
            <label>Password<input v-model="password" type="password" autocomplete="current-password" placeholder="Enter your password" required></label>
            <button class="manager-primary-button" :disabled="status === 'signing-in'" type="submit">{{ status === 'signing-in' ? 'Signing in…' : 'Sign in' }} <MaterialIcon name="arrow_forward" :size="18" /></button>
            <button class="manager-login__reset" :disabled="status === 'sending-reset'" type="button" @click="requestPasswordReset">{{ status === 'sending-reset' ? 'Sending setup link…' : 'Set or reset password' }}</button>
          </form>
          <p v-if="message" class="manager-login__message" :class="{ 'manager-login__message--error': status === 'error' }">{{ message }}</p>
        </template>
        <template v-else>
          <span class="manager-login__eyebrow">Setup pending</span>
          <h2>Connect Supabase first.</h2>
          <p>This secure workspace will be ready as soon as the Tripport Supabase project values are added.</p>
        </template>
      </div>
    </section>
  </main>
</template>

<style scoped>
.manager-login{display:grid;min-height:100dvh;grid-template-columns:minmax(0,1.1fr) minmax(440px,.9fr);background:#fff}.manager-login__intro{display:flex;min-height:100%;flex-direction:column;justify-content:space-between;padding:42px clamp(38px,8vw,120px);background:linear-gradient(140deg,#0e3028,#184c3b);color:#fff}.manager-login__brand{display:inline-flex;align-items:center;gap:10px;color:#fff;font-size:19px;font-weight:830;letter-spacing:-.05em}.manager-login__brand span{display:grid;width:33px;height:33px;place-items:center;border-radius:50%;background:#fff;color:#113e32;font-size:11px;letter-spacing:0}.manager-login__intro>div{max-width:570px}.manager-login__eyebrow{display:block;color:#84c4a8;font-size:11px;font-weight:850;letter-spacing:.13em;text-transform:uppercase}.manager-login__intro h1{max-width:550px;margin:16px 0 19px;font-size:clamp(48px,5.4vw,82px);letter-spacing:-.075em;line-height:.93}.manager-login__intro p{max-width:480px;margin:0;color:rgb(255 255 255 / 72%);font-size:18px;line-height:1.65}.manager-login__intro small{color:#92b9aa;font-size:12px}.manager-login__panel{display:grid;place-items:center;padding:40px;background:#f4f7f5}.manager-login__card{width:min(100%,405px);padding:38px;border:1px solid #dce8e1;border-radius:22px;background:#fff;box-shadow:0 20px 60px rgb(14 48 40 / 9%)}.manager-login__mark{display:grid;width:46px;height:46px;place-items:center;margin-bottom:28px;border-radius:13px;background:#e8f1ec;color:#113e32}.manager-login__card h2{margin:10px 0 11px;font-size:38px;letter-spacing:-.065em;line-height:1}.manager-login__card>p{margin:0;color:#64736c;font-size:15px;line-height:1.6}.manager-login__card form{display:grid;gap:17px;margin-top:28px}.manager-login__card label{display:grid;gap:7px;color:#365246;font-size:12px;font-weight:800}.manager-login__card input{width:100%;height:47px;padding:0 13px;border:1px solid #cfded6;border-radius:10px;outline:none;color:#163e30;font-size:14px}.manager-login__card input:focus{border-color:#1f7658;box-shadow:0 0 0 3px rgb(31 118 88 / 11%)}.manager-primary-button{display:inline-flex;min-height:48px;align-items:center;justify-content:center;gap:8px;border:0;border-radius:10px;background:#113e32;color:#fff;font-size:14px;font-weight:800}.manager-primary-button:hover{background:#0e3028}.manager-primary-button:disabled{opacity:.65;cursor:wait}.manager-login__reset{justify-self:start;padding:0;border:0;background:transparent;color:#1f6549;font-size:13px;font-weight:800;text-decoration:underline;text-underline-offset:3px}.manager-login__reset:hover{color:#113e32}.manager-login__reset:disabled{opacity:.6;cursor:wait}.manager-login__message{margin-top:18px!important;padding:11px 12px;border-radius:9px;background:#edf7f1;color:#296044!important;font-size:13px!important}.manager-login__message--error{background:#fff0ed;color:#a43721!important}@media(max-width:800px){.manager-login{grid-template-columns:1fr}.manager-login__intro{min-height:310px;padding:30px}.manager-login__intro h1{font-size:48px}.manager-login__panel{padding:28px}.manager-login__card{padding:28px}}
</style>

<style scoped>
.manager-login__brand span { padding: 6px; }
.manager-login__brand span img { width: 100%; height: 100%; object-fit: contain; }
</style>
