export default defineNuxtRouteMiddleware((to, from) => {
  const { isAdmin, isManager, isEmployee, isEmployer } = useRole();

  if (isAdmin.value) {
    return setPageLayout("admin")
  }
  if (isManager.value) {
    return setPageLayout("manager")
  }

  if (isEmployee.value) {
    return setPageLayout("employee")
  }

  if (isEmployer.value) {
    return setPageLayout("employer")
  }

  return setPageLayout("default")
});