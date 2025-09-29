export default defineNuxtRouteMiddleware((to, from) => {
  let { isEmployer, isAdmin } = useRole()

  if (isEmployer.value || isAdmin.value) {
    return true
  }


  return false;
})