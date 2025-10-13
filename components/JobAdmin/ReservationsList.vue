<script setup lang="ts">
import { computed } from 'vue';
import type { JobReservationDbWithEmployer } from '~/types/job-reservation.interface';

const props = defineProps<{
  reservations: JobReservationDbWithEmployer[]
}>()

const reservationsList = computed(() => props.reservations)

function formatDate(dateString: string | undefined): string {
  if (!dateString) return 'Дата не указана';
  return new Date(dateString).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: "numeric",
    minute: "numeric",
  });
}
</script>

<template>
  <v-container>
    <v-row v-if="reservationsList.length > 0">
      <v-col v-for="item in reservationsList" :key="item._id" cols="12">
        <v-card border flat>
          <v-card-title class="d-flex align-center bg-grey-lighten-5">
            <v-icon start color="grey-darken-1">mdi-calendar-check</v-icon>
            <span class="text-subtitle-1 font-weight-bold">
              Бронирование от {{ formatDate(item.startDate) }}
            </span>
          </v-card-title>
          <v-divider></v-divider>

          <v-row no-gutters>
            <v-col cols="12" md="6">
              <div class="pa-4">
                <p class="text-subtitle-2 text-medium-emphasis mb-2 d-flex align-center">
                  <v-icon start>mdi-account</v-icon>
                  СОИСКАТЕЛЬ
                </p>
                <v-list density="compact">
                  <v-list-item :title="item.jobFormId?.fullName || 'Имя не указано'" subtitle="ФИО"
                    prepend-icon="mdi-account-outline" class="px-0"></v-list-item>
                  <v-list-item :title="item.jobFormId?.job || 'Должность не указана'" subtitle="Должность в анкете"
                    prepend-icon="mdi-briefcase-outline" class="px-0"></v-list-item>
                </v-list>
                <v-card-actions class="pa-0 mt-4">
                  <v-btn :to="`/jobs/${item.jobFormId?._id}`" color="primary" variant="tonal" block>
                    Посмотреть анкету
                  </v-btn>
                </v-card-actions>
              </div>
            </v-col>

            <v-divider vertical></v-divider>

            <v-col cols="12" md="6">
              <div class="pa-4">
                <p class="text-subtitle-2 text-medium-emphasis mb-2 d-flex align-center">
                  <v-icon start>mdi-office-building</v-icon>
                  РАБОТОДАТЕЛЬ
                </p>
                <v-list density="compact">
                  <v-list-item :title="item.employerId?.company?.data?.name?.short_with_opf || 'Название не указано'"
                    subtitle="Название компании" prepend-icon="mdi-domain" class="px-0"></v-list-item>
                  <v-list-item :title="item.employerId?.email || 'Email не указан'" subtitle="Контактный Email"
                    prepend-icon="mdi-email-outline" class="px-0"></v-list-item>
                </v-list>
                <v-card-actions class="pa-0 mt-4">
                  <v-btn v-if="item.employerId?.email" :href="`mailto:${item.employerId.email}`" variant="tonal" block>
                    Написать работодателю
                  </v-btn>
                </v-card-actions>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col>
        <v-sheet min-height="400" class="d-flex align-center justify-center text-center" rounded="lg" border>
          <div>
            <v-icon icon="mdi-file-document-multiple-outline" size="64" color="grey"></v-icon>
            <div class="text-h5 mt-4">История бронирований пуста</div>
            <p class="text-medium-emphasis">
              На данный момент в системе нет ни одного бронирования.
            </p>
          </div>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>```