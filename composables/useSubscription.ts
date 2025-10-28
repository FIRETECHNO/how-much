import PaymentApi from "~/api/PaymentApi";

import { toast } from "vue3-toastify"

export const useSubscription = () => {
  const isEmployerSubscriptionActive = computed(() => {
    let { isEmployer } = useRole();

    if (isEmployer.value) {
      return false;
    }
    return false;
  })

  async function createEmployerPaymentOrder(amount: number) {
    let { user } = useAuth()
    if (!user?._id) {
      return toast.error("Пользователь не авторизован!")
    }

    let res = await PaymentApi.createEmployerPaymentOrder(user._id, amount)

    if (!res?._id) {
      toast.warn("Не получилось создать ссылку для оплаты")
    } else {
      console.log("createEmployerPaymentOrder---- ");
      console.log(JSON.stringify(res));
      console.log(res);
      console.log("createEmployerPaymentOrder---- ");
    }
  }

  return {
    // vars
    isEmployerSubscriptionActive,
    // functions
    createEmployerPaymentOrder,
  }
}