<script setup lang="ts">
const route = useRoute()

// РЕКОМЕНДАЦИЯ: Использовать примитивные типы (string, number, boolean)
const uploadStatus = ref<string>("")
const uploadProgress = ref<number | null>(null)
const loading = ref<boolean>(false)

const chunkSize = 1024 * 1024 * 5 // 5 MB

const emit = defineEmits(["upload-finished", "start-upload"])

// --- ГЛАВНАЯ ФУНКЦИЯ (переработана) ---
const handleFileUpload = async (event: Event) => {
  // РЕКОМЕНДАЦИЯ: Правильная типизация события
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  // РЕКОМЕНДАЦИЯ: Проверять ID урока в самом начале
  const lessonId = route.query.lesson_id
  if (!lessonId || Array.isArray(lessonId)) {
    uploadStatus.value = "Ошибка: не найден или некорректен ID урока."
    return
  }

  emit('start-upload')
  loading.value = true

  // РЕКОМЕНДАЦИЯ: Использовать try/finally для управления `loading`
  try {
    // Шаг 1: Загрузка файла чанками. Функция теперь возвращает имя файла.
    uploadStatus.value = "Загрузка видео..."
    const uploadedFileName = await uploadFileInChunks(file, lessonId)
    if (!uploadedFileName) {
      // Если функция вернула null/undefined, значит была ошибка, прерываемся.
      // Сообщение об ошибке уже установлено внутри uploadFileInChunks.
      return
    }

    // Шаг 2: Конвертация видео. Передаем имя файла как аргумент.
    uploadStatus.value = "Конвертация! Пожалуйста, подождите..."
    const isConverted = await convertVideo(uploadedFileName, lessonId)
    if (!isConverted) return // Прерываемся в случае ошибки конвертации

    // Шаг 3: Загрузка в облако
    uploadStatus.value = "Загрузка в облако..."
    const isUploadedToCloud = await uploadToYandexCloud(lessonId)
    if (!isUploadedToCloud) return // Прерываемся в случае ошибки

    uploadStatus.value = "Загрузка завершена, можете продолжать работу"
    emit("upload-finished", `lesson-videos/${lessonId}/playlist.m3u8`)

  } catch (error) {
    console.error("An error occurred in the main upload process:", error)
    uploadStatus.value = "Произошла критическая ошибка. Обратитесь к разработчику."
  } finally {
    // Этот блок выполнится всегда, гарантируя снятие состояния загрузки
    loading.value = false
    uploadProgress.value = null // Сбрасываем прогресс-бар
  }
}

// --- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ (переработаны) ---

// Теперь возвращает имя файла в случае успеха или null в случае ошибки
const uploadFileInChunks = async (file: File, lessonId: string): Promise<string | null> => {
  const totalChunks = Math.ceil(file.size / chunkSize)
  const fileName = `${lessonId}_${file.name}`

  for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
    const start = chunkIndex * chunkSize
    const end = Math.min(start + chunkSize, file.size)
    const chunk = file.slice(start, end)

    const formData = new FormData()
    formData.append("file", chunk, fileName)
    formData.append("chunkIndex", String(chunkIndex))
    formData.append("totalChunks", String(totalChunks))
    formData.append("fileName", fileName)
    formData.append("lessonId", lessonId)

    try {
      await $fetch("/api/upload-chunk", {
        method: "POST",
        body: formData,
      })
      uploadProgress.value = Math.round(((chunkIndex + 1) / totalChunks) * 100)
    } catch (error) {
      console.error("Error uploading chunk:", error)
      uploadStatus.value = "Возникла ошибка при загрузке чанка! Нажмите F12 и отправьте её разработчику"
      return null // Возвращаем null при ошибке
    }
  }

  uploadStatus.value = "Видео загружено!"
  return fileName // Возвращаем имя файла при успехе
}

// Теперь возвращает boolean (успех/неудача)
const convertVideo = async (mp4FileName: string, lessonId: string): Promise<boolean> => {
  try {
    // РЕКОМЕНДАЦИЯ: Использовать $fetch для консистентности
    await $fetch("/api/convert", {
      method: "POST",
      body: { mp4FileName, lessonId }, // $fetch автоматически преобразует объект в JSON
    })
    uploadStatus.value = "Конвертация завершена!"
    return true
  } catch (error) {
    console.error("Error converting video:", error)
    uploadStatus.value = "Ошибка на этапе конвертации видео."
    return false
  }
}

// Теперь возвращает boolean (успех/неудача)
const uploadToYandexCloud = async (lessonId: string): Promise<boolean> => {
  try {
    await $fetch("/api/hls-to-yandex-cloud", {
      method: "POST",
      body: { lessonId },
    })
    return true
  } catch (error) {
    console.error("Error uploading to Yandex Cloud:", error)
    uploadStatus.value = "Ошибка при загрузке в облачное хранилище."
    return false
  }
}
</script>

<template>
  <div>
    <input type="file" accept="video/*" @change="handleFileUpload" :disabled="loading" />
    <div v-if="uploadProgress !== null">
      <p>Прогресс загрузки: {{ uploadProgress }}%</p>
    </div>
    <div v-if="uploadStatus">{{ uploadStatus }}</div>
    <v-progress-circular indeterminate :size="40" v-if="loading"></v-progress-circular>
  </div>
</template>