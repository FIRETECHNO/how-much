<script setup lang="ts">
import { toast } from 'vue3-toastify';
import type { VForm } from 'vuetify/components'
import { debounce } from 'lodash';
import AdminApi from '~/api/AdminApi';

const jobsStore = useJobUploads();

const { uploads } = jobsStore;

const dialog = ref(false)
const loading = ref(false)
const form = ref<VForm | null>(null)
const isCheckingEmail = ref(false);

const formData = ref<{
  job: string,
  fullName: string,
  email: string,
  phone: string,
  telegram: string,
  employeeId: string | null,
  coverLetter: string
}>({
  job: '',
  fullName: '',
  email: '',
  phone: '',
  telegram: '',
  employeeId: null,
  coverLetter: '',
})

const jobItems = [
  'Продажи',
  'Маркетинг',
  'Ассистент',
]

const jobRules = [
  (value: string) => !!value || 'Необходимо выбрать вакансию.',
]
const fullNameRules = [
  (value: string) => !!value || 'ФИО обязательно для заполнения.',
]
const emailRules = [
  (value: string) => !!value || 'Email обязателен.',
  (value: string) => /.+@.+\..+/.test(value) || 'Некорректный формат email.',
]
const phoneRules = [
  (value: string) => !!value || 'Номер телефона обязателен.',
  (value: string) => value?.length > 5 || 'Слишком короткий номер телефона.',
]
const telegramRules = [
  (value: string) => !/\s/.test(value) || 'Ник не должен содержать пробелы.',
]
const coverLetterRules = [
  (value: string) => (value?.length || 0) <= 1000 || 'Рекомендации рекрутера не должны превышать 1000 символов.',
]

watch(() => formData.value.email, debounce(async (newEmail) => {
  if (/.+@.+\..+/.test(newEmail)) {
    isCheckingEmail.value = true;
    formData.value.fullName = "";

    const foundUser = await AdminApi.findEmployee(newEmail);

    if (foundUser) {
      formData.value.fullName = foundUser.name;
      formData.value.employeeId = foundUser._id;
      toast.success(`Найден пользователь: ${foundUser.name}`);
    } else {
      toast.warn("Соискатель не найден")
    }

    isCheckingEmail.value = false;
  }
}, 800));

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
      form.value?.resetValidation()
    }, 200);
  }
}

async function handleVideoUploadFinished(location: string, tmpId: number) {
  jobsStore.setVideoForUpload(location, tmpId)
  let boolRes = await jobsStore.saveJob(tmpId);
  if (boolRes) {
    toast.success("Анкета добавлена!");
  } else {
    toast.error("Ошибка при добавлении анкеты!");
  }
}
</script>
<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-btn prepend-icon="mdi-plus" variant="tonal" @click="dialog = true">начать новую загрузку</v-btn>
      </v-col>

      <v-col v-if="uploads.length > 0" cols="12" md="6" lg="4" v-for="upload in uploads" :key="upload.tmpId">
        <v-card>
          <v-card-title>{{ upload.job }}</v-card-title>
          <v-card-subtitle>{{ upload.fullName }} ({{ upload.email }})</v-card-subtitle>
          <v-list density="compact">
            <v-list-item :title="upload.phone" subtitle="Телефон" prepend-icon="mdi-phone-outline"></v-list-item>
            <v-list-item :title="`@${upload.telegram}`" subtitle="Telegram" prepend-icon="mdi-telegram"></v-list-item>
          </v-list>
          <v-card-text v-if="upload.coverLetter">
            <strong>Рекомендации рекрутера:</strong>
            <p class="my-2">{{ upload.coverLetter }}</p>
            <div v-if="upload.video?.src">
              <strong>Визитка:&nbsp;</strong>
              <NuxtLink target="_blank" :to="upload.video?.src" class="text-primary">{{ upload.video?.src }}</NuxtLink>
            </div>
          </v-card-text>
          <v-card-text>
            <VideoUpload @upload-finished="handleVideoUploadFinished($event, upload.tmpId)" />
          </v-card-text>
        </v-card>
      </v-col>

      <v-col v-else cols="12">
        <v-card-text>Пока нет ни одной загрузки.</v-card-text>
      </v-col>
    </v-row>
  </v-container>

  <v-dialog v-model="dialog" max-width="600px" persistent>
    <v-card>
      <v-card-title>
        <span class="text-h5">Создание анкеты кандидата</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-select v-model="formData.job" variant="outlined" :items="jobItems" :rules="jobRules"
                  label="Направление" required></v-select>
              </v-col>

              <v-col cols="12">
                <v-text-field v-model="formData.email" variant="outlined" :rules="emailRules" label="Email кандидата"
                  prepend-inner-icon="mdi-email-outline" :loading="isCheckingEmail" required></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field v-model="formData.fullName" variant="outlined" :rules="fullNameRules" label="ФИО"
                  required></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field v-model="formData.phone" variant="outlined" :rules="phoneRules" label="Номер телефона"
                  prepend-inner-icon="mdi-phone-outline" required></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="formData.telegram" variant="outlined" :rules="telegramRules"
                  label="Ник в Telegram" prepend-inner-icon="mdi-telegram" prefix="@"></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-textarea v-model="formData.coverLetter" variant="outlined" :rules="coverLetterRules"
                  label="Рекомендации рекрутера" counter="1000"></v-textarea>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey" variant="text" @click="dialog = false">
          Закрыть
        </v-btn>
        <v-btn color="primary" variant="text" @click="startUpload" :loading="loading">
          Добавить
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>