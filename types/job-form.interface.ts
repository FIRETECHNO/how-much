export interface JobForm {
  video: {
    src: string
  }

  job: string
  fullName: string
  coverLetter: string
  phone: string
  telegram: string
  email: string
  employeeId: string | null,
  isApproved: boolean
  lastReservationDate: string
  lastRaiseDate: string
  salaryFrom: number | null,
  salaryTo: number | null,
  experience: string,
  workFormat: string,
  _id: string
}

export interface JobForm_upload {
  video: {
    src: string
  }

  job: string
  fullName: string
  coverLetter: string
  email: string
  phone: string
  telegram: string

  employeeId: string | null,
  salaryFrom: number | null,
  salaryTo: number | null,
  experience: string,
  workFormat: string,

  // for upload
  tmpId: number
  startDate: Date
}

export interface JobForm_form {
  job: string,
  fullName: string,
  email: string,
  phone: string,
  telegram: string,
  employeeId: string | null,
  coverLetter: string,
  salaryFrom: number | null,
  salaryTo: number | null,
  experience: string,
  workFormat: string,
}