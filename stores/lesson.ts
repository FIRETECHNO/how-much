import { defineStore } from "pinia"
import LessonApi from '../api/LessonApi'
import type { Lesson } from "~/types/lesson.interface"

export const useLesson = defineStore('lesson', () => {

  async function updateLesson(lesson: Lesson, newHomeworks: any) {
    console.log(lesson)
    return await LessonApi.updateLesson(lesson, newHomeworks)
  }

  async function addTelemostLink(lesson_id: string, link: string) {
    return await LessonApi.addTelemostLink(lesson_id,link)
  }

  async function uploadVideo(videoFormData: FormData, lessonId: string) {
    return await LessonApi.uploadVideo(videoFormData, lessonId)
  }
  async function newSolution(solution: any) {
    return await LessonApi.newSolution(solution)
  }
  async function uploadImages(formData: FormData, lessonId: string) {
    return await LessonApi.uploadImages(formData, lessonId)
  }

  async function addHomework(newHomework: any,  lessonId: string) {
    return await LessonApi.addHomework(newHomework, lessonId);
  }

  async function addVideo(videoUrl: string, lessonId: string) {
    return await LessonApi.addVideo(videoUrl, lessonId);
  }

  return {
    // functions
    addTelemostLink, updateLesson, uploadVideo, newSolution, uploadImages, addHomework, addVideo,
    // variables
  }
})