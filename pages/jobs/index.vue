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

/** Символ рубля для полей зарплаты (\u20BD) */
const ruble = '\u20BD'

const dialog = ref(false);
const showFab = ref(false);
const initialFiltersRef = ref<HTMLElement | null>(null);

function applyAndClose() {
  dialog.value = false;
  applyFilters()
}

const getJobColor = (jobType: string | null) => {
  if (!jobType)
    return undefined;

  const colorKey = jobColors[jobType] || '';
  if (colorKey === 'primary') return '#1e8d99';
  if (colorKey === 'secondary') return '#894eff';
  return colorKey || undefined;
};

const filterAccentColor = computed(() => getJobColor(selectedJob.value) ?? 'primary')

useIntersectionObserver(
  initialFiltersRef,
  ([{ isIntersecting }]) => {
    showFab.value = !isIntersecting;
  },
  { threshold: 0 }
);

await jobsStore.getAll()
</script>

<template>
  <div class="jobs-page">
    <v-container class="py-6 py-md-10">
      <header class="jobs-hero text-center mb-8 mb-md-10">
        <v-chip size="small" variant="tonal" color="primary" class="jobs-hero__badge mb-4">
          Каталог кандидатов
        </v-chip>
        <h1 class="text-h4 text-sm-h3 font-weight-bold jobs-hero__title">
          Анкеты
        </h1>
        <p class="jobs-hero__lead text-body-1 text-md-h6 text-medium-emphasis mt-3 mb-0 mx-auto">
          Видео-визитки и фильтры по должности, опыту и формату — чтобы быстрее найти подходящего человека.
        </p>
      </header>

      <v-row class="d-flex justify-center">
        <v-col cols="12">
          <v-card
            ref="initialFiltersRef"
            class="jobs-filters"
            elevation="2"
            rounded="xl"
          >
            <v-card-title class="jobs-filters__title text-subtitle-1 font-weight-bold pt-6 px-6 pb-0 d-flex align-center ga-2">
              <v-icon icon="mdi-filter-variant" color="primary" size="22" />
              Параметры поиска
            </v-card-title>
            <v-card-text class="pa-6">
              <v-row class="d-flex align-end" dense>
                <v-col cols="12" sm="6" md="3">
                  <p class="text-body-2 font-weight-medium mb-1">Должность</p>
                  <v-autocomplete
                    v-model="selectedJob"
                    :items="jobItems"
                    variant="outlined"
                    density="comfortable"
                    color="primary"
                    hide-details
                    clearable
                  />
                </v-col>
                <v-col cols="12" sm="6" md="3">
                  <p class="text-body-2 font-weight-medium mb-1">Опыт работы</p>
                  <v-select
                    v-model="selectedExperience"
                    :items="experienceOptions"
                    variant="outlined"
                    density="comfortable"
                    color="primary"
                    hide-details
                    clearable
                  />
                </v-col>
                <v-col cols="12" sm="6" md="3">
                  <p class="text-body-2 font-weight-medium mb-1">Формат работы</p>
                  <v-select
                    v-model="selectedWorkFormat"
                    :items="workFormatOptions"
                    variant="outlined"
                    density="comfortable"
                    color="primary"
                    hide-details
                    clearable
                  />
                </v-col>
                <v-col cols="12" sm="6" md="3">
                  <p class="text-body-2 font-weight-medium mb-1">Зарплата, до</p>
                  <v-text-field
                    v-model.number="salaryTo"
                    :step="1000"
                    variant="outlined"
                    type="number"
                    :prefix="ruble"
                    density="comfortable"
                    color="primary"
                    hide-details
                  />
                </v-col>
                <v-col cols="12" class="d-flex flex-wrap justify-end ga-2 pt-2">
                  <v-btn
                    variant="tonal"
                    :color="filterAccentColor"
                    prepend-icon="mdi-filter-off-outline"
                    class="jobs-filters__btn"
                    @click="clearFilters"
                  >
                    Сбросить
                  </v-btn>
                  <v-btn
                    :color="filterAccentColor"
                    variant="flat"
                    prepend-icon="mdi-magnify"
                    class="jobs-filters__btn"
                    @click="applyFilters"
                  >
                    Найти
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row v-if="jobs && jobs.length > 0" class="jobs-list justify-center">
        <v-col v-for="job in jobs" :key="job._id" cols="12" md="8" lg="6" xl="5">
          <v-card
            class="job-card"
            rounded="xl"
            elevation="3"
            hover
          >
            <div
              v-if="getJobColor(job.job)"
              class="job-card__stripe"
              :style="{ background: getJobColor(job.job) }"
            />
            <div v-else class="job-card__stripe job-card__stripe--default" />

            <v-responsive v-if="job.video && job.video.src" :aspect-ratio="16 / 9" class="job-card__media">
              <video
                :src="job.video.src"
                class="job-card__video"
                controls
              />
            </v-responsive>

            <v-divider v-if="job.video && job.video.src" />

            <div class="d-flex flex-column flex-grow-1 pa-2">
              <v-card-title class="job-card__title font-weight-bold text-h5 pt-4 px-4">
                {{ job.job }}
              </v-card-title>
              <v-card-subtitle class="px-4 pb-0 text-body-1">
                {{ job.fullName }}
              </v-card-subtitle>
              <v-card-text class="py-3 px-4">
                <div class="d-flex flex-wrap ga-2">
                  <v-chip
                    v-if="job.salaryFrom || job.salaryTo"
                    color="success"
                    size="large"
                    variant="tonal"
                    prepend-icon="mdi-cash"
                  >
                    <span v-if="job.salaryFrom">от {{ job.salaryFrom.toLocaleString('ru-RU') }}{{ ruble }}</span>
                    <span v-if="job.salaryTo">до {{ job.salaryTo.toLocaleString('ru-RU') }}{{ ruble }}</span>
                  </v-chip>
                  <v-chip
                    v-if="job.experience && job.experience != 'не указан'"
                    color="info"
                    size="large"
                    variant="tonal"
                    prepend-icon="mdi-briefcase-clock-outline"
                  >
                    {{ job.experience }}
                  </v-chip>
                  <v-chip
                    v-if="job.workFormat && job.workFormat != 'не указан'"
                    color="deep-purple"
                    size="large"
                    variant="tonal"
                    prepend-icon="mdi-laptop"
                  >
                    {{ job.workFormat }}
                  </v-chip>
                </div>
              </v-card-text>

              <v-card-text class="flex-grow-1 px-4 pt-0">
                <p class="job-description text-body-2 text-medium-emphasis">
                  {{ job.coverLetter }}
                </p>
              </v-card-text>

              <v-card-actions class="pa-4 pt-0">
                <v-spacer />
                <v-btn
                  :to="`/jobs/${job._id}`"
                  :color="getJobColor(job.job) || 'primary'"
                  variant="flat"
                  rounded="lg"
                  size="large"
                  append-icon="mdi-arrow-right"
                >
                  Подробнее
                </v-btn>
              </v-card-actions>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <v-row v-else>
        <v-col cols="12">
          <v-sheet class="jobs-empty" rounded="xl" border>
            <div class="jobs-empty__inner text-center pa-10 pa-md-12">
              <div class="jobs-empty__icon-wrap mx-auto mb-6">
                <v-icon icon="mdi-briefcase-search-outline" size="48" color="primary" />
              </div>
              <h2 class="text-h5 font-weight-bold">Анкет пока нет</h2>
              <p class="text-body-1 text-medium-emphasis mt-3 mb-0 mx-auto jobs-empty__text">
                Измените фильтры или зайдите позже — новые кандидаты появляются регулярно.
              </p>
            </div>
          </v-sheet>
        </v-col>
      </v-row>

      <v-fab-transition>
        <v-btn
          v-if="showFab"
          icon="mdi-filter-variant"
          :color="filterAccentColor"
          position="fixed"
          size="large"
          class="fab-header-offset"
          elevation="8"
          title="Открыть фильтры"
          @click="dialog = true"
        />
      </v-fab-transition>

      <v-dialog v-model="dialog" max-width="560" scrollable>
        <v-card rounded="xl">
          <v-card-title class="d-flex align-center pa-5 pb-4">
            <v-icon start color="primary">mdi-filter-variant</v-icon>
            <span class="text-h6 font-weight-bold">Фильтры</span>
          </v-card-title>
          <v-divider />
          <v-card-text class="pa-5">
            <v-autocomplete
              v-model="selectedJob"
              :items="jobItems"
              label="Должность"
              variant="outlined"
              color="primary"
              clearable
              class="mb-4"
            />
            <v-select
              v-model="selectedExperience"
              :items="experienceOptions"
              label="Опыт работы"
              variant="outlined"
              color="primary"
              clearable
              class="mb-4"
            />
            <v-select
              v-model="selectedWorkFormat"
              :items="workFormatOptions"
              label="Формат работы"
              variant="outlined"
              color="primary"
              clearable
              class="mb-4"
            />
            <p class="text-subtitle-2 font-weight-medium mb-2">Зарплата</p>
            <div class="d-flex ga-3 flex-column flex-sm-row">
              <v-text-field
                v-model.number="salaryFrom"
                :step="1000"
                label="От"
                variant="outlined"
                type="number"
                :prefix="ruble"
                color="primary"
                hide-details
                class="flex-grow-1"
              />
              <v-text-field
                v-model.number="salaryTo"
                :step="1000"
                label="До"
                variant="outlined"
                type="number"
                :prefix="ruble"
                color="primary"
                hide-details
                class="flex-grow-1"
              />
            </div>
          </v-card-text>
          <v-divider />
          <v-card-actions class="pa-4 ga-2 flex-wrap">
            <v-btn
              variant="tonal"
              :color="filterAccentColor"
              size="large"
              prepend-icon="mdi-filter-off-outline"
              @click="clearFilters"
            >
              Сбросить
            </v-btn>
            <v-spacer />
            <v-btn
              :color="filterAccentColor"
              variant="flat"
              size="large"
              prepend-icon="mdi-check"
              @click="applyAndClose"
            >
              Применить
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>

