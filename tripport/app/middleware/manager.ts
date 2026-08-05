export default defineNuxtRouteMiddleware(async () => {
  if (import.meta.server) return

  const { initialise, session, canManage } = useManagerAuth()
  await initialise()

  if (!session.value) return navigateTo('/admin/login')
  if (!canManage.value) return navigateTo('/admin/login?reason=access')
})
