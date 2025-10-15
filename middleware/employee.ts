export default defineNuxtRouteMiddleware((to, from) => {
  let { isEmployee } = useRole()

  if (isEmployee.value) {
    return true
  }

  return navigateTo("/login");
})