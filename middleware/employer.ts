export default defineNuxtRouteMiddleware(async (to, from) => {
  let { isEmployer } = useRole()

  if (isEmployer.value) {
    const { checkSubscriptionStatus } = useSubscription()

    await checkSubscriptionStatus()

    return true
  }

  return navigateTo("/login");
})