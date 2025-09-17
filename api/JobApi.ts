import type { JobForm } from "~/types/job-form.interface"

export default {
  async saveJob(jobForm: any): Promise<JobForm> {
    const { $apiFetch } = useNuxtApp()
    return $apiFetch<JobForm>("/job-form/create", {
      method: "POST",
      body: {
        jobForm
      }
    })
  },
  async getJobs(): Promise<JobForm[]> {
    const { $apiFetch } = useNuxtApp()
    return $apiFetch<JobForm[]>("/job-form/admin/get-all", {
      method: "POST",
      // body: {
      // }
    })
  },
  async getById(jobId: string): Promise<JobForm | null> {
    const { $apiFetch } = useNuxtApp()
    return $apiFetch<JobForm | null>("/job-form/get-by-id", {
      method: "POST",
      body: {
        jobId
      }
    })
  }
}