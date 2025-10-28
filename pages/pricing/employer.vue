<script setup lang="ts">
definePageMeta({
  middleware: "employer"
})

const subscriptionStore = useSubscription()
const loading = ref(false);

async function handlePayment() {
  loading.value = true;
  subscriptionStore.createEmployerPaymentOrder(100)
  loading.value = false;
}
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <BackButton />
      </v-col>
    </v-row>

    <v-row justify="center" class="mt-4">
      <v-col cols="12" class="text-center">
        <h1 class="text-h3 font-weight-bold">Тарифный план</h1>
        <p class="text-h6 text-medium-emphasis mt-2">
          Получите полный доступ к нашей базе кандидатов
        </p>
      </v-col>
    </v-row>

    <v-row justify="center" class="mt-8">
      <v-col cols="12" md="8" lg="6">
        <v-card border elevation="4" rounded="lg">
          <v-card-title class="text-center text-h5 font-weight-medium pa-4">
            Премиум доступ
          </v-card-title>
          <v-divider></v-divider>

          <v-card-text class="text-center pa-8">
            <div class="d-flex justify-center align-baseline">
              <span class="text-h2 font-weight-bold">15 000</span>
              <span class="text-h5 font-weight-medium ml-2">₽ / неделя</span>
            </div>
            <p class="text-medium-emphasis mt-2">
              Доступ ко всем возможностям платформы
            </p>
          </v-card-text>
          <v-divider></v-divider>

          <v-card-text>
            <v-list>
              <v-list-item prepend-icon="mdi-check-circle" title="Неограниченный просмотр анкет"
                class="px-0"></v-list-item>
              <v-list-item prepend-icon="mdi-check-circle" title="Доступ к контактам кандидатов"
                class="px-0"></v-list-item>
              <v-list-item prepend-icon="mdi-check-circle" title="Бронирование анкет на 30 минут"
                class="px-0"></v-list-item>
              <v-list-item prepend-icon="mdi-check-circle" title="Приоритетная поддержка" class="px-0"></v-list-item>
            </v-list>
          </v-card-text>

          <v-card-actions class="pa-6">
            <v-btn @click="handlePayment" :loading="loading" size="x-large" color="primary" variant="flat" block>
              Оплатить и получить доступ
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>