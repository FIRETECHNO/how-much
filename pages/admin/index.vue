<script setup lang="ts">
definePageMeta({
  middleware: "admin"
})
</script>
<template>
  <v-container>
    <v-row>
      <v-col cols="6">
        <NuxtLink to="/admin/jobs/" class="text-decoration-none">
          <v-sheet class="clickable-sheet d-flex flex-column align-center justify-center pa-6" rounded="lg"
            elevation="6" height="350">
            <v-icon icon="mdi-account-box-outline" color="primary" size="80" class="mb-4"></v-icon>
            <p class="text-h4 font-weight-bold text-grey-darken-3">
              Анкеты
            </p>
            <p class="text-body-1 text-grey-darken-1 mt-2">
              Загрузка визиток и поднятие их в поиске
            </p>
          </v-sheet>
        </NuxtLink>
      </v-col>
      <v-col cols="6">
        <NuxtLink to="/admin/employers/" class="text-decoration-none">
          <v-sheet class="clickable-sheet d-flex flex-column align-center justify-center pa-6" rounded="lg"
            elevation="6" height="350">
            <v-icon icon="mdi-briefcase-edit-outline" color="primary" size="80" class="mb-4"></v-icon>
            <p class="text-h4 font-weight-bold text-grey-darken-3">
              Работодатели
            </p>
            <p class="text-body-1 text-grey-darken-1 mt-2">
              Модерация и присвоение прав работодателю
            </p>
          </v-sheet>
        </NuxtLink>
      </v-col>
    </v-row>
  </v-container>
</template>
<style scoped>
.clickable-sheet {
  /* Плавный переход для всех анимируемых свойств */
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.clickable-sheet:hover {
  /* Слегка приподнимаем карточку при наведении */
  transform: translateY(-10px);
  /* Увеличиваем тень для эффекта "глубины" */
  box-shadow: 0px 12px 24px -6px rgba(0, 0, 0, 0.25) !important;
}
</style>