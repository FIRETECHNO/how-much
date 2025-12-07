import type { JobFormFillRequestDB, JobFormFillRequestDBPopulated } from "~/types/job-form-fill-request.interface"

export default {
  /**
   * 
   * @returns only temporary requests
   */
  async getAllRequests(): Promise<JobFormFillRequestDBPopulated[]> {
    const { $apiFetch } = useNuxtApp()
    return $apiFetch<JobFormFillRequestDBPopulated[]>("/job-form-fill-request/get-all", {
      method: "POST",
    })
  },

  async setManager(jobRequestId: string, employeeTgId: JobFormFillRequestDBPopulated["employee"]['tgId'], manager: string, managerName: string): Promise<JobFormFillRequestDBPopulated[]> {
    const { $apiFetch } = useNuxtApp()
    return $apiFetch<JobFormFillRequestDBPopulated[]>("/job-form-fill-request/set-manager", {
      method: "POST",
      body: {
        jobRequestId,
        employeeTgId,
        manager,
        managerName
      }
    })
  },
  async getJobRequestsByManager(manager: string): Promise<JobFormFillRequestDBPopulated[]> {
    const { $apiFetch } = useNuxtApp()
    return $apiFetch<JobFormFillRequestDBPopulated[]>("/job-form-fill-request/get-by-manager", {
      method: "POST",
      body: {
        manager
      }
    })
  },
  /***
   * @returns те слоты, которые заняты в базе данных (они не обязательно полностью заняты, есть и свободные не полностью, за это отвечает availableManagers)
   */
  async getPossibleTimeSlots(): Promise<{
    startDate: string,
    availableManagers: number
  }[]> {
    const { $apiFetch } = useNuxtApp()
    return $apiFetch<{
      startDate: string,
      availableManagers: number
    }[]>("/job-form-fill-request/possible-time-slots", {
      method: "GET",
    })
  },
  async employeeConfirmFormFillReq(requestId: string): Promise<any> {
    const { $apiFetch } = useNuxtApp()
    return $apiFetch<any[]>("/job-form-fill-request/employee-confirm", {
      method: "POST",
      body: {
        requestId
      }
    })
  }
}