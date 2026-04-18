<script setup lang="ts">
definePageMeta({
  middleware: ["can-view-jobs"]
})

import type { JobForm } from '~/types/job-form.interface'

const config = useRuntimeConfig()
const route = useRoute()
const jobId = route.params._id as string

const jobsStore = useEmployerJobs()
const rolesStore = useRole();
const { jobColors } = useAppConst()

let { isEmployer, isAdmin } = rolesStore;
let { currentReservation } = jobsStore

const job = ref<JobForm | null>(null)
const loading = ref(true)
const error = ref(false)

const showReserveJobButton = computed<boolean>(() => {
  if (!currentReservation.value?._id && (isEmployer.value || isAdmin.value)) return true;

  return false;
})

const showRemainingReserveTime = computed<boolean>(() => {
  if (currentReservation.value?.jobFormId == job.value?._id)
    return true;
  return false;
})

const formattedSalary = computed(() => {
  if (!job.value) return null;

  const { salaryFrom, salaryTo } = job.value;

  if (salaryFrom && salaryTo) {
    return `от ${salaryFrom.toLocaleString('ru-RU')} до ${salaryTo.toLocaleString('ru-RU')} ₽`;
  }
  if (salaryFrom) {
    return `от ${salaryFrom.toLocaleString('ru-RU')} ₽`;
  }
  if (salaryTo) {
    return `до ${salaryTo.toLocaleString('ru-RU')} ₽`;
  }
  return null; // Не отображаем, если зарплата не указана
});

async function fetchJobDetails() {
  try {
    let data = await jobsStore.getById(jobId)

    if (data) {
      job.value = data
    } else {
      error.value = true
    }
  } catch (e) {
    console.error('Ошибка при загрузке вакансии: ', e)
    error.value = true
  } finally {
    loading.value = false
  }
}

async function reserveJob() {
  if (!job.value?._id || !job.value.employeeId)
    return;
  let res = await jobsStore.reserveJob(job.value._id, job.value.employeeId)
}

function getJobColor(jobType: string | null) {
  if (!jobType) return undefined
  const colorKey = jobColors[jobType] || ''
  if (colorKey === 'primary') return '#1e8d99'
  if (colorKey === 'secondary') return '#894eff'
  return colorKey || undefined
}

const jobAccentColor = computed(() => getJobColor(job.value?.job ?? null) ?? 'primary')

