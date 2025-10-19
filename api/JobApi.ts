import type { JobForm } from "~/types/job-form.interface"
import type { JobReservation, JobReservationDb, JobReservationDbWithEmployer } from "~/types/job-reservation.interface"

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
  async getAll(
    selectedJob: string | null,
    selectedExperience: string | null,
    selectedWorkFormat: string | null,
    salaryFrom: number | null,
    salaryTo: number | null
  ): Promise<JobForm[]> {
    const { $apiFetch } = useNuxtApp()

    return $apiFetch<JobForm[]>("/job-form/get-all", {
      method: "POST",
      body: {
        selectedJob,
        selectedExperience,
        selectedWorkFormat,
        salaryFrom,
        salaryTo
      }
    })
  },
  async reserveJob(jobFormId: string, startDate: string, employerId: string, employeeId: string): Promise<JobReservation> {
    const { $apiFetch } = useNuxtApp()
    return $apiFetch<JobReservation>("/job-form/reserve", {
      method: "POST",
      body: {
        jobFormId,
        startDate,
        employerId,
        employeeId
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
  },
  async getMyJobForms(employeeId: string): Promise<JobForm[]> {
    const { $apiFetch } = useNuxtApp()
    return $apiFetch<JobForm[]>("/job-form/get-by-employee-id", {
      method: "POST",
      body: {
        employeeId
      }
    })
  },
  async approveJobForm(jobFormId: string): Promise<JobForm> {
    const { $apiFetch } = useNuxtApp()
    return $apiFetch<JobForm>("/job-form/approve", {
      method: "POST",
      body: {
        jobFormId
      }
    })
  },
  async disapproveJobForm(jobFormId: string): Promise<JobForm> {
    const { $apiFetch } = useNuxtApp()
    return $apiFetch<JobForm>("/job-form/disapprove", {
      method: "POST",
      body: {
        jobFormId
      }
    })
  },
  async boostJobForm(jobFormId: string, raiseDate: string): Promise<JobForm> {
    const { $apiFetch } = useNuxtApp()
    return $apiFetch<JobForm>("/job-form/boost", {
      method: "POST",
      body: {
        jobFormId, raiseDate
      }
    })
  },
  async getEmployerJobFormsHistory(employerId: string): Promise<JobReservationDb[]> {
    const { $apiFetch } = useNuxtApp()
    return $apiFetch<JobReservationDb[]>("/job-form/job-reservation/by-employer", {
      method: "POST",
      body: {
        employerId
      }
    })
  },
  async getReservations(employeeId: string): Promise<JobReservationDbWithEmployer[]> {
    const { $apiFetch } = useNuxtApp()
    return $apiFetch<JobReservationDbWithEmployer[]>("/job-form/job-reservation/by-employee", {
      method: "POST",
      body: {
        employeeId
      }
    })
  },
  async submitJobReservationFeedback(reservationId: string, feedback: string, role: "employee" | "employer"): Promise<JobReservation> {
    const { $apiFetch } = useNuxtApp()
    let body = {
      reservationId,
      employerFeedback: role == "employer" ? feedback : null,
      employeeFeedback: role == "employee" ? feedback : null,
    }
    return $apiFetch<JobReservation>("/job-form/job-reservation/submit-feedback", {
      method: "POST",
      body
    })
  }
}