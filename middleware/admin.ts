export default defineNuxtRouteMiddleware((to, from) => {
  let { isAdmin } = useRole();

  if (isAdmin.value) {
    return true
  }

  return navigateTo("/login");
})