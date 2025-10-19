import type { JobForm } from "./job-form.interface"
import type { CompanyFromDadata } from "./company.interface"

interface Feedback {
  textContent: string | null
  sentDate: string | null
}

export interface JobReservation {
  _id: string
  jobFormId: JobForm | string
  startDate: string
  employerId: string
  employeeId: string
  employerFeedback: Feedback
  employeeFeedback: Feedback
}
export interface JobReservationDb {
  _id: string
  jobFormId: JobForm
  startDate: string
  employerId: string
  employeeId: string
  employerFeedback: Feedback
  employeeFeedback: Feedback
}

interface EmployerForJobReservation {
  _id: string
  email: string
  company: CompanyFromDadata
}
export interface JobReservationDbWithEmployer {
  _id: string
  jobFormId: JobForm
  startDate: string
  employerId: EmployerForJobReservation
  employeeId: string
  employerFeedback: Feedback
  employeeFeedback: Feedback
}