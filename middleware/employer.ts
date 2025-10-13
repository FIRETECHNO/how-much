export default defineNuxtRouteMiddleware((to, from) => {
  let { isEmployer } = useRole()

  if (isEmployer.value) {
    return true
  }

  return navigateTo("/login");
})