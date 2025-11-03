<script setup lang="ts">
import type { JobForm } from '~/types/job-form.interface';

const config = useRuntimeConfig();

defineProps<{
  jobForms: JobForm[]
}>()
</script>

<template>
  <div>
    <v-row v-if="jobForms?.length > 0">
      <v-col v-for="job in jobForms" :key="job._id" cols="12" sm="6" md="4" xl="3">
        <v-card class="d-flex flex-column" height="100%">
          <v-responsive v-if="job.video && job.video.src" :aspect-ratio="16 / 9">
            <video :src="job.video.src" style="width: 100%; height: 100%; object-fit: cover;" controls></video>
          </v-responsive>

          <v-divider></v-divider>
          <div class="d-flex flex-column flex-grow-1 pa-4">
            <div class="d-flex justify-space-between align-start">
              <div>
                <h3 class="text-h5 font-weight-bold">{{ job.job }}</h3>
                <p class="text-body-1 text-medium-emphasis">{{ job.fullName }}</p>
              </div>
              <v-chip :color="job.isApproved ? 'success' : 'warning'"
                :prepend-icon="job.isApproved ? 'mdi-check-circle' : 'mdi-clock-outline'" variant="flat" size="small"
                class="mt-1">
                {{ job.isApproved ? 'Одобрена' : 'На модерации' }}
              </v-chip>
            </div>

            <v-divider class="my-3"></v-divider>

            <v-list density="compact">
              <v-list-item v-if="job.email" :title="job.email" subtitle="Email" prepend-icon="mdi-email-outline"
                class="px-0"></v-list-item>
              <v-list-item v-if="job.phone" :title="job.phone" subtitle="Телефон" prepend-icon="mdi-phone-outline"
                class="px-0"></v-list-item>
              <v-list-item v-if="job.telegram" :title="`@${job.telegram}`" subtitle="Telegram"
                prepend-icon="mdi-telegram" class="px-0"></v-list-item>
            </v-list>

            <div class="text-body-2 flex-grow-1 mt-4">
              <p class="font-weight-medium mb-1">Рекомендации рекрутера:</p>
              <p style="white-space: pre-wrap;">{{ job.coverLetter || "-" }}</p>
            </div>

            <v-card-actions class="mt-4 pa-0">
              <ShareButton :share-url="`${config.public.siteUrl}/jobs/${job._id}`" />

              <!-- <v-btn variant="text" prepend-icon="mdi-pencil-outline">
                Редактировать
              </v-btn> -->
              <v-spacer></v-spacer>
              <v-btn :to="`/jobs/${job._id}`" color="primary" variant="flat" append-icon="mdi-arrow-right">
                Посмотреть
              </v-btn>
            </v-card-actions>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-else class="d-flex justify-center align-center">
      <v-col cols="auto">
        <NuxtLink to="/admin/jobs/upload" class="text-decoration-none">
          <v-sheet class="d-flex align-center justify-center flex-wrap text-center mx-auto pa-6" elevation="4"
            rounded="lg" max-width="800" height="300">
            <div>
              <v-icon class="mb-4" color="grey-lighten-1" icon="mdi-briefcase-search-outline" size="64"></v-icon>
              <div class="text-h4 font-weight-medium">Анкеты не найдены</div>
              <p class="text-body-2 mt-2">
                Вы еще не создали ни одной анкеты. <b>Нажмите, чтобы добавить первую.</b>
              </p>
            </div>
          </v-sheet>
        </NuxtLink>
      </v-col>
    </v-row>
  </div>
</template>