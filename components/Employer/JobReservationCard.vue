<script setup lang="ts">
import type { JobReservationDb } from '~/types/job-reservation.interface';

let props = defineProps<{ jobReservation: JobReservationDb }>()

let jobReservation = computed(() => props.jobReservation)
let { RESERVATION_DURATION } = useEmployer()

const showRemainingReserveTime = computed<boolean>(() => {
  let fDate = new Date(jobReservation.value.startDate)
  let currentDate = new Date()
  const delta = currentDate.getTime() - fDate.getTime()

  if (delta < RESERVATION_DURATION) {
    return true
  }
  return false
})

const formattedSalary = computed(() => {
  const jobForm = props.jobReservation.jobFormId;
  if (!jobForm) return null;

  const { salaryFrom, salaryTo } = jobForm;

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

function formatDate(dateString: string) {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleString('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
</script>
<template>
  <v-card border flat class="d-flex flex-column status-card" height="100%">
    <div class="status-chip-container">
      <v-chip v-if="showRemainingReserveTime" size="large" variant="flat">
        <ClientOnly>
          <CountdownTimer :start-date="jobReservation.startDate">
            <template v-slot="{ hours, minutes, seconds }">
              <span>Осталось {{ hours }}:{{ minutes }}:{{ seconds }}</span>
            </template>
          </CountdownTimer>
        </ClientOnly>
      </v-chip>
    </div>



    <v-list-item :title="jobReservation.jobFormId?.fullName || 'Имя не указано'"
      :subtitle="jobReservation.jobFormId?.job || 'Должность не указана'" class="py-3">
      <template #prepend>
        <v-avatar color="blue-grey-lighten-4">
          <span class="text-h6 text-blue-grey-darken-2">
            {{ jobReservation.jobFormId?.fullName?.[0] || '?' }}
          </span>
        </v-avatar>
      </template>
    </v-list-item>

    <div class="d-flex flex-column flex-grow-1 pa-4">
      <v-list-item :title="formatDate(jobReservation.startDate)" subtitle="Дата бронирования"
        prepend-icon="mdi-calendar-clock" density="compact" class="px-0"></v-list-item>
      <v-divider class="my-3"></v-divider>

      <v-list density="compact" class="flex-grow-1">
        <v-list-item v-if="formattedSalary" :title="formattedSalary" subtitle="Зарплатные ожидания"
          prepend-icon="mdi-cash" class="px-0"></v-list-item>
        <v-list-item v-if="jobReservation.jobFormId?.experience" :title="jobReservation.jobFormId.experience"
          subtitle="Опыт работы" prepend-icon="mdi-briefcase-clock-outline" class="px-0"></v-list-item>
        <v-list-item v-if="jobReservation.jobFormId?.workFormat" :title="jobReservation.jobFormId.workFormat"
          subtitle="Формат работы" prepend-icon="mdi-laptop" class="px-0"></v-list-item>
      </v-list>
      <v-spacer></v-spacer>
      <v-card-actions class="pa-0 mt-4">
        <v-btn :to="`/jobs/${jobReservation.jobFormId?._id}`" :color="showRemainingReserveTime ? 'primary' : ''"
          variant="flat" block>
          Посмотреть анкету
        </v-btn>
      </v-card-actions>
    </div>
  </v-card>
</template>
<style scoped lang="scss">
.status-card {
  position: relative;
  overflow: visible;
}

.status-chip-container {
  position: absolute;
  top: -10px;
  right: -10px;
  z-index: 2;
  font-weight: 700;
}
</style>