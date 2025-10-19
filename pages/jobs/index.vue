<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core';

definePageMeta({
  middleware: ["can-view-jobs"]
})

const jobsStore = useEmployerJobs()
const filtersStore = useJobFormsFilters()
const {
  selectedJob,
  selectedExperience,
  selectedWorkFormat,
  salaryFrom,
  salaryTo,
  clearFilters, applyFilters } = filtersStore;

const { jobs } = jobsStore

const { jobItems, experienceOptions, workFormatOptions, jobColors } = useAppConst()

const dialog = ref(false);
const showFab = ref(false);
const initialFiltersRef = ref<HTMLElement | null>(null);

function applyAndClose() {
  dialog.value = false;
  applyFilters()
}

// Function to get the actual color value based on job type
const getJobColor = (jobType: string | null) => {
  if (!jobType)
    return undefined;

  const colorKey = jobColors[jobType] || '';
  if (colorKey === 'primary') return '#1e8d99';
  if (colorKey === 'secondary') return '#894eff';
  return colorKey || undefined;
};

useIntersectionObserver(
  initialFiltersRef,
  ([{ isIntersecting }]) => {
    // Показываем кнопку, когда элемент НЕ виден на экране
    showFab.value = !isIntersecting;
  },
  { threshold: 0 }
);

