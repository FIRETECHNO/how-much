<script setup lang="ts">
definePageMeta({
  middleware: "auth" // Убедимся, что пользователь авторизован
})
</script>

<template>
  <v-container class="fill-height">
    <v-row justify="center" align="center">
      <v-col cols="12" md="8" lg="6">
        <v-sheet class="d-flex flex-column align-center justify-center text-center pa-10" rounded="lg" border>
          <v-icon icon="mdi-check-decagram" color="success" size="80" class="mb-6"></v-icon>

          <h1 class="text-h4 font-weight-bold">Оплата прошла успешно!</h1>

          <p class="text-body-1 text-medium-emphasis mt-4">
            Спасибо за вашу подписку! Премиум доступ к платформе активирован.
            Теперь вы можете вернуться в личный кабинет и начать поиск кандидатов.
          </p>

          <v-btn to="/" color="primary" variant="flat" size="large" class="mt-8" append-icon="mdi-arrow-right">
            Перейти к поиску кандидатов
          </v-btn>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>