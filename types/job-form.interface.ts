export interface JobForm {
  video: {
    src: string
  }

  job: string
  fullName: string
  coverLetter: string
  phone: string
  telegram: string
  _id: string
}

export interface JobForm_upload {
  video: {
    src: string
  }

  job: string
  fullName: string
  coverLetter: string
  phone: string
  telegram: string

  // for upload
  tmpId: number
  startDate: Date
}