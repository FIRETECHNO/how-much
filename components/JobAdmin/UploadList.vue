<script setup lang="ts">
import { toast } from 'vue3-toastify';
import type { VForm } from 'vuetify/components'

const jobsStore = useJobUploads();

let { uploads } = jobsStore;

const dialog = ref(false)
const loading = ref(false)
const form = ref<VForm | null>(null)

const formData = ref({
  job: '',
  fullName: '',
  coverLetter: ''
})

const jobItems = [
  'Продажи',
  'Маркетинг',
  'Ассистирование',
]

const jobRules = [
  (value: string) => !!value || 'Необходимо выбрать вакансию.',
]

const fullNameRules = [
  (value: string) => !!value || 'ФИО обязательно для заполнения.',
]

const coverLetterRules = [
  (value: string) => value?.length <= 1000 || 'Сопроводительное письмо не должно превышать 1000 символов.',
]

async function startUpload() {
  if (!form.value) return

  const { valid } = await form.value.validate()

  if (valid) {
    loading.value = true
    jobsStore.startUploading(formData.value)

    setTimeout(() => {
      dialog.value = false
      loading.value = false
      form.value?.reset()
    }, 200);
  }
}

async function handleVideoUploadFinished(location: string, tmpId: number) {
  jobsStore.setVideoForUpload(location, tmpId)
  let boolRes = await jobsStore.saveJob(tmpId);

  if (boolRes) {
    toast("Анкета добавлена!", {
      type: "success",
    })
  } else {
    toast("Ошибка при добавлении анкеты!", {
      type: "error"
    })
  }
}
</script>

<template>
  <v-col cols="12">
    <v-btn prepend-icon="mdi-plus" variant="tonal" @click="dialog = true">начать новую загрузку</v-btn>
  </v-col>

  <v-col v-if="uploads.length > 0" cols="12" md="6" lg="4" v-for="(upload, index) of uploads" :key="upload.tmpId">
    <v-card>
      <v-card-title>{{ upload.job }}</v-card-title>
      <v-card-subtitle>{{ upload.fullName }}</v-card-subtitle>
      <v-card-text v-if="upload.coverLetter">
        <strong>Сопроводительное письмо:</strong>
        <p class="my-2">{{ upload.coverLetter }}</p>

        <div v-if="upload.video?.src">
          <strong>Визитка:&nbsp;</strong>

          <NuxtLink target="_blank" :to="upload.video?.src">{{ upload.video?.src }}</NuxtLink>
        </div>
      </v-card-text>

      <v-card-text>
        <VideoUpload @upload-finished="handleVideoUploadFinished($event, upload.tmpId)" />
      </v-card-text>
    </v-card>
  </v-col>

  <v-col v-else>
    <v-card-text>Пока нет ни одной загрузки.</v-card-text>
  </v-col>

  <v-dialog v-model="dialog" max-width="600px">
    <v-card>
      <v-card-title>
        <span class="text-h5">Описание вакансии</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-select v-model="formData.job" variant="outlined" :items="jobItems" :rules="jobRules"
                  label="Наименование анкеты" required></v-select>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="formData.fullName" variant="outlined" :rules="fullNameRules" label="ФИО"
                  required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea v-model="formData.coverLetter" variant="outlined" :rules="coverLetterRules"
                  label="Сопроводительное письмо" counter="1000"></v-textarea>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue-darken-1" variant="text" @click="dialog = false">
          Закрыть
        </v-btn>
        <v-btn color="blue-darken-1" variant="text" @click="startUpload" :loading="loading">
          Добавить
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>