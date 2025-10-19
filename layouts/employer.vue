<script setup lang="ts">
import { useTheme } from "vuetify"

const theme = useTheme()
const route = useRoute()
const router = useRouter()
const savedTheme = useCookie('theme')
const userStore = useAuth();
const employerStore = useEmployer()
const employerJobsStore = useEmployerJobs()

let { reservedJob } = employerJobsStore;

let excludedRoutes = ["/employer/reservation-feedback-chat", "/employer/job-form-history"]
let isReservedFormAlertOpen = ref(true)
let reservedFormAlertVisible = computed(() => {
  if (excludedRoutes.indexOf(route.path) != -1) {
    return false;
  }
  if (isReservedFormAlertOpen.value && reservedJob.value?._id) return true
  return false;
})

let drawer = ref(false);
let dialog = ref(false);

if (['light', 'dark'].includes(String(savedTheme.value))) {
  theme.global.name.value = String(savedTheme.value);
}

function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? "light" : "dark"
  savedTheme.value = theme.global.name.value
}

async function logOut() {
  dialog.value = false;
  await userStore.logout();
}

await employerStore.getJobFormsHistory()
await employerJobsStore.getReservedJob()

const navigationItems: any[] = [
  { title: 'Поиск анкет', path: '/jobs', icon: 'mdi-text-box-search-outline' },
  { title: 'Избранные анкеты', path: '/employer/job-form-history', icon: 'mdi-star-outline', count: employerStore.jobFormsHistory.value.length },
]
</script>

<template>
  <v-app>
    <v-app-bar flat border>
      <v-container class="d-flex align-center">
        <NuxtLink to="/" class="text-decoration-none text-high-emphasis">
          <div class="font-weight-bold text-h6">Сколько</div>
        </NuxtLink>

        <v-spacer></v-spacer>

        <div class="d-md-flex d-none align-center">
          <template v-for="item in navigationItems" :key="item.path">
            <v-badge :model-value="item.count > 0" :content="item.count" color="primary">
              <v-btn :to="item.path" variant="text" class="mx-1" :prepend-icon="item.icon">
                {{ item.title }}
              </v-btn>
            </v-badge>
          </template>

          <v-btn icon @click="toggleTheme" title="Переключить тему">
            <v-icon icon="mdi-theme-light-dark"></v-icon>
          </v-btn>

          <v-menu location="bottom end">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" class="ml-2">
                <v-avatar size="32" class="mr-2 border">
                  <span v-if="userStore.user?.name">{{ userStore.user.name[0] }}</span>
                </v-avatar>
                {{ userStore.user?.name }}
                <v-icon icon="mdi-chevron-down"></v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item to="/me" prepend-icon="mdi-account-outline">
                <v-list-item-title>Личный кабинет</v-list-item-title>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item @click="dialog = true" prepend-icon="mdi-logout" base-color="error">
                <v-list-item-title>Выйти</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>

        <v-app-bar-nav-icon class="hidden-md-and-up" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      </v-container>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" location="right" temporary>
      <v-list>
        <v-list-item :title="userStore.user?.name" :subtitle="userStore.user?.email" to="/me">
          <template v-slot:prepend>
            <v-avatar class="border">
              <span v-if="userStore.user?.name">{{ userStore.user.name[0] }}</span>
            </v-avatar>
          </template>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list nav>
        <v-list-item to="/me" prepend-icon="mdi-account-outline" title="Личный кабинет"></v-list-item>
        <v-list-item v-for="item in navigationItems" :key="item.path" :to="item.path" :prepend-icon="item.icon"
          :title="item.title">
          <template #append v-if="item.count > 0">
            <v-badge :content="item.count" color="primary" inline></v-badge>
          </template>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list nav>
        <v-list-item @click="toggleTheme" prepend-icon="mdi-theme-light-dark" title="Сменить тему"></v-list-item>
      </v-list>

      <template v-slot:append>
        <div class="pa-2">
          <v-btn block color="red" variant="tonal" prepend-icon="mdi-logout" @click="dialog = true">
            Выйти
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-main>
      <slot />
    </v-main>

    <v-dialog v-model="dialog" max-width="400">
      <v-card title="Выйти из аккаунта?" text="Вы уверены, что хотите завершить текущую сессию?">
        <template v-slot:actions>
          <v-spacer></v-spacer>
          <v-btn text="Отмена" @click="dialog = false"></v-btn>
          <v-btn text="Да, выйти" color="primary" @click="logOut"></v-btn>
        </template>
      </v-card>
    </v-dialog>

    <v-card class="fab-pulse" hover size="large" max-width="400px"
      style="position: fixed; left: 40px; top: 100px; z-index: 9999;" v-if="reservedFormAlertVisible"
      @click="router.push('/employer/reservation-feedback-chat')">
      <v-list-item class="py-2" prepend-icon="mdi-account-star-outline" subtitle="Забронированная анкета">
        <template #title>
          {{ reservedJob.jobFormId.job }} / {{ reservedJob.jobFormId?.fullName }}
        </template>
        <template #append>
          <v-btn icon="mdi-close" variant="text" size="small" @click.stop="isReservedFormAlertOpen = false"
            title="Закрыть уведомление"></v-btn>
        </template>
      </v-list-item>

      <v-divider></v-divider>

      <v-card-text class="d-flex justify-space-between align-center">
        <div class="d-flex align-center">
          <v-icon size="small">mdi-phone-outline</v-icon>
          <span class="ml-2 font-weight-medium">{{ reservedJob.jobFormId?.phone }}</span>
        </div>

        <ClientOnly>
          <CountdownTimer :start-date="reservedJob.startDate" @finished="employerJobsStore.removeCurrentReservedJob">
            <template v-slot="{ hours, minutes, seconds }">
              <span style="line-height: 1;" class="d-flex align-center">
                <v-icon size="small" class="mr-1">mdi-clock-outline</v-icon>
                {{ hours }}:{{ minutes }}:{{ seconds }}
              </span>
            </template>
          </CountdownTimer>
        </ClientOnly>
      </v-card-text>
    </v-card>

    <Footer />
  </v-app>
</template>
<style scoped>
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(var(--v-theme-primary), 0.5);
  }

  70% {
    box-shadow: 0 0 0 10px rgba(var(--v-theme-primary), 0);
  }

  100% {
    box-shadow: 0 0 0 0 rgba(var(--v-theme-primary), 0);
  }
}

.fab-pulse {
  animation: pulse 1.8s infinite;
}
</style>