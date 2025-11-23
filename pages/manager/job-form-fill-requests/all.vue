<script setup lang="ts">
import type { User } from '~/types/user.interface'

definePageMeta({
  middleware: "manager"
})

const router = useRouter()
const managerStore = useManager()
const { jobRequests } = managerStore


function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: 'short',
    weekday: 'short'
  })
}

function formatTimeRange(start: string, end: string): string {
  const s = new Date(start).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
  const e = new Date(end).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
  return `${s}–${e}`
}

function getTelegramLink(tgUsername: User["tgUsername"], tgId: User["tgId"]): string {
  if (tgUsername) {
    return `https://t.me/${tgUsername}`;
  }
  if (tgId) {
    // Ссылка для мобильного Telegram (не работает в браузере, но открывает приложение)
    return `https://t.me/${tgId}`;
  }
  return "";
}

async function handleRespond(requestId: string) {
  await managerStore.setManager(requestId)
  router.push("/manager/job-form-fill-requests/my")
}

onMounted(async () => {
  await managerStore.getAllRequests()
})
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <BackButton :button-text="'Назад'"></BackButton>
      </v-col>
    </v-row>

    <v-row v-if="!jobRequests">
      <v-col>
        <v-skeleton-loader type="card" height="200" class="mx-auto" v-for="i in 3" :key="i"></v-skeleton-loader>
      </v-col>
    </v-row>

    <v-row v-else-if="jobRequests.length === 0">
      <v-col>
        <v-alert type="info" variant="tonal">
          Заявок пока нет.
        </v-alert>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col cols="6" sm="4" md="3" lg="2" v-for="request in jobRequests" :key="request._id">
        <v-card class="h-100 d-flex flex-column" variant="outlined" rounded="lg">
          <v-card-text class="pb-2">
            <!-- Имя и email -->
            <div class="d-flex align-center mb-3">
              <v-icon color="primary" size="small" class="me-2">mdi-account</v-icon>
              <div>
                <p class="text-body-1 font-weight-medium mb-0">
                  {{ request.employee?.name || '—' }}
                </p>
                <p class="text-caption text-grey mb-0">
                  {{ request.employee?.email || '—' }}
                </p>
              </div>
            </div>
            <!-- Telegram -->
            <div v-if="getTelegramLink(request.employee.tgUsername, request.employee.tgId)"
              class="d-flex align-center mb-2">
              <v-icon color="primary" size="small" class="me-2">mdi-send</v-icon>
              <NuxtLink :to="getTelegramLink(request.employee.tgUsername, request.employee.tgId)" target="_blank"
                rel="noopener" class="text-decoration-none" style="color: inherit;">
                <span class="text-body-2">
                  <template v-if="request.employee.tgUsername">
                    @{{ request.employee.tgUsername }}
                  </template>
                  <template v-else>
                    Telegram ID: {{ request.employee.tgId }}
                  </template>
                </span>
              </NuxtLink>
            </div>

            <!-- Позиция -->
            <div class="d-flex align-center mb-3">
              <v-icon color="primary" size="small" class="me-2">mdi-briefcase</v-icon>
              <span class="text-body-2">{{ request.job || '—' }}</span>
            </div>

            <!-- Дата и время -->
            <div class="d-flex align-center">
              <v-icon color="primary" size="small" class="me-2">mdi-calendar</v-icon>
              <div v-if="request.startDate && request.endDate">
                <p class="font-weight-medium mb-0">
                  {{ formatTimeRange(request.startDate, request.endDate) }}
                </p>
                <p class="text-body-2 mb-0">
                  {{ formatDate(request.startDate) }}
                </p>
              </div>
            </div>

          </v-card-text>

          <!-- Кнопка "Откликнуться" -->
          <v-card-actions class="pt-0 mt-auto">
            <v-btn color="primary" variant="flat" size="small" class="text-none" @click="handleRespond(request._id)"
              block>
              Откликнуться
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>