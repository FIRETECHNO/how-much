<script setup lang="ts">
defineProps({
  error: Object
})

const handleClearError = () => clearError({ redirect: '/' })
</script>

<template>
  <v-app>
    <v-main>
      <v-container class="fill-height">
        <v-row align="center" justify="center" class="text-center">
          <v-col cols="12">
            <h1 class="error-code text-grey-lighten-3 font-weight-bold">
              404
            </h1>

            <h2 class="text-h4 font-weight-bold mt-4">
              Страница не найдена
            </h2>
            <p class="text-medium-emphasis text-body-1 mt-2">
              Кажется, вы свернули не туда. Страницы, которую вы ищете, не существует.
            </p>

            <div class="mt-10 d-flex justify-center align-center ga-4">
              <BackButton />

              <v-btn @click="handleClearError" color="primary" variant="flat" prepend-icon="mdi-home-outline">
                На главную
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.error-code {
  /* Делаем цифры "404" очень большими */
  font-size: clamp(8rem, 25vw, 15rem);
  line-height: 1;
}
</style>