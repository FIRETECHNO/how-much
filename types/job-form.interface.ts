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

  // for upload
  tmpId: number
  startDate: Date
}