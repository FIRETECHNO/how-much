<script setup lang="ts">
definePageMeta({
  middleware: "employee",
});

const jobsStore = useEmployeeJobForms();

let { actualJobReservation } = jobsStore

const loading = ref(true);
const feedbackSubmitted = ref(false);
const isSubmitting = ref(false);

const route = useRoute()

const reservationId = route.params.reservationId as string;

const { jobReservationFeedbackOptions } = useAppConst()

const systemMessage = {
  _id: 'system-01',
  isIncoming: true,
  author: 'Администратор',
  text: 'Здравствуйте! Здесь вы можете оставить отзыв по забронированной анкете. Какой результат вашей встречи с соискателем?',
};

let userMessage = computed(() => {
  if (actualJobReservation.value.employeeFeedback?.textContent)
    return {
      _id: "user-01",
      isIncoming: false,
      author: "Вы",
      text: actualJobReservation.value.employeeFeedback?.textContent
    }
  return {
    _id: "user-01",
    isIncoming: false,
    author: "Вы",
    text: ""
  }
})

async function submitFeedback(feedback: string) {
  if (!actualJobReservation.value) return;

  isSubmitting.value = true;
  try {
    await jobsStore.submitJobReservationFeedback(actualJobReservation.value._id, feedback);
    feedbackSubmitted.value = true;
  } catch (error) {
    console.error("Ошибка при отправке отзыва:", error);
  } finally {
    isSubmitting.value = false;
  }
}

onMounted(async () => {
  try {
    await jobsStore.getActualReservedJob(reservationId);
    if (actualJobReservation.value?.employeeFeedback?.textContent) {
      feedbackSubmitted.value = true;
    }
  } catch (error) {
    console.error("Ошибка при загрузке данных о резервации:", error);
  } finally {
    loading.value = false;
  }
});
</script>
<template>
  <v-container fluid class="fill-height">
    <v-row class="d-flex justify-center align-center fill-height">
      <v-col cols="12" md="8" xl="6" class="d-flex flex-column">

        <div v-if="loading" class="text-center">
          <v-progress-circular indeterminate size="64"></v-progress-circular>
          <p class="mt-4">Загрузка данных о бронировании...</p>
        </div>

        <v-sheet v-else-if="!actualJobReservation" rounded="lg"
          class="d-flex align-center justify-center text-center pa-10 fill-height">
          <div>
            <v-icon icon="mdi-calendar-search" size="64" color="grey"></v-icon>
            <div class="text-h5 mt-4">Активных бронирований нет</div>
            <p class="text-medium-emphasis mt-2">
              Чтобы оставить отзыв, сначала дождитесь отклика Работодателя.
            </p>
            <v-btn to="/employee/job-reservations" color="primary" variant="flat" class="mt-4">
              К моим работодателям
            </v-btn>
          </div>
        </v-sheet>

        <div v-else class="d-flex flex-column">
          <EmployeeJobFormCardShort :reservation="actualJobReservation" />

          <v-sheet class="d-flex flex-column fill-height rounded-lg elevation-0 my-5" border style="min-height: 50vh">
            <v-divider></v-divider>

            <v-card-text class="flex-grow-1 overflow-y-auto">
              <p class="text-h4 font-weight-medium mb-4">Обратная связь</p>

              <ChatMessageIncoming :message="systemMessage" />
              <ChatMessageOutgoing v-if="feedbackSubmitted" :message="userMessage" />
            </v-card-text>
            <v-card-actions class="pa-4">
              <div v-if="!feedbackSubmitted" class="d-flex flex-wrap ga-2 w-100 justify-end">
                <v-btn v-for="option in jobReservationFeedbackOptions" :key="option" @click="submitFeedback(option)"
                  :loading="isSubmitting" color="blue-lighten-1" variant="tonal" size="x-large">
                  {{ option }}
                </v-btn>
              </div>
              <v-alert v-else type="success" text="Спасибо за ваш отзыв!" variant="tonal" density="compact"
                class="w-100"></v-alert>
            </v-card-actions>
          </v-sheet>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped lang="scss">
.hints-floating {
  position: absolute;
  bottom: 100%;
  right: 16px;
  z-index: 1000;
  display: flex;
  flex-wrap: wrap;
  padding: 8px 16px;
  overflow-y: auto;
}
</style>