await jobsStore.getAll()
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="text-center mb-8">
        <h1 class="text-h3 font-weight-bold">Анкеты</h1>
        <p class="text-h6 text-medium-emphasis mt-2">
          Найдите соискателя мечты среди лучших предложений.
        </p>
      </v-col>
    </v-row>

    <v-row class="d-flex justify-center">
      <v-col cols="12" md="8" lg="6" xl="5">
        <v-card ref="initialFiltersRef" class="mb-8">
          <v-card-text>
            <v-row align="center">
              <v-col cols="12" md="12">
                <v-autocomplete v-model="selectedJob" :items="jobItems" label="Должность" variant="outlined"
                  density="comfortable" clearable hide-details></v-autocomplete>
              </v-col>
              <v-col cols="12" md="6">
                <v-select v-model="selectedExperience" :items="experienceOptions" label="Опыт работы" variant="outlined"
                  density="comfortable" clearable hide-details></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-select v-model="selectedWorkFormat" :items="workFormatOptions" label="Формат работы"
                  variant="outlined" density="comfortable" clearable hide-details></v-select>
              </v-col>
              <v-col cols="12">
                <p class="text-h6">Зарплата</p>
              </v-col>
              <!-- <v-col cols="6">
                <v-text-field v-model.number="salaryFrom" label="От" :step="1000" variant="outlined" type="number"
                  prefix="₽"></v-text-field>
              </v-col> -->
              <v-col cols="12">
                <v-text-field v-model.number="salaryTo" label="До" :step="1000" variant="outlined" type="number"
                  prefix="₽"></v-text-field>
              </v-col>
              <v-col cols="12" class="d-flex">
                <v-btn @click="clearFilters" variant="tonal" :color="getJobColor(selectedJob)"
                  prepend-icon="mdi-close">Сбросить фильтры</v-btn>
                <v-spacer></v-spacer>
                <v-btn @click="applyFilters" :color="getJobColor(selectedJob)" variant="flat">Применить</v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-if="jobs && jobs.length > 0" class="d-flex flex-column align-center justify-center">
      <v-col v-for="job in jobs" :key="job._id" cols="12" md="8" lg="6" xl="5">
        <v-card class="d-flex flex-column" height="100%" hover :style="getJobColor(job.job) ? {
          'box-shadow': `0 4px 20px ${getJobColor(job.job)}40, 0 0 0 2px ${getJobColor(job.job)}40`
        } : {}">
          <v-responsive v-if="job.video && job.video.src" :aspect-ratio="16 / 9">
            <video :src="job.video.src" style="width: 100%; height: 100%; object-fit: cover;" controls></video>
          </v-responsive>

          <v-divider v-if="job.video && job.video.src"></v-divider>

          <div class="d-flex flex-column flex-grow-1">
            <v-card-title class="font-weight-medium text-h4">{{ job.job }}</v-card-title>
            <v-card-subtitle>{{ job.fullName }}</v-card-subtitle>
            <v-card-text class="py-2">
              <div class="d-flex flex-wrap ga-2">
                <v-chip v-if="job.salaryFrom || job.salaryTo" color="green" size="large" variant="tonal"
                  prepend-icon="mdi-cash">
                  <span v-if="job.salaryFrom">от {{ job.salaryFrom.toLocaleString('ru-RU') }}₽</span>
                  <span v-if="job.salaryTo">до {{ job.salaryTo.toLocaleString('ru-RU') }}₽</span>
                </v-chip>
                <v-chip v-if="job.experience && job.experience != 'не указан'" color="blue" size="large" variant="tonal"
                  prepend-icon="mdi-briefcase-clock-outline">
                  {{ job.experience }}
                </v-chip>
                <v-chip v-if="job.workFormat && job.workFormat != 'не указан'" color="purple" size="large"
                  variant="tonal" prepend-icon="mdi-laptop">
                  {{ job.workFormat }}
                </v-chip>
              </div>
            </v-card-text>

            <v-card-text class="flex-grow-1">
              <p class="job-description">{{ job.coverLetter }}</p>
            </v-card-text>

            <v-card-actions class="pa-4">
              <v-spacer></v-spacer>
              <v-btn :to="`/jobs/${job._id}`" :color="getJobColor(job.job)" variant="flat">
                Подробнее
              </v-btn>
            </v-card-actions>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col cols="12">
        <v-sheet rounded="lg" border class="d-flex align-center justify-center text-center pa-10" min-height="400">
          <div>
            <v-icon icon="mdi-briefcase-search-outline" size="64" color="grey"></v-icon>
            <div class="text-h5 font-weight-medium mt-4">Анкет пока нет</div>
            <p class="text-body-1 text-medium-emphasis mt-2">
              Как только появятся новые предложения, они будут отображены здесь.
            </p>
          </div>
        </v-sheet>
      </v-col>
    </v-row>

    <v-fab-transition>
      <v-btn v-if="showFab" @click="dialog = true" icon="mdi-filter-variant" :color="getJobColor(selectedJob)"
        position="fixed" size="large" class="fab-header-offset" elevation="8" title="Открыть фильтры"></v-btn>
    </v-fab-transition>

    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title class="d-flex align-center">
          <v-icon start>mdi-filter-variant</v-icon>
          Фильтры
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-autocomplete v-model="selectedJob" :items="jobItems" label="Должность" variant="outlined" clearable
            class="mb-4"></v-autocomplete>
          <v-select v-model="selectedExperience" :items="experienceOptions" label="Опыт работы" variant="outlined"
            clearable class="mb-4"></v-select>
          <v-select v-model="selectedWorkFormat" :items="workFormatOptions" label="Формат работы" variant="outlined"
            clearable class="mb-4"></v-select>
          <p class="text-subtitle-1 font-weight-medium">Зарплата</p>
          <div class="d-flex ga-2">
            <v-text-field v-model.number="salaryFrom" :step="1000" label="От" variant="outlined" type="number"
              prefix="₽"></v-text-field>
            <v-text-field v-model.number="salaryTo" :step="1000" label="До" variant="outlined" type="number"
              prefix="₽"></v-text-field>
          </div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn @click="clearFilters" size="large" :color="getJobColor(selectedJob)" variant="tonal">Сбросить</v-btn>
          <v-spacer></v-spacer>
          <v-btn @click="applyAndClose" size="large" :color="getJobColor(selectedJob)" variant="flat">Применить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>
.job-description {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.5em;
  max-height: 6em;
}

.fab-header-offset {
  top: 80px;
  right: 20px;
  margin: 12px;
}
</style>
