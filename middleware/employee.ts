export default defineNuxtRouteMiddleware(async (to, from) => {
  let { isEmployee } = useRole()

  if (isEmployee.value) {
    let employeeStore = useEmployeeJobFormFillRequest()
    let authStore = useAuth()

    if (authStore.user?._id) {
      await employeeStore.getMyRequests(authStore.user?._id)
    }
    return true
  }

  return navigateTo("/login");
})