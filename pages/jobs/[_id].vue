<script setup lang="ts">
import type { JobForm } from '~/types/job-form.interface'

const config = useRuntimeConfig()
const route = useRoute()
const jobId = route.params._id as string

const jobsStore = useJobs()

const job = ref<JobForm | null>(null)
const loading = ref(true)
const error = ref(false)

async function fetchJobDetails() {
  try {
    let data = await jobsStore.getById(jobId)

    if (data) {
      job.value = data
    } else {
      error.value = true
    }
  } catch (e) {
    console.error('Ошибка при загрузке вакансии:', e)
    error.value = true
  } finally {
    loading.value = false
  }
}

onMounted(fetchJobDetails)
</script>

<template>
  <v-container>
    <div v-if="loading" class="text-center pa-10">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      <p class="mt-4 text-h6">Загрузка данных об анкете...</p>
    </div>

    <v-sheet v-else-if="error || !job" class="d-flex align-center justify-center flex-wrap text-center mx-auto pa-6"
      elevation="4" rounded="lg" max-width="800" height="400">
      <div>
        <v-icon class="mb-4" color="error" icon="mdi-alert-circle-outline" size="64"></v-icon>
        <div class="text-h5 font-weight-medium">Анкета не найдена</div>
        <p class="text-body-2 mt-2">
          Не удалось загрузить информацию об анкете. Возможно, она была удалена или ссылка неверна.
        </p>
        <v-btn to="/jobs" color="primary" class="mt-6">К списку анкет</v-btn>
      </div>
    </v-sheet>

    <v-row v-else>
      <v-col cols="12" lg="8">
        <v-responsive :aspect-ratio="16 / 9" class="mb-6">
          <video :src="job.video.src" controls
            style="width: 100%; height: 100%; border-radius: 8px; background-color: black;"></video>
        </v-responsive>

        <h1 class="text-h4 font-weight-bold mb-2">{{ job.job }}</h1>
        <v-divider class="my-4"></v-divider>
        <h2 class="text-h6 mb-3">Рекомендации рекрутера:</h2>
        <p class="text-body-1" style="white-space: pre-wrap;">{{ job.coverLetter }}</p>
      </v-col>

      <v-col cols="12" lg="4">
        <v-card variant="outlined">
          <v-card-title>Информация</v-card-title>
          <v-list>
            <v-list-item :title="job.fullName" subtitle="Контактное лицо"
              prepend-icon="mdi-account-tie-outline"></v-list-item>
            <v-list-item title="Активна" subtitle="Статус" prepend-icon="mdi-check-circle-outline"></v-list-item>
          </v-list>
          <v-card-actions class="d-flex flex-column ga-2 pa-4">
            <v-btn color="primary" block size="large" variant="flat">Позвать на собеседование</v-btn>
            <ShareButton :share-url="config.public.siteUrl + '/jobs/' + job._id" />
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>