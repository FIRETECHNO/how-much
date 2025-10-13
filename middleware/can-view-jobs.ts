import { toast } from "vue3-toastify";

export default defineNuxtRouteMiddleware((to, from) => {
  let { isEmployer, isAdmin, isModerated } = useRole()

  if ((isEmployer.value && isModerated.value) || isAdmin.value) {
    return true
  }

  if (process.client) {
    toast.warn("Вы ещё не можете просматривать анкеты")
  }
  return navigateTo("/me");
})