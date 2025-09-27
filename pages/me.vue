<script setup lang="ts">
definePageMeta({
  middleware: "auth"
})

const auth = useAuth()
const { user } = storeToRefs(auth)

function formatUserRoles(roles: string[] | undefined): string {
  if (!roles || roles.length === 0) {
    return 'Не определена'
  }

  return roles
    .map(role => role.charAt(0).toUpperCase() + role.slice(1))
    .join(', ')
}
</script>

<template>
  <v-container>
    <h1 class="text-h4 font-weight-bold mb-6">Личный кабинет</h1>

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