import type { JobForm } from "./job-form.interface"

export interface JobReservation {
  _id: string
  jobFormId: JobForm | string
  startDate: string
  employerId: string
}
export interface JobReservationDb {
  _id: string
  jobFormId: JobForm
  startDate: string
  employerId: string
}