import PaymentApi from "~/api/PaymentApi";
import type { EmployerPaymentOrder } from "~/types/employer-payment-order.interface";

import { toast } from "vue3-toastify"

export const useSubscription = () => {
  let currentSubscription = useState<EmployerPaymentOrder | null>("currentSubscription", () => null)

  let subscriptionStatus = useState<"none" | "active" | "pending" | "expired">('subscriptionStatus', () => 'none')

  const isEmployerSubscriptionActive = useState<boolean>(() => false)

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

        subscriptionStatus.value = "expired"
        let currentTime = new Date().getTime()
        let subStart = new Date(currentSubscription.value.updatedAt).getTime();
        let delta = currentTime - subStart;

        if (delta <= EMPLOYER_SUBSCRIPTION_DURATION) {
          if (currentSubscription.value.status == "CONFIRMED") {
            subscriptionStatus.value = "active"
            isEmployerSubscriptionActive.value = true;
            return true;
          } else {
            subscriptionStatus.value = "pending"
            isEmployerSubscriptionActive.value = false;
            return false;
          }
        }
      }
    }
    return false;
  }

  async function manuallyCheckSubscriptionStatus() {
    if (currentSubscription.value?._id && currentSubscription.value?.status != "CONFIRMED") {
      let { user } = useAuth()
      if (user?._id) {

        let res = await PaymentApi.getLastUserPayment(user._id);

        if (!res) {
          return false;
        }

        currentSubscription.value = res;
        let isSub = await checkSubscriptionStatus()
        if (!isSub) {
          toast.warn("Подписка ещё не активна")
        }
      }
    }
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
    currentSubscription,
    subscriptionStatus,
    // functions
    createEmployerPaymentOrder,
    checkSubscriptionStatus,
    manuallyCheckSubscriptionStatus
  }
}