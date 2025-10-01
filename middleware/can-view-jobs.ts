export default defineNuxtRouteMiddleware((to, from) => {
  let { isEmployer, isAdmin, isModerated } = useRole()

  if ((isEmployer.value && isModerated.value) || isAdmin.value) {
    return true
  }


  return false;
})