<script setup lang="ts">
definePageMeta({
  middleware: "auth"
})

// Почта поддержки из констант или .env
const { companyEmail } = useAppConst();
</script>

<template>
  <v-container class="fill-height">
    <v-row justify="center" align="center">
      <v-col cols="12" md="8" lg="6">
        <v-sheet class="d-flex flex-column align-center justify-center text-center pa-10" rounded="lg" border>
          <v-icon icon="mdi-alert-circle-outline" color="error" size="80" class="mb-6"></v-icon>

          <h1 class="text-h4 font-weight-bold">Произошла ошибка при оплате</h1>

          <p class="text-body-1 text-medium-emphasis mt-4">
            К сожалению, не удалось завершить платеж.
            <strong>Денежные средства не были списаны.</strong>
            Пожалуйста, попробуйте еще раз или свяжитесь с нашей службой поддержки.
          </p>

          <div class="d-flex flex-wrap justify-center ga-4 mt-8">
            <v-btn to="/pricing/employer" color="primary" variant="flat" size="large">
              Попробовать снова
            </v-btn>
            <v-btn :href="`mailto:${companyEmail}`" variant="tonal" size="large">
              Связаться с поддержкой
            </v-btn>
          </div>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>