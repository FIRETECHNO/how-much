<script setup lang="ts">
let { subscriptionStatus, manuallyCheckSubscriptionStatus } = useSubscription()

</script>
<template>
  <v-row>
    <v-col cols="12" md="4" v-if="subscriptionStatus == 'active'">
      <v-card to="/" class="mb-6">
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
    </v-col>
    <v-col cols="12" md="4" v-else-if="subscriptionStatus == 'pending'">
      <v-card class="mb-6 fill-height" variant="tonal">
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

</template>