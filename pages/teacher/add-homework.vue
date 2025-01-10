<script setup lang="ts">
import UploadApi from "../../api/UploadApi"

import { toast } from "vue3-toastify"

const route = useRoute()
const router = useRouter()

const CURRENT_COURSE_ID = String(route.query?.course_id)
const CURRENT_LESSON_ID = String(route.query?.lesson_id)
const CURRENT_LESSON_NAME = String(route.query?.lesson_name)
const CURRENT_COURSE_NAME = String(route.query?.course_name)

const lessonStore = useLesson()

let archives = ref<File[]>([])

let newHomework = ref({
  name: "",
  hwText: "",
})

function uploadedArchives(files: File[]) {
  archives.value = files
}
async function submit() {
  let toSend = {
    ...newHomework.value,
    lessonName: CURRENT_LESSON_NAME,
    courseName: CURRENT_COURSE_NAME,
    course: CURRENT_COURSE_ID,
    lesson: CURRENT_LESSON_ID,
  }

  let res = await lessonStore.addHomework(toSend, CURRENT_LESSON_ID)

  let archiveFD = new FormData()

  const currentOffset = new Date().getTimezoneOffset() * 60 * 1000
  let destination = `material_${CURRENT_LESSON_ID}_${Date.now() + currentOffset}`

  // upload archives
  if (res?.status.value == "success") {
    // there are many archives
    for (let arch of archives.value) {
      archiveFD.append("files", arch)
    }
    // upload archive to server
    res = await UploadApi.lesson.uploadArchive(archiveFD, destination, res.data.value?._id)

    if (res.status.value == "success") {
      toast("Домашнее задание добавлено!", {
        type: "success",
        autoClose: 500,
        onClose: () => {
          router.back()
        },
      })
    }
  } else {
    toast("Ошибка при загрузке архивов! 😭", { type: "error" })
    return
  }
}
</script>
<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <p class="text-4xl font-semibold">Добавить домашнее задание</p>
        <BackButton class="mt-4" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-text-field
          label="Название задания"
          hide-details
          variant="outlined"
          v-model="newHomework.name"
        ></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-textarea label="Текст задания" variant="outlined" hide-details v-model="newHomework.hwText"></v-textarea>
      </v-col>
      <v-col cols="4">
        <UploadMaterialArchive @uploaded="uploadedArchives" />
      </v-col>
      <v-col cols="12" class="d-flex justify-center">
        <v-btn size="large" class="mt-6" @click="submit">отправить</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
