<script setup lang="ts">
definePageMeta({
  middleware: "can-view-jobs"
})

const jobsStore = useJobs()

const { jobs } = jobsStore

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

    <v-row v-if="jobs && jobs.length > 0" class="d-flex flex-column align-center justify-center">
      <v-col v-for="job in jobs" :key="job._id" cols="12" md="8" lg="6" xl="5">
        <v-card class="d-flex flex-column" height="100%" hover>
          <v-responsive v-if="job.video && job.video.src" :aspect-ratio="16 / 9">
            <video :src="job.video.src" style="width: 100%; height: 100%; object-fit: cover;" controls></video>
          </v-responsive>

          <v-divider v-if="job.video && job.video.src"></v-divider>

          <div class="d-flex flex-column flex-grow-1">
            <v-card-title class="font-weight-bold">{{ job.job }}</v-card-title>
            <v-card-subtitle>{{ job.fullName }}</v-card-subtitle>

            <v-card-text class="flex-grow-1">
              <p class="job-description">{{ job.coverLetter }}</p>
            </v-card-text>

            <v-card-actions class="pa-4">
              <v-spacer></v-spacer>
              <v-btn :to="`/jobs/${job._id}`" color="primary" variant="flat">
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
</style>