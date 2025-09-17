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
  async getOrganizationJobs(): Promise<JobForm[]> {
    const { $apiFetch } = useNuxtApp()
    return $apiFetch<JobForm[]>("/job-form/organization/get-all", {
      method: "POST",
      // body: {
      // }
    })
  }
}