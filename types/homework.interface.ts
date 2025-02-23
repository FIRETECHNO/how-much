export interface Homework {
  _id: string
  name: string
  hwText: string
  materials: any
  course: any
  courseName: string
  lesson: string
  lessonName: string
  lessonImages: { logo: string }
}