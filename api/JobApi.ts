import type { JobFormFillRequest, JobFormFillRequestDB } from "~/types/job-form-fill-request.interface"
import type { JobForm } from "~/types/job-form.interface"
import type { JobReservation, JobReservationDb, JobReservationDbWithEmployer } from "~/types/job-reservation.interface"
import type { User } from "~/types/user.interface"

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
  async submitJobReservationFeedback(reservationId: string, feedback: string, role: "employee" | "employer"): Promise<JobReservationDbWithEmployer> {
    const { $apiFetch } = useNuxtApp()
    let body = {
      reservationId,
      employerFeedback: role == "employer" ? feedback : null,
      employeeFeedback: role == "employee" ? feedback : null,
    }
    return $apiFetch<JobReservationDbWithEmployer>("/job-form/job-reservation/submit-feedback", {
      method: "POST",
      body
    })
  },
  async getEmployeeReservationById(reservationId: string): Promise<JobReservationDbWithEmployer> {
    const { $apiFetch } = useNuxtApp()
    return $apiFetch<JobReservationDbWithEmployer>("/job-form/job-reservation/get-by-id", {
      method: "POST",
      body: {
        reservationId
      }
    })
  },
  async createJobFormFillRequestShort(employeeId: string, job: string, tgId: User["tgId"]): Promise<JobFormFillRequestDB> {
    const { $apiFetch } = useNuxtApp()
    return $apiFetch<JobFormFillRequestDB>("/job-form-fill-request/create-short", {
      method: "POST",
      body: {
        employeeId,
        job,
        tgId
      }
    })
  },
  async getMyJobFormFillRequests(employeeId: string): Promise<JobFormFillRequestDB[]> {
    const { $apiFetch } = useNuxtApp()
    return $apiFetch<JobFormFillRequestDB[]>("/job-form-fill-request/get-by-employee", {
      method: "POST",
      body: {
        employeeId,
      }
    })
  },
  async createJobFormFillRequest(request: JobFormFillRequest): Promise<JobFormFillRequestDB> {
    const { $apiFetch } = useNuxtApp()
    return $apiFetch<JobFormFillRequestDB>("/job-form-fill-request/create", {
      method: "POST",
      body: {
        request,
      }
    })
  },
  async getJobFormFillRequestById(requestId: string): Promise<JobFormFillRequestDB> {
    const { $apiFetch } = useNuxtApp()
    return $apiFetch<JobFormFillRequestDB>("/job-form-fill-request/get-by-id", {
      method: "POST",
      body: {
        requestId,
      }
    })
  },
  async updateJobFormFillRequest(requestId: string, request: JobFormFillRequest, tgId: User["tgId"]): Promise<JobFormFillRequestDB> {
    const { $apiFetch } = useNuxtApp()
    return $apiFetch<JobFormFillRequestDB>("/job-form-fill-request/update", {
      method: "POST",
      body: {
        requestId, request, tgId
      }
    })
  },
}