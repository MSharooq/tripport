import type { Session } from '@supabase/supabase-js'
import type { ManagerProfile } from '~/data/manager'

export function useManagerAuth() {
  const session = useState<Session | null>('manager-session', () => null)
  const profile = useState<ManagerProfile | null>('manager-profile', () => null)
  const isLoading = useState('manager-auth-loading', () => false)
  const isReady = useState('manager-auth-ready', () => false)
  const configured = computed(() => isSupabaseConfigured())

  async function refreshProfile() {
    const supabase = useTripportSupabase()
    if (!supabase || !session.value) {
      profile.value = null
      return
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, role')
      .eq('id', session.value.user.id)
      .maybeSingle()

    if (error || !data) {
      profile.value = null
      return
    }

    profile.value = data as ManagerProfile
  }

  async function initialise() {
    if (import.meta.server || isReady.value) return
    const supabase = useTripportSupabase()
    if (!supabase) {
      isReady.value = true
      return
    }

    isLoading.value = true
    const { data } = await supabase.auth.getSession()
    session.value = data.session
    await refreshProfile()
    isLoading.value = false
    isReady.value = true

    supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      session.value = nextSession
      await refreshProfile()
    })
  }

  async function signInWithPassword(email: string, password: string) {
    const supabase = useTripportSupabase()
    if (!supabase) throw new Error('Supabase is not configured yet.')

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error

    session.value = data.session
    await refreshProfile()
  }

  async function sendPasswordReset(email: string) {
    const supabase = useTripportSupabase()
    if (!supabase) throw new Error('Supabase is not configured yet.')

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/reset-password`,
    })
    if (error) throw error
  }

  async function updatePassword(password: string) {
    const supabase = useTripportSupabase()
    if (!supabase) throw new Error('Supabase is not configured yet.')

    const { error } = await supabase.auth.updateUser({ password })
    if (error) throw error

    const { data } = await supabase.auth.getSession()
    session.value = data.session
    await refreshProfile()
  }

  async function signOut() {
    const supabase = useTripportSupabase()
    if (supabase) await supabase.auth.signOut()
    session.value = null
    profile.value = null
    await navigateTo('/admin/login')
  }

  const canManage = computed(() => profile.value?.role === 'manager' || profile.value?.role === 'editor')
  const canPublish = computed(() => profile.value?.role === 'manager')

  return { session, profile, isLoading, isReady, configured, canManage, canPublish, initialise, refreshProfile, signInWithPassword, sendPasswordReset, updatePassword, signOut }
}
