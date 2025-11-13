<script setup lang="ts">
definePageMeta({
  middleware: "auth"
})

const auth = useAuth()
let { isEmployer, isEmployee } = useRole()
let { isEmployerSubscriptionActive, checkSubscriptionStatus, currentSubscription, manuallyCheckSubscriptionStatus } = useSubscription()
const { user } = storeToRefs(auth)
const { companyEmail } = useAppConst()

const showNotification = ref(true);
interface Notification {
  title: string,
  description: string,
  color: string
}

let notifications = computed<Notification[]>(() => {
  let res: Notification[] = []

  if (isEmployer.value) {
    if (!user.value?.isModerated) {
      res.push({
        title: "Ваш аккаунт находится на рассмотрении",
        description: `Наш администратор рассмотрит вашу компанию и одобрит в течение 2 дней. <b>До этого времени возможности платформы будут ограничены</b>.<br/>Рабочая почта для обращений: <a href="mailto:${companyEmail}">${companyEmail}</a>`,
        color: "warning"
      })
    }
  }


  return res
})

function formatUserRoles(roles: string[] | undefined): string {
  if (!roles || roles.length === 0) {
    return 'Не определена'
  }

  return roles
    .map(role => role.charAt(0).toUpperCase() + role.slice(1))
    .join(', ')
}
await checkSubscriptionStatus()
</script>

<template>
  <v-container>
    <MeEmployee v-if="isEmployee" />
    <v-row v-if="isEmployer && user?.isModerated">
      <v-col cols="12" md="4" v-if="currentSubscription?._id">
        <v-card to="/" class="mb-6" v-if="isEmployerSubscriptionActive">
          <v-card-text class="d-flex align-center">
            <v-avatar color="primary" variant="tonal" size="56" class="mr-4">
              <v-icon size="32">mdi-text-box-search-outline</v-icon>
            </v-avatar>
            <div>
              <h3 class="text-h6 font-weight-bold">Поиск анкет</h3>
              <p class="text-body-2 text-medium-emphasis">Перейти на главную страницу</p>
            </div>
            <v-spacer></v-spacer>
            <v-icon size="24">mdi-chevron-right</v-icon>
          </v-card-text>
        </v-card>
        <v-card class="mb-6 fill-height" variant="tonal" v-else>
          <v-card-text class="d-flex flex-column justify-center align-center text-center fill-height">
            <v-icon size="56" class="mb-4" color="grey-lighten-1">mdi-timer-sand</v-icon>

            <h3 class="text-h6 font-weight-bold">Оплата в обработке</h3>
            <p class="text-body-2 text-medium-emphasis mt-1">
              Обычно это занимает не более минуты.
            </p>
            <v-btn @click="manuallyCheckSubscriptionStatus" variant="outlined" class="mt-4" size="small">
              Проверить статус
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="8" v-else>
        <v-card to="/pricing/employer" class="premium-card fill-height">
          <div class="d-flex flex-no-wrap justify-space-between align-center fill-height pa-4">
            <div class="mr-4">
              <h3 class="text-h5 font-weight-bold">Доступ к анкетам</h3>
              <p class="text-body-1 mt-1">
                Разблокируйте все возможности платформы!
              </p>
              <v-btn variant="outlined" class="mt-4" append-icon="mdi-arrow-right">
                Выбрать тариф
              </v-btn>
            </div>
            <v-avatar size="80" rounded="0">
              <v-icon size="64">mdi-rocket-launch-outline</v-icon>
            </v-avatar>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-if="notifications.length > 0">
      <v-col cols="12" v-for="(n, index) of notifications" :key="index">
        <v-alert v-model="showNotification" type="info" :title="n.title" variant="tonal" :color="n.color" prominent
          icon="mdi-information-outline">
          <p class="mt-4" v-html="n.description">
          </p>
        </v-alert>
      </v-col>
    </v-row>


    <h1 class="text-h4 font-weight-bold my-6">Личный кабинет</h1>

    <v-row>
      <v-col cols="12" md="4">
        <v-card v-if="user">
          <v-card-text class="d-flex flex-column align-center text-center pa-6">
            <v-avatar size="120" class="mb-4 border">
              <span class="text-h3">{{ user.name?.[0] }}</span>
            </v-avatar>

            <h2 class="text-h5 font-weight-bold">{{ user.name }}</h2>
            <p class="text-body-1 text-medium-emphasis">{{ user.email }}</p>

            <v-btn variant="tonal" class="mt-6" prepend-icon="mdi-pencil-outline" to="/profile/edit">
              Редактировать профиль
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="8">
        <v-card flat border>
          <v-card-title class="text-h6">
            Информация об аккаунте
          </v-card-title>
          <v-divider></v-divider>
          <v-list lines="two">
            <v-list-item :title="user?.name" subtitle="Имя и Фамилия" prepend-icon="mdi-account-outline"></v-list-item>
            <v-divider inset></v-divider>
            <v-list-item :title="user?.email" subtitle="Электронная почта"
              prepend-icon="mdi-email-outline"></v-list-item>
            <v-divider inset></v-divider>
            <v-list-item :title="formatUserRoles(user?.roles)" subtitle="Роль в системе"
              prepend-icon="mdi-shield-account-outline"></v-list-item>
          </v-list>
          <v-divider></v-divider>
          <v-card-actions class="pa-4">
            <v-btn variant="flat" color="primary" prepend-icon="mdi-lock-reset" to="/profile/change-password">
              Сменить пароль
            </v-btn>
          </v-card-actions>
        </v-card>

        <v-card v-if="user && user.company" flat border class="mt-6">
          <v-card-title class="text-h6">
            Информация о компании
          </v-card-title>
          <v-divider></v-divider>
          <v-list lines="two">
            <v-list-item :title="user.company.data.name.short_with_opf" subtitle="Название организации"
              prepend-icon="mdi-office-building-outline"></v-list-item>
            <v-divider inset></v-divider>
            <v-list-item :title="user.company.data.inn" subtitle="ИНН" prepend-icon="mdi-identifier"></v-list-item>
            <v-divider inset></v-divider>
            <v-list-item :title="user.company.data.ogrn" subtitle="ОГРН" prepend-icon="mdi-identifier"></v-list-item>
            <v-divider inset></v-divider>
            <v-list-item :title="user.company.data.address.value" subtitle="Юридический адрес"
              prepend-icon="mdi-map-marker-outline"></v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>