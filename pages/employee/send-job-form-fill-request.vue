<script setup lang="ts">
import type { VForm } from 'vuetify/components';
import type { JobFormFillRequest, JobFormFillRequestDB } from '~/types/job-form-fill-request.interface';

definePageMeta({
  middleware: "employee"
});

const requestsStore = useEmployeeJobFormFillRequest();
const authStore = useAuth();
const router = useRouter();
const route = useRoute();

const { user } = storeToRefs(authStore);
const { createJobFormFillRequest, updateJobFormFillRequest, getRequestById } = requestsStore;
const { jobItems } = useAppConst();

// --- Состояние формы ---
const form = ref<VForm | null>(null);
const loading = ref(false);
const selectedJob = ref<string | null>(null);
const selectedDate = ref<Date | null>(null);
const selectedStartTime = ref<string | null>(null);

const requestIdFromQuery = ref(route.query.request_id as string | null);
const requestToEdit = ref<JobFormFillRequestDB | null>(null);
const isEditMode = computed(() => !!requestToEdit.value);

// --- Опции дат ---
const dateOptions = computed(() => {
  const options = [];
  const today = new Date();
  const labels = ['Сегодня', 'Завтра', 'Послезавтра'];
  for (let i = 0; i < 3; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const formattedDate = date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
    options.push({ title: `${labels[i]}, ${formattedDate}`, value: date });
  }
  return options;
});

// --- Проверка, прошёл ли слот ---
function isSlotInPast(slot: string, date: Date | null): boolean {
  if (!date) return false;

  const now = new Date();
  const slotDate = new Date(date);
  const [hours, minutes] = slot.split(':').map(Number);
  slotDate.setHours(hours, minutes, 0, 0);

  return slotDate < now;
}

// --- Группировка временных слотов с фильтрацией ---
const groupedTimeSlots = computed(() => {
  if (!selectedDate.value) return [];

  const slots = [];
  const startHour = 9;
  const endHour = 21;
  for (let hour = startHour; hour < endHour; hour++) {
    slots.push(`${String(hour).padStart(2, '0')}:00`);
    slots.push(`${String(hour).padStart(2, '0')}:30`);
  }

  // Фильтруем прошедшие слоты
  const availableSlots = slots.filter(slot => !isSlotInPast(slot, selectedDate.value));

  const morning = [] as string[];
  const day = [] as string[];
  const evening = [] as string[];

  for (const slot of availableSlots) {
    const hour = parseInt(slot.split(':')[0], 10);
    if (hour >= 9 && hour < 12) {
      morning.push(slot);
    } else if (hour >= 12 && hour < 18) {
      day.push(slot);
    } else if (hour >= 18 && hour < 21) {
      evening.push(slot);
    }
  }

  return [
    { title: 'Утро', slots: morning, color: 'blue' },
    { title: 'День', slots: day, color: 'green' },
    { title: 'Вечер', slots: evening, color: 'indigo' },
  ]
});

// --- Правила валидации ---
const jobRules = [(v: string | null) => !!v || 'Необходимо выбрать направление'];
const dateRules = [(v: Date | null) => !!v || 'Необходимо выбрать дату'];
const timeRules = [(v: string | null) => !!v || 'Выберите время начала'];

// --- Расчёт окончания ---
function calculateEndTime(startTime: string): string {
  const [hours, minutes] = startTime.split(':').map(Number);
  let endMinutes = minutes + 30;
  let endHours = hours;
  if (endMinutes >= 60) {
    endMinutes -= 60;
    endHours += 1;
  }
  return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
}

// --- Отправка ---
async function submitRequest() {
  if (!form.value || !user.value?._id || !selectedStartTime.value) return;
  const { valid } = await form.value.validate();

  if (valid && selectedDate.value && selectedJob.value) {
    loading.value = true;
    try {
      const startDate = new Date(selectedDate.value);
      const [startHours, startMinutes] = selectedStartTime.value.split(':').map(Number);
      startDate.setHours(startHours, startMinutes, 0, 0);

      const endDate = new Date(startDate);
      const endTime = calculateEndTime(selectedStartTime.value);
      const [endHours, endMinutes] = endTime.split(':').map(Number);
      endDate.setHours(endHours, endMinutes, 0, 0);

      let toSend: JobFormFillRequest = {
        employee: user.value._id,
        job: selectedJob.value,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        manager: null
      };

      if (isEditMode.value && requestToEdit.value) {
        await updateJobFormFillRequest(requestToEdit.value._id, toSend);
      } else {
        await createJobFormFillRequest(toSend);
      }

      await router.push('/me');
    } catch (error) {
      console.error("Ошибка при отправке заявки:", error);
    } finally {
      loading.value = false;
    }
  }
}

onMounted(async () => {
  if (requestIdFromQuery.value) {
    const foundRequest = await getRequestById(requestIdFromQuery.value);
    if (foundRequest) {
      requestToEdit.value = foundRequest;
      selectedJob.value = foundRequest.job;
      if (foundRequest.startDate) {
        selectedDate.value = new Date(foundRequest.startDate);
        const start = new Date(foundRequest.startDate);
        selectedStartTime.value = `${String(start.getHours()).padStart(2, '0')}:${String(start.getMinutes()).padStart(2, '0')}`;
      }
    }
  }
});
</script>
<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card>
          <v-card-title class="text-h5 font-weight-bold">
            {{ isEditMode ? 'Завершение заявки' : 'Новая заявка на интервью' }}
          </v-card-title>
          <v-card-subtitle>
            Выберите удобный день и время для связи (интервью длится 30 минут).
          </v-card-subtitle>
          <v-divider class="mt-2"></v-divider>

          <v-card-text>
            <v-form ref="form" @submit.prevent="submitRequest">
              <v-select v-model="selectedJob" :items="jobItems" :rules="jobRules" label="Направление" variant="outlined"
                class="mb-4" required></v-select>

              <v-select v-model="selectedDate" :items="dateOptions" :rules="dateRules" item-title="title"
                item-value="value" label="Удобный день" variant="outlined" class="mb-6" required></v-select>

              <!-- Выбор времени по категориям -->
              <div v-if="selectedDate">
                <p class="text-h6 font-weight-medium mb-3">Выберите время начала</p>

                <div v-for="group in groupedTimeSlots" :key="group.title" class="mb-6">
                  <h3 class="text-h6 font-weight-bold mb-2 text-capitalize" :class="`text-${group.color}`">
                    {{ group.title }}
                  </h3>
                  <div v-if="group.slots.length > 0" class="d-flex flex-wrap gap-3 justify-center">
                    <v-btn v-for="slot in group.slots" :key="slot"
                      :color="selectedStartTime === slot ? group.color : 'black'" variant="tonal" size="x-large"
                      min-width="100" rounded @click="selectedStartTime = slot" class="text-body-1 font-weight-bold">
                      {{ slot }}
                    </v-btn>
                  </div>
                  <v-alert v-else type="info" density="compact" variant="tonal">
                    На это время нет доступных слотов.
                  </v-alert>
                </div>

                <div class="mt-2 mb-4">
                  <v-alert v-if="!selectedStartTime && groupedTimeSlots.some(g => g.slots.length > 0)" type="error"
                    density="compact" variant="tonal">
                    {{ timeRules[0](selectedStartTime) }}
                  </v-alert>
                </div>
              </div>

              <v-btn type="submit" :loading="loading" color="primary" size="x-large" block class="mt-2"
                :disabled="!selectedStartTime">
                Отправить заявку
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>