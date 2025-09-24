export default defineNuxtRouteMiddleware((to, from) => {
  let authStore = useAuth()
  let isAuth = !!authStore.user
  const config = useRuntimeConfig()

  if (isAuth && authStore.user?.email) {
    if (process.server) {
      let adminEmails = config.adminEmails?.split(",") || []
      if (adminEmails.includes(authStore.user.email)) {
        return true
      }
      return navigateTo('/login')
    } else {
      if (authStore.user?.roles.indexOf('manager') != -1) {
        return true;
      }
    }
  }

  return navigateTo("/login");
})