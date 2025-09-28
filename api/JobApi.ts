import type { JobForm } from "~/types/job-form.interface"
import type { JobReservation } from "~/types/job-reservation.interface"

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
  },
  async getAll(): Promise<JobForm[]> {
    const { $apiFetch } = useNuxtApp()
    return $apiFetch<JobForm[]>("/job-form/get-all", {
      method: "POST",
    })
  },
  async reserveJob(jobFormId: string, startDate: string, employerId: string): Promise<JobReservation> {
    const { $apiFetch } = useNuxtApp()
    return $apiFetch<JobReservation>("/job-form/reserve", {
      method: "POST",
      body: {
        jobFormId,
        startDate,
        employerId
      }
    })
  },
  async getReservedJob(employerId: string): Promise<JobReservation | null> {
    const { $apiFetch } = useNuxtApp()
    return $apiFetch<JobReservation | null>("/job-form/get-reserved", {
      method: "POST",
      body: {
        employerId
      }
    })
  }
}