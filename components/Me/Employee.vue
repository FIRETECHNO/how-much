<script setup lang="ts">
const requestsStore = useEmployeeJobFormFillRequest()
const authStore = useAuth()
const appConst = useAppConst()

let { jobFormFillRequests, latestRequest, isLatestRequestShort } = requestsStore
let color = computed(() => {
  if (latestRequest.value?.job) {
    return appConst.jobColors[latestRequest.value.job] ? appConst.jobColors[latestRequest.value.job] : "info"
  }
  return "info"
})

function formatInterviewTime(start: string | null, end: string | null): string {
  if (!start || !end) return 'Время не указано';

  const startDate = new Date(start);
  const endDate = new Date(end);

  const optionsDate: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };
  const optionsTime: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };

  const formattedDate = startDate.toLocaleDateString('ru-RU', optionsDate);
  const startTime = startDate.toLocaleTimeString('ru-RU', optionsTime);
  const endTime = endDate.toLocaleTimeString('ru-RU', optionsTime);

  return `${formattedDate}, с ${startTime} до ${endTime}`;
}

onMounted(async () => {
  if (authStore.user?._id)
    if (jobFormFillRequests.value.length == 0)
      await requestsStore.getMyRequests(authStore.user?._id)
})
</script>

<template>
  <v-row>
    <v-col cols="12" md="6" v-if="latestRequest">
      <!-- Состояние 1: Последний запрос - НЕЗАВЕРШЕННЫЙ -->
      <v-card v-if="isLatestRequestShort" flat border class="mb-6">
        <v-card-title class="text-h6 font-weight-bold">
          Ваши следующие шаги
        </v-card-title>
        <v-card-subtitle class="break-word">
          Осталось пройти видео-интервью, чтобы мы могли рассмотреть вашу кандидатуру.
        </v-card-subtitle>
        <v-divider class="mt-2"></v-divider>

        <v-card-text>
          <v-list lines="three" bg-color="transparent">
            <!-- ШАГ 1: Регистрация -->
            <v-list-item class="px-0">
              <template v-slot:prepend>
                <v-avatar color="success" variant="tonal" class="mr-4">
                  <v-icon>mdi-check</v-icon>
                </v-avatar>
              </template>
              <v-list-item-title class="text-subtitle-1 font-weight-bold">Регистрация пройдена</v-list-item-title>
              <div class="text-body-1 mt-1">
                Вы успешно зарегистрировались и выбрали направление:
                <strong class="text-high-emphasis">{{ latestRequest.job }}</strong>.
              </div>
            </v-list-item>

            <v-divider class="my-4"></v-divider>

            <!-- ШАГ 2: Видео-интервью -->
            <v-list-item class="px-0">
              <template v-slot:prepend>
                <v-avatar :color="color" variant="tonal" class="mr-4">
                  <v-icon>mdi-video-outline</v-icon>
                </v-avatar>
              </template>
              <v-list-item-title class="text-subtitle-1 font-weight-bold">Запись видео-интервью</v-list-item-title>
              <div>
                <p class="text-body-1 mt-1">
                  Следующий шаг — короткое видео-интервью. Нажмите на кнопку, чтобы выбрать удобное время и получить
                  инструкции.
                </p>
                <v-btn :to="`/employee/send-job-form-fill-request?request_id=${latestRequest._id}`" :color="color"
                  variant="flat" class="mt-4" size="large">
                  Подать заявку
                </v-btn>
              </div>
            </v-list-item>

            <v-divider class="my-4"></v-divider>

            <!-- ШАГ 3: Связь с рекрутером -->
            <v-list-item class="px-0">
              <template v-slot:prepend>
                <v-avatar color="grey" variant="tonal" class="mr-4">
                  <v-icon>mdi-headset</v-icon>
                </v-avatar>
              </template>
              <v-list-item-title class="text-subtitle-1 font-weight-bold text-medium-emphasis">
                Связь с рекрутером
              </v-list-item-title>
              <div class="text-body-1 mt-1">
                <span v-if="latestRequest.manager">
                  ✅ С вами свяжется менеджер по подбору.
                </span>
                <span v-else>
                  После успешной записи интервью наш рекрутер свяжется с вами для дальнейших шагов.
                </span>
              </div>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>

      <!-- Состояние 2: Последний запрос - ЗАВЕРШЕННЫЙ -->
      <v-card v-else flat border class="mb-6">
        <v-card-title class="text-h6 font-weight-bold d-flex align-center">
          <v-icon color="success" start>mdi-check-decagram-outline</v-icon>
          Заявка принята!
        </v-card-title>
        <v-card-subtitle>
          <span v-if="latestRequest.manager">
            ✅ С вами свяжется менеджер по подбору.
          </span>
          <span v-else>
            Ваше интервью назначено. Ожидайте контакта от рекрутера.
          </span>
        </v-card-subtitle>
        <v-divider class="mt-2"></v-divider>

        <v-card-text>
          <v-list bg-color="transparent">
            <!-- Направление -->
            <v-list-item class="px-0">
              <template #prepend>
                <v-icon color="grey-darken-1">mdi-briefcase-outline</v-icon>
              </template>
              <v-list-item-title>{{ latestRequest.job }}</v-list-item-title>
              <v-list-item-subtitle>Направление</v-list-item-subtitle>
            </v-list-item>

            <!-- Назначенное время -->
            <v-list-item class="px-0">
              <template #prepend>
                <v-icon color="grey-darken-1">mdi-calendar-clock</v-icon>
              </template>
              <v-list-item-title class="font-weight-medium">
                {{ formatInterviewTime(latestRequest.startDate, latestRequest.endDate) }}
              </v-list-item-title>
              <v-list-item-subtitle>Назначенное время</v-list-item-subtitle>
            </v-list-item>

            <!-- Следующий шаг -->
            <v-list-item class="px-0">
              <template #prepend>
                <v-icon color="grey-darken-1">mdi-headset</v-icon>
              </template>
              <v-list-item-title>
                <span v-if="latestRequest.manager">
                  ✅ Менеджер свяжется с вами
                </span>
                <span v-else>
                  Ожидайте контакта от рекрутера
                </span>
              </v-list-item-title>
              <v-list-item-subtitle>Следующий шаг</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped>
.break-word {
  overflow-wrap: break-word;
  white-space: normal;
}
</style>