<style scoped lang="scss">
.jobs-page {
  min-height: 100%;
}

.jobs-hero__lead {
  max-width: 36rem;
}

.jobs-filters {
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

.jobs-filters__title {
  color: rgb(var(--v-theme-on-surface));
}

.jobs-filters__btn {
  text-transform: none;
  letter-spacing: normal;
}

.jobs-list {
  margin-top: 0.5rem;
}

.job-card {
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08) !important;
  }

  &__stripe {
    height: 4px;
    width: 100%;

    &--default {
      background: linear-gradient(
        90deg,
        rgb(var(--v-theme-primary)),
        rgba(var(--v-theme-primary), 0.5)
      );
    }
  }

  &__media {
    background: rgb(var(--v-theme-surface-variant));
  }

  &__video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  &__title {
    line-height: 1.25;
  }
}

.job-description {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.5;
  max-height: 6em;
}

.jobs-empty {
  min-height: 360px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(var(--v-theme-primary), 0.04);
  border-color: rgba(var(--v-theme-on-surface), 0.08) !important;
}

.jobs-empty__icon-wrap {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(var(--v-theme-primary), 0.12);
}

.jobs-empty__text {
  max-width: 26rem;
}

.fab-header-offset {
  top: 80px;
  right: 20px;
  margin: 12px;
}
</style>
