<script setup lang="ts">
import type { JobFormFillRequestDBPopulated } from '~/types/job-form-fill-request.interface'

const managerStore = useManager()
const { myJobRequests } = managerStore

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  })
}

function formatTimeRange(start: string, end: string): string {
  const s = new Date(start).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
  const e = new Date(end).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
  return `${s} – ${e}`
}

function getTelegramLink(tgUsername: string | null | undefined, tgId: number | null | undefined): string {
  if (tgUsername) {
    return `https://t.me/${tgUsername}`;
  }
  if (tgId) {
    return `https://t.me/${tgId}`;
  }
  return "";
}

function getConfirmationStatus(confirmed: boolean | undefined): { text: string; color: string } {
  if (confirmed) {
    return { text: '✅ Подтверждено соискателем', color: 'success' };
  }
  return { text: '⏳ Ожидает подтверждения', color: 'warning' };
}

onMounted(async () => {
  await managerStore.getMyJobRequests()
})
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <BackButton :button-text="'Назад'"></BackButton>
      </v-col>
    </v-row>

    <v-row v-if="!myJobRequests">
      <v-col>
        <v-skeleton-loader type="card" height="280" class="mx-auto" v-for="i in 2" :key="i"></v-skeleton-loader>
      </v-col>
    </v-row>

    <v-row v-else-if="myJobRequests.length === 0">
      <v-col>
        <v-alert type="info" variant="tonal" class="mt-4">
          У вас пока нет заявок на интервью.
        </v-alert>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col cols="12" md="8" lg="6" v-for="request in myJobRequests" :key="request._id" class="mb-6">
        <v-card class="h-100" rounded="xl" elevation="4" color="grey-lighten-5">
          <v-card-text class="pb-2">
            <!-- Заголовок с Telegram -->
            <div class="d-flex align-center mb-4">
              <v-avatar size="48" class="me-3">
                <img src="../../../assets/icons/tg-logo.svg" alt="">
              </v-avatar>
              <div>
                <p class="text-h6 font-weight-bold mb-1">
                  {{ request.employee?.name || '—' }}
                </p>
                <div v-if="request.employee?.tgUsername || request.employee?.tgId">
                  <NuxtLink :to="getTelegramLink(request.employee.tgUsername, request.employee.tgId)" target="_blank"
                    rel="noopener" class="text-decoration-none text-blue-darken-2 font-weight-medium">
                    <v-icon size="small" class="me-1">mdi-open-in-new</v-icon>
                    <span v-if="request.employee.tgUsername">
                      @{{ request.employee.tgUsername }}
                    </span>
                    <span v-else>
                      Написать в Telegram
                    </span>
                  </NuxtLink>
                </div>
                <p v-else class="text-caption text-grey">
                  Telegram не подключён
                </p>
              </div>
            </div>

            <!-- ОСНОВНОЙ АКЦЕНТ: Дата и время -->
            <div class="text-center py-4 mb-4" style="background: rgba(0,0,0,0.03); border-radius: 12px;"
              v-if="request.startDate && request.endDate">
              <p class="text-body-1 text-grey mb-1">Дата интервью</p>
              <p class="text-h5 font-weight-bold mb-2">
                {{ formatDate(request.startDate) }}
              </p>
              <p class="text-h4 font-weight-black text-primary">
                {{ formatTimeRange(request.startDate, request.endDate) }}
              </p>
            </div>

            <!-- Позиция -->
            <div class="d-flex align-center justify-center mb-3">
              <v-icon color="primary" size="small" class="me-2">mdi-briefcase</v-icon>
              <span class="text-body-2">{{ request.job || '—' }}</span>
            </div>

            <!-- Статус подтверждения -->
            <div class="text-center mt-2">
              <v-chip :color="getConfirmationStatus(request.confirmedByEmployee).color" text-color="white" size="small"
                variant="flat">
                {{ getConfirmationStatus(request.confirmedByEmployee).text }}
              </v-chip>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>