<script setup lang="ts">
defineProps<{
  variant: "right" | "left"
}>()

const messages = [
  { name: 'Рекрутер', text: 'Привет! Как ваши дела?' },
  { name: 'Работодатель', text: 'Добрый день! Расскажите немного о себе.' },
  { name: 'Соискатель', text: 'Здравствуйте! Интересуюсь вакансией.' },
  { name: 'Рекрутер', text: 'Отлично! Когда вы сможете выйти на работу?' },
  { name: 'Работодатель', text: 'Нам нужен опытный специалист.' },
  { name: 'Соискатель', text: 'У меня есть необходимый опыт.' },
  { name: 'Рекрутер', text: 'Пришлите, пожалуйста, ваше резюме.' },
  { name: 'Работодатель', text: 'Мы готовы предложить достойную зарплату.' },
  { name: 'Соискатель', text: 'Какие у вас требования к кандидату?' },
  { name: 'Рекрутер', text: 'Проект рассчитан на долгосрочное сотрудничество.' },
  { name: 'Работодатель', text: 'Ожидаем высокий уровень ответственности.' },
  { name: 'Соискатель', text: 'Я готов к сложным задачам.' },
  { name: 'Рекрутер', text: 'Есть возможность удаленной работы.' },
  { name: 'Работодатель', text: 'Компания активно развивается.' },
  { name: 'Соискатель', text: 'Хочу присоединиться к вашей команде.' }
]
</script>

<template>
  <v-row v-if="variant == 'left'" class="d-flex">
    <v-col cols="12" class="d-flex justify-end position-relative">
      <LandingMainMessageCloudItem :messages="messages" />
    </v-col>
    <v-col cols="12" class="d-flex justify-start position-relative">
      <LandingMainMessageCloudItem :messages="messages" />
    </v-col>
    <v-col cols="12" class="d-flex justify-end position-relative">
      <LandingMainMessageCloudItem :messages="messages" />
    </v-col>
  </v-row>
  <v-row v-else-if="variant == 'right'">
    <v-col cols="12" class="d-flex justify-start position-relative">
      <LandingMainMessageCloudItem :messages="messages" />
    </v-col>
    <v-col cols="12" class="d-flex justify-end position-relative">
      <LandingMainMessageCloudItem :messages="messages" />
    </v-col>
    <v-col cols="12" class="d-flex justify-start position-relative">
      <LandingMainMessageCloudItem :messages="messages" />
    </v-col>
  </v-row>
</template>

<style scoped>
.message-wrapper {
  width: 100%;
  display: flex;
  justify-content: inherit;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>