<script setup lang="ts">
import type { VForm } from 'vuetify/components';
import type { JobFormFillRequest, JobFormFillRequestDB } from '~/types/job-form-fill-request.interface';

definePageMeta({
  middleware: "employee"
});

// --- Инициализация ---
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
const startTime = ref<string | null>(null);
const endTime = ref<string | null>(null);

// --- Логика режима формы (Создание vs Редактирование) ---
const requestIdFromQuery = ref(route.query.request_id as string | null);
const requestToEdit = ref<JobFormFillRequestDB | null>(null);
const isEditMode = computed(() => !!requestToEdit.value);

// --- Опции для полей выбора ---
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

const allTimeOptions = computed(() => {
  const options = [];
  for (let i = 9; i <= 21; i++) {
    options.push(`${String(i).padStart(2, '0')}:00`);
  }
  return options;
});

const endTimeOptions = computed(() => {
  if (!startTime.value) {
    return allTimeOptions.value.slice(1);
  }
  const startIndex = allTimeOptions.value.indexOf(startTime.value);
  return allTimeOptions.value.slice(startIndex + 1);
});

// --- Наблюдатели и правила ---
watch(startTime, (newStartTime) => {
  if (endTime.value && newStartTime && endTime.value <= newStartTime) {
    endTime.value = null;
  }
});

const jobRules = [(v: string | null) => !!v || 'Необходимо выбрать направление'];
const dateRules = [(v: Date | null) => !!v || 'Необходимо выбрать дату'];
const startTimeRules = [(v: string | null) => !!v || 'Укажите время начала'];
const endTimeRules = [
  (v: string | null) => !!v || 'Укажите время окончания',
  (v: string | null) => {
    if (startTime.value && v && v <= startTime.value) {
      return 'Время окончания должно быть позже времени начала';
    }
    return true;
  }
];

// --- Логика отправки ---
async function submitRequest() {
  if (!form.value || !user.value?._id) return;
  const { valid } = await form.value.validate();

  if (valid && selectedDate.value && startTime.value && endTime.value && selectedJob.value) {
    loading.value = true;
    try {
      const finalStartDateTime = new Date(selectedDate.value);
      const [startHours] = startTime.value.split(':');
      finalStartDateTime.setHours(parseInt(startHours), 0, 0, 0);

      const finalEndDateTime = new Date(selectedDate.value);
      const [endHours] = endTime.value.split(':');
      finalEndDateTime.setHours(parseInt(endHours), 0, 0, 0);

      let toSend: JobFormFillRequest = {
        employee: user.value._id,
        job: selectedJob.value,
        startDate: String(finalStartDateTime.toISOString()),
        endDate: String(finalEndDateTime.toISOString())
      }

      if (isEditMode.value && requestToEdit.value) {
        // РЕЖИМ РЕДАКТИРОВАНИЯ
        await updateJobFormFillRequest(requestToEdit.value._id, toSend);
      } else {
        // РЕЖИМ СОЗДАНИЯ
        await createJobFormFillRequest(toSend);
      }

      await router.push('/me');

    } catch (error) {
      console.error("Ошибка при отправке заявки:", error);
      // Здесь можно добавить уведомление об ошибке для пользователя
    } finally {
      loading.value = false;
    }
  }
}

// --- Жизненный цикл ---
onMounted(async () => {
  if (requestIdFromQuery.value) {
    // Если в URL есть ID, пытаемся загрузить эту заявку для редактирования
    const foundRequest = await getRequestById(requestIdFromQuery.value);
    if (foundRequest) {
      requestToEdit.value = foundRequest;
      selectedJob.value = foundRequest.job; // Автозаполнение
    } else {
      console.warn("Заявка для редактирования не найдена, форма работает в режиме создания.");
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
            Выберите удобный день и диапазон времени для связи.
          </v-card-subtitle>
          <v-divider class="mt-2"></v-divider>

          <v-card-text>
            <v-form ref="form" @submit.prevent="submitRequest">
              <v-select v-model="selectedJob" :items="jobItems" :rules="jobRules" label="Направление" variant="outlined"
                class="mb-4" required></v-select>

              <v-select v-model="selectedDate" :items="dateOptions" :rules="dateRules" item-title="title"
                item-value="value" label="Удобный день" variant="outlined" class="mb-4" required></v-select>

              <v-row>
                <v-col cols="12" sm="6">
                  <v-select v-model="startTime" :items="allTimeOptions" :rules="startTimeRules" label="Время С"
                    variant="outlined" required></v-select>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-select v-model="endTime" :items="endTimeOptions" :rules="endTimeRules" label="Время ПО"
                    variant="outlined" :disabled="!startTime" required
                    no-data-text="Сначала выберите время начала"></v-select>
                </v-col>
              </v-row>

              <v-btn type="submit" :loading="loading" color="primary" size="large" block class="mt-4">
                Отправить заявку
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>