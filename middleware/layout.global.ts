export default defineNuxtRouteMiddleware((to, from) => {
  const { isAdmin, isManager, isEmployee } = useRole();

  if (isAdmin.value) {
    return setPageLayout("admin")
  }
  if (isManager.value) {
    return setPageLayout("manager")
  }

  if (isEmployee.value) {
    return setPageLayout("employee")
  }

  return setPageLayout("default")
});