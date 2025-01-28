<script setup lang="ts">
definePageMeta({
  middleware: ["admin"],
})
import { toast } from "vue3-toastify"

const lessonStore = useLesson()
const route = useRoute()
const router = useRouter()

let videoUploadedPath = ref<string | null>()
let loading = ref<boolean>(false)

async function uploadFinished(uploadPath: string) {
  videoUploadedPath.value = "https://factum-videos.website.yandexcloud.net/" + uploadPath
  loading.value = false
  if (route.query.lesson_id) {
    let res = await lessonStore.addVideo(videoUploadedPath.value, String(route.query.lesson_id))
    if (res?.status?.value == 'success') {
      toast('Видео загружено!', {
        type: "success",
        autoClose: 500,
        onClose: () => {
          router.push('/')
        }
      })
    } else {
      toast('Ошибка при загрузке видео!', {
        type: "error",
        autoClose: 2000,
        onClose: () => {
          window?.location?.reload();
        }
      })
    }
  }
}
function startUpload() {
  loading.value = true
}
</script>
<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="mb-4">
        <p class="text-4xl font-semibold">Загрузить видео</p>
        <BackButton :disabled="loading" :button-text="'Не нужно загружать'" :to-route="'/'" class="mt-4"></BackButton>
      </v-col>

      <v-col cols="12">
        <UploadVideo @upload-finished="uploadFinished" @start-upload="startUpload" />
      </v-col>
    </v-row>
  </v-container>
</template>
