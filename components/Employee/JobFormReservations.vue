<script setup lang="ts">
import type { JobReservationDbWithEmployer } from '~/types/job-reservation.interface';

let props = defineProps<{
  myReservations: JobReservationDbWithEmployer[]
}>()

let myReservations = computed(() => props.myReservations)

function formatDate(dateString: string | undefined): string {
  if (!dateString) return 'Дата не указана';
  return new Date(dateString).toLocaleString('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: "numeric",
    minute: "numeric"
  });
}
</script>
<template>
  <v-container>
    <v-row v-if="myReservations.length > 0">
      <v-col v-for="item in myReservations" :key="item._id" cols="12" md="6">
        <v-card border flat class="d-flex flex-column" height="100%">
          <v-list-item :title="item.employerId?.company?.data?.name?.short_with_opf || 'Название компании не указано'"
            subtitle="Забронировал(а) вашу анкету" class="py-3">
            <template #prepend>
              <v-avatar color="primary" variant="tonal">
                <v-icon>mdi-office-building-outline</v-icon>
              </v-avatar>
            </template>
          </v-list-item>

          <v-divider></v-divider>

          <div class="d-flex flex-column flex-grow-1 pa-4">
            <v-list density="compact">
              <v-list-item :title="formatDate(item.startDate)" subtitle="Дата бронирования"
                prepend-icon="mdi-calendar-clock" class="px-0"></v-list-item>
              <v-list-item :title="item.jobFormId?.job || 'Должность не указана'" subtitle="По анкете на должность"
                prepend-icon="mdi-briefcase-outline" class="px-0"></v-list-item>
            </v-list>

            <v-divider class="my-3"></v-divider>

            <p class="text-subtitle-1 font-weight-medium mb-2">Данные работодателя:</p>
            <v-list density="compact" class="flex-grow-1">
              <v-list-item v-if="item.employerId?.email" :title="item.employerId.email" subtitle="Контактный Email"
                prepend-icon="mdi-email-outline" class="px-0"></v-list-item>
              <v-list-item v-if="item.employerId?.company?.data?.inn" :title="item.employerId.company.data.inn"
                subtitle="ИНН" prepend-icon="mdi-identifier" class="px-0"></v-list-item>
              <v-list-item v-if="item.employerId?.company?.data?.address?.value"
                :title="item.employerId.company.data.address.value" subtitle="Юридический адрес"
                prepend-icon="mdi-map-marker-outline" class="px-0"></v-list-item>
            </v-list>

            <v-spacer></v-spacer>

            <v-card-actions class="pa-0 mt-4">
              <v-btn v-if="item.employerId?.email" :href="`mailto:${item.employerId.email}`"
                prepend-icon="mdi-email-fast-outline">
                Написать на почту
              </v-btn>

              <v-btn color="primary" variant="flat" prepend-icon="mdi-comment-quote-outline" class="fab-pulse"
                v-if="!item.employeeFeedback?.textContent"
                :to="`/employee/reservation-feedback-chat/${item._id}`">Обозначить
                результат
                встречи</v-btn>
            </v-card-actions>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col>
        <v-sheet min-height="400" class="d-flex align-center justify-center text-center" rounded="lg" border>
          <div>
            <v-icon icon="mdi-account-search-outline" size="64" color="grey"></v-icon>
            <div class="text-h5 mt-4">У вас пока нет бронирований</div>
            <p class="text-medium-emphasis">
              Когда работодатель забронирует вашу анкету, это отобразится здесь.
            </p>
          </div>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>
<style scoped>
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(var(--v-theme-primary), 0.5);
    transform: scale(1);
  }

  70% {
    box-shadow: 0 0 0 10px rgba(var(--v-theme-primary), 0);
    transform: scale(1.05);
  }

  100% {
    box-shadow: 0 0 0 0 rgba(var(--v-theme-primary), 0);
    transform: scale(1);
  }
}

.fab-pulse {
  animation: pulse 1.8s infinite;
}
</style>