export default defineNuxtRouteMiddleware((to, from) => {
  const { isAdmin, isManager } = useRole();

  if (isAdmin.value) {
    return setPageLayout("admin")
  }
  if (isManager.value) {
    return setPageLayout("manager")
  }

  return setPageLayout("default")
});