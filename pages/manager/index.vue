<script setup lang="ts">
definePageMeta({
  middleware: 'manager'
})

const sections = [
  {
    title: 'Анкеты',
    description: 'Загрузка визиток и поднятие их в поиске',
    icon: 'mdi-account-box-outline',
    to: '/manager/jobs/',
    color: 'primary'
  },
  {
    title: 'Заявки Видео-интервью',
    description: 'Заявки на прохождение видео-собеседований',
    icon: 'mdi-video-outline',
    to: '/manager/video-interviews/',
    color: 'primary'
  }
  // Добавьте сюда новые разделы при необходимости
]
</script>

<template>
  <v-container>
    <v-row>
      <v-col v-for="(section, index) in sections" :key="index" cols="12" md="6">
        <NuxtLink :to="section.to" class="text-decoration-none">
          <v-sheet class="clickable-sheet d-flex flex-column align-center justify-center pa-6 text-center" rounded="lg"
            elevation="6" height="350">
            <v-icon :icon="section.icon" :color="section.color" size="80" class="mb-4"></v-icon>
            <p class="text-h5 text-md-h4 font-weight-bold text-grey-darken-3">
              {{ section.title }}
            </p>
            <p class="text-body-1 text-grey-darken-1 mt-2">
              {{ section.description }}
            </p>
          </v-sheet>
        </NuxtLink>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.clickable-sheet {
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  cursor: pointer;
}

.clickable-sheet:hover {
  transform: translateY(-8px);
  box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.2) !important;
}
</style>