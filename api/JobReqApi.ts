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
  }
}