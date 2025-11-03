<script setup lang="ts">
definePageMeta({
  middleware: "employer"
})

const employerStore = useEmployer()
let { jobFormsHistory } = employerStore

const loading = ref(true);

onMounted(async () => {
  if (jobFormsHistory.value.length == 0) {
    await employerStore.getJobFormsHistory()
  }
  loading.value = false;
})
</script>
<template>
  <v-container>
    <h1 class="text-h4 font-weight-bold mb-6">История бронирования анкет</h1>

    <v-row v-if="loading" class="mt-10">
      <v-col class="text-center">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
        <p class="mt-4 text-medium-emphasis">Загружаем историю...</p>
      </v-col>
    </v-row>

    <v-row v-else-if="jobFormsHistory.length > 0">
      <v-col v-for="item in jobFormsHistory" :key="item._id" cols="12" md="6" lg="4" xl="3">
        <EmployerJobReservationHistoryCard :job-reservation="item" />
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col>
        <v-sheet min-height="400" class="d-flex align-center justify-center text-center" rounded="lg" border>
          <div>
            <v-icon icon="mdi-history" size="64" color="grey"></v-icon>
            <div class="text-h5 mt-4">История просмотров пуста</div>
            <p class="text-medium-emphasis">
              Когда вы просмотрите анкету кандидата, она появится здесь.
            </p>
            <v-btn to="/" color="primary" variant="flat" class="mt-4">
              Найти анкеты
            </v-btn>
          </div>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>