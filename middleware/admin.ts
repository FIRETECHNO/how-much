export default defineNuxtRouteMiddleware((to, from) => {
  let authStore = useAuth()
  let isAuth = !!authStore.user
  return true;
  
  if (isAuth) {
    if (authStore.user?.roles.indexOf('admin') != -1) {
      return true;
    }
  }
  return abortNavigation();
})