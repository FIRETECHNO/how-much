import type { EmployerPaymentOrder } from "~/types/employer-payment-order.interface"

export default {
  async createEmployerPaymentOrder(employerId: string, amount: number): Promise<EmployerPaymentOrder | null> {
    const { $apiFetch } = useNuxtApp()
    return $apiFetch<EmployerPaymentOrder | null>("/t-payments/create-employer-order", {
      method: "POST",
      body: {
        employerId, amount
      }
    })
  },
}