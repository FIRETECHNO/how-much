<script setup lang="ts">
import { computed } from 'vue';
import type { JobReservationDbWithEmployer } from '~/types/job-reservation.interface';

const props = defineProps<{
  reservation: JobReservationDbWithEmployer
}>();

const companyName = computed(() => props.reservation.employerId?.company?.data?.name?.short_with_opf || 'Название компании не указано');
const employerEmail = computed(() => props.reservation.employerId?.email || 'Email не указан');
const companyInn = computed(() => props.reservation.employerId?.company?.data?.inn || 'ИНН не указан');
const jobTitle = computed(() => props.reservation.jobFormId?.job || 'Должность не указана');

function formatDate(dateString: string | undefined): string {
  if (!dateString) return 'Дата не указана';
  return new Date(dateString).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: "2-digit",
    minute: "2-digit",
  });
}
</script>

<template>
  <v-card border flat class="d-flex flex-column" height="100%">
    <v-list-item :title="companyName" subtitle="Заинтересовался вашей анкетой" class="py-3">
      <template #prepend>
        <v-avatar color="primary" variant="tonal">
          <v-icon>mdi-office-building-outline</v-icon>
        </v-avatar>
      </template>
    </v-list-item>

    <v-divider></v-divider>
    <v-card-text>
      <div class="d-flex flex-column flex-grow-1">
        <p class="text-subtitle-2 text-medium-emphasis mb-1">ДЕТАЛИ БРОНИРОВАНИЯ</p>
        <v-list density="compact">
          <v-list-item :title="formatDate(reservation.startDate)" subtitle="Дата" prepend-icon="mdi-calendar-check"
            class="px-0"></v-list-item>
          <v-list-item :title="jobTitle" subtitle="По анкете на должность" prepend-icon="mdi-briefcase-outline"
            class="px-0"></v-list-item>
        </v-list>

        <v-divider class="my-3"></v-divider>

        <p class="text-subtitle-2 text-medium-emphasis mb-1">ИНФОРМАЦИЯ О РАБОТОДАТЕЛЕ</p>
        <v-list density="compact" class="flex-grow-1">
          <v-list-item :title="employerEmail" subtitle="Контактный Email" prepend-icon="mdi-email-outline"
            class="px-0"></v-list-item>
          <v-list-item :title="companyInn" subtitle="ИНН" prepend-icon="mdi-identifier" class="px-0"></v-list-item>
        </v-list>
      </div>
    </v-card-text>
  </v-card>
</template>