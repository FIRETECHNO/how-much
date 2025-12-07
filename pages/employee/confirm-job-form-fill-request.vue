<script setup lang="ts">
import type { JobFormFillRequestDBPopulatedManager } from '~/types/job-form-fill-request.interface'

const route = useRoute()
const router = useRouter()
const employeeReqStore = useEmployeeJobFormFillRequest()

const formFillRequest = ref<JobFormFillRequestDBPopulatedManager | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const confirmed = ref(false)

const requestId = route.query._id as string

// Форматирование времени
function formatInterviewTime(start: string | null, end: string | null): string {
  if (!start || !end) return 'Время не указано'

  const startDate = new Date(start)
  const endDate = new Date(end)

  const dateStr = startDate.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    weekday: 'long'
  })

  const timeStr = `${startDate.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}–${endDate.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`

  return `${dateStr} в ${timeStr}`
}

// Загрузка заявки
async function fetchJobFormFillRequest() {
  try {
    let data = await employeeReqStore.getRequestByIdForConfirmation(requestId)
    formFillRequest.value = data
  } catch (err) {
    error.value = 'Не удалось загрузить заявку'
    console.error(err)
  } finally {
    loading.value = false
  }
}

// Подтверждение участия
async function confirmAttendance() {
  try {
    let res = await employeeReqStore.employeeConfirmFormFillReq(requestId)
    confirmed.value = true

  } catch (err) {
    error.value = 'Ошибка при подтверждении'
    console.error(err)
  }
}

onMounted(() => {
  if (requestId) {
    fetchJobFormFillRequest()
  } else {
    error.value = 'Не указан ID заявки'
    loading.value = false
  }
})
</script>

<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card class="pa-6">
          <v-card-title class="text-h5 font-weight-bold text-center">
            Подтверждение участия
          </v-card-title>

          <v-card-text>
            <v-alert v-if="error" type="error" variant="tonal" class="mb-4">
              {{ error }}
            </v-alert>

            <v-skeleton-loader v-if="loading" type="article" height="200"></v-skeleton-loader>

            <div v-else-if="formFillRequest">
              <p class="text-body-1 mb-4">
                Вы записаны на интервью по направлению:
                <strong>{{ formFillRequest.job }}</strong>
              </p>

              <v-sheet class="d-flex align-center justify-center pa-4 rounded-lg" rounded="lg">
                <v-icon size="36" class="me-3">mdi-calendar-check</v-icon>
                <div class="text-center">
                  <div class="text-h6 font-weight-bold">
                    {{ formatInterviewTime(formFillRequest.startDate, formFillRequest.endDate) }}
                  </div>
                  <div class_tp="text-body-2">Ваше интервью</div>
                </div>
              </v-sheet>

              <v-alert v-if="confirmed || formFillRequest?.confirmedByEmployee" type="success" variant="tonal"
                class="mt-4" icon="mdi-check-circle">
                ✅ Спасибо! Ваше подтверждение принято.
                Мы с нетерпением ждём вас!
              </v-alert>

              <v-btn v-else color="primary" size="x-large" block class="mt-6" :loading="loading"
                @click="confirmAttendance">
                Я обязательно приду!
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>