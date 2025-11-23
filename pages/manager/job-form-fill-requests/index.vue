<script setup lang="ts">
definePageMeta({
  middleware: 'manager'
})

const sections = [
  {
    title: 'Мои заявки',
    description: 'Список заявок, которые вам нужно обработать',
    icon: 'mdi-account-box-multiple-outline',
    to: '/manager/job-form-fill-requests/my',
    color: 'primary'
  },
  {
    title: 'Все заявки на Видео-интервью',
    description: 'Заявки на прохождение видео-собеседований',
    icon: 'mdi-video-outline',
    to: '/manager/job-form-fill-requests/all',
    color: 'primary'
  }
]
</script>

<template>
  <v-container>
    <v-row class="d-flex justify-center">
      <v-col v-for="(section, index) in sections" :key="index" cols="6" md="4">
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