await jobsStore.getReservedJob()
await fetchJobDetails()
</script>
<template>
  <div class="job-detail-page">
    <v-container class="py-6 py-md-8">
      <v-row>
        <v-col cols="12">
          <BackButton />
        </v-col>
      </v-row>

      <div v-if="loading" class="job-detail-loading text-center pa-10 pa-md-14 rounded-xl">
        <v-progress-circular indeterminate :color="jobAccentColor" size="64" width="4" />
        <p class="mt-6 text-h6 font-weight-medium">Загрузка анкеты…</p>
        <p class="mt-2 text-body-2 text-medium-emphasis">Подождите несколько секунд</p>
      </div>

      <v-sheet
        v-else-if="error || !job"
        class="job-detail-error d-flex align-center justify-center text-center mx-auto pa-8 pa-md-12"
        max-width="640"
        rounded="xl"
        border
      >
        <div>
          <div class="job-detail-error__icon mx-auto mb-6">
            <v-icon color="error" icon="mdi-file-document-remove-outline" size="48" />
          </div>
          <div class="text-h5 font-weight-bold">Анкета не найдена</div>
          <p class="text-body-2 text-medium-emphasis mt-3 mb-0">
            Не удалось загрузить данные. Возможно, анкета удалена или ссылка устарела.
          </p>
          <v-btn to="/jobs" color="primary" rounded="lg" size="large" class="mt-8" prepend-icon="mdi-arrow-left">
            К списку анкет
          </v-btn>
        </div>
      </v-sheet>

      <v-row v-else class="mt-2">
        <v-col cols="12" lg="8">
          <div class="job-detail-video-wrap mb-6 mb-lg-8">
            <v-responsive :aspect-ratio="16 / 9">
              <video
                :src="job.video.src"
                class="job-detail-video"
                controls
              />
            </v-responsive>
          </div>

          <div
            v-if="getJobColor(job.job)"
            class="job-detail-accent-bar mb-4"
            :style="{ background: getJobColor(job.job) }"
          />
          <div v-else class="job-detail-accent-bar job-detail-accent-bar--default mb-4" />

          <h1 class="text-h4 text-sm-h3 font-weight-bold mb-2">{{ job.job }}</h1>
          <p class="text-body-1 text-medium-emphasis mb-4">{{ job.fullName }}</p>

          <div class="d-flex flex-wrap align-center ga-3 my-4">
            <v-chip v-if="formattedSalary" color="success" variant="tonal" size="large" prepend-icon="mdi-cash">
              {{ formattedSalary }}
            </v-chip>
            <v-chip
              v-if="job.experience"
              color="info"
              variant="tonal"
              size="large"
              prepend-icon="mdi-briefcase-clock-outline"
            >
              Опыт: {{ job.experience }}
            </v-chip>
            <v-chip v-if="job.workFormat" color="deep-purple" variant="tonal" size="large" prepend-icon="mdi-laptop">
              Формат: {{ job.workFormat }}
            </v-chip>
          </div>
          <v-divider class="my-6" />
          <h2 class="text-subtitle-1 font-weight-bold mb-3" v-if="job.coverLetter?.length > 0">
            Рекомендации рекрутера
          </h2>
          <p class="text-body-1 job-detail-cover" v-if="job.coverLetter?.length > 0">{{ job.coverLetter }}</p>
        </v-col>

        <v-col cols="12" lg="4">
          <v-card class="job-detail-sidebar" rounded="xl" elevation="3">
            <div
              class="job-detail-sidebar__stripe"
              :style="{ background: getJobColor(job.job) ? getJobColor(job.job) : undefined }"
              :class="{ 'job-detail-sidebar__stripe--default': !getJobColor(job.job) }"
            />
            <v-card-title class="pt-5 pb-2 text-h6 font-weight-bold">
              Кандидат
            </v-card-title>
          <v-list v-if="currentReservation?.jobFormId == job._id">
            <v-list-item :title="job.fullName" subtitle="ФИО" prepend-icon="mdi-account-outline"></v-list-item>

            <v-list-item :title="job.email || 'не указан'" subtitle="Email"
              prepend-icon="mdi-email-outline"></v-list-item>

            <v-list-item :href="`tel:${job.phone}`" :title="job.phone || 'не указан'" subtitle="Телефон"
              prepend-icon="mdi-phone-outline">
              <template v-slot:append>
                <v-icon icon="mdi-open-in-new" size="small"></v-icon>
              </template>
            </v-list-item>

            <v-list-item :href="`https://t.me/${job.telegram}`" target="_blank" :title="`@${job.telegram}`"
              subtitle="Telegram" prepend-icon="mdi-telegram">
              <template v-slot:append>
                <v-icon icon="mdi-open-in-new" size="small"></v-icon>
              </template>
            </v-list-item>
          </v-list>

          <v-card-actions class="d-flex flex-column ga-3 pa-4 pt-2">
            <v-btn
              v-if="showReserveJobButton"
              color="primary"
              block
              size="large"
              rounded="lg"
              variant="flat"
              prepend-icon="mdi-calendar-check"
              @click="reserveJob"
            >
              Позвать на собеседование
            </v-btn>
            <v-btn
              v-if="showRemainingReserveTime"
              block
              size="large"
              rounded="lg"
              variant="tonal"
              color="primary"
            >
              <ClientOnly>
                <CountdownTimer :start-date="currentReservation?.startDate">
                  <template #default="{ hours, minutes, seconds }">
                    <span>Осталось {{ hours }}:{{ minutes }}:{{ seconds }}</span>
                  </template>
                </CountdownTimer>
              </ClientOnly>
            </v-btn>

            <ShareButton :share-url="`${config.public.siteUrl}/jobs/${job._id}`"
              :share-title="`Анкета кандидата: ${job.fullName}`" />
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    </v-container>
  </div>
</template>

<style scoped lang="scss">
.job-detail-page {
  min-height: 100%;
}

.job-detail-loading {
  background: rgba(var(--v-theme-primary), 0.06);
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

.job-detail-error {
  min-height: 320px;
  background: rgb(var(--v-theme-surface));

  &__icon {
    width: 88px;
    height: 88px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(var(--v-theme-error), 0.12);
  }
}

.job-detail-video-wrap {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

.job-detail-video {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  background: #000;
}

.job-detail-accent-bar {
  height: 4px;
  width: 100%;
  max-width: 120px;
  border-radius: 4px;

  &--default {
    background: linear-gradient(
      90deg,
      rgb(var(--v-theme-primary)),
      rgba(var(--v-theme-primary), 0.45)
    );
  }
}

.job-detail-cover {
  white-space: pre-wrap;
  line-height: 1.6;
}

.job-detail-sidebar {
  position: sticky;
  top: 88px;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
  overflow: hidden;

  &__stripe {
    height: 4px;
    width: 100%;

    &--default {
      background: linear-gradient(
        90deg,
        rgb(var(--v-theme-primary)),
        rgba(var(--v-theme-primary), 0.5)
      );
    }
  }
}

@media (max-width: 1279px) {
  .job-detail-sidebar {
    position: static;
  }
}
</style>