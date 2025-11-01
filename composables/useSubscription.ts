import PaymentApi from "~/api/PaymentApi";
import type { EmployerPaymentOrder } from "~/types/employer-payment-order.interface";

import { toast } from "vue3-toastify"

export const useSubscription = () => {
  let currentSubscription = useState<EmployerPaymentOrder | null>("currentSubscription", () => null)

  const isEmployerSubscriptionActive = ref<boolean>(false)

  async function checkSubscriptionStatus() {
    let { isEmployer } = useRole();

    if (isEmployerSubscriptionActive.value) return true;

    if (isEmployer.value) {
      let { user } = useAuth()
      if (user?._id) {
        const { EMPLOYER_SUBSCRIPTION_DURATION } = useAppConst();
        if (!currentSubscription.value) {

          let res = await PaymentApi.getLastUserPayment(user._id);

          if (!res) {
            return false;
          }

          currentSubscription.value = res;
        }

        let currentTime = new Date().getTime()
        let subStart = new Date(currentSubscription.value.updatedAt).getTime();
        let delta = currentTime - subStart;

        if (delta <= EMPLOYER_SUBSCRIPTION_DURATION && currentSubscription.value.status == "CONFIRMED") {
          isEmployerSubscriptionActive.value = true;
          return true;
        }
      }
    }
    return false;
  }

  async function createEmployerPaymentOrder(amount: number) {
    let { user } = useAuth()
    if (!user?._id || !user.email) {
      return toast.error("Пользователь не авторизован!")
    }

    let res = await PaymentApi.createEmployerPaymentOrder(user._id, amount, user.email)

    if (!res?._id) {
      toast.warn("Не получилось создать ссылку для оплаты")
    } else {
      console.log("createEmployerPaymentOrder---- ");
      console.log(JSON.stringify(res));
      if (res.payment?.PaymentURL && process.client) {
        window.open(res.payment?.PaymentURL, "_blank");
      }
      console.log(res);
      console.log("createEmployerPaymentOrder---- ");
    }
  }

  return {
    // vars
    isEmployerSubscriptionActive,
    // functions
    createEmployerPaymentOrder,
    checkSubscriptionStatus,
  }
}