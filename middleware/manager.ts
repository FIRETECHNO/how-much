export default defineNuxtRouteMiddleware((to, from) => {
  let { isManager } = useRole()

  if (isManager.value) {
    return true
  }


  return navigateTo("/login");
})