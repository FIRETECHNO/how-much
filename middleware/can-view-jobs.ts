import { toast } from "vue3-toastify";

export default defineNuxtRouteMiddleware((to, from) => {
  let { isEmployer, isAdmin, isModerated } = useRole()
  let { isEmployerSubscriptionActive } = useSubscription()

  if ((isEmployer.value && isModerated.value && isEmployerSubscriptionActive.value) || isAdmin.value) {
    return true
  }

  if (process.client) {
    if (!isEmployerSubscriptionActive.value) {
      toast.warn("Оплатите подписку, чтобы посмотреть анкеты")
    } else {
      toast.warn("Вы не можете просматривать анкеты")
    }
  }
  return navigateTo("/me");
})