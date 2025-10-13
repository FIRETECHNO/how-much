<script setup lang="ts">
import type { JobForm } from '~/types/job-form.interface';

definePageMeta({
  middleware: "admin"
})

const activeTab = ref('active');

const jobsAdminStore = useAdminJobs();
const { jobForms } = jobsAdminStore;
const { BOOST_DELTA } = useEmployeeJobForms()

let activeForms = ref<JobForm[]>([])
let onModerationForms = ref<JobForm[]>([])
let archiveForms = ref<JobForm[]>([])

watch(jobForms, (newForms) => {
  for (let f of newForms) {
    let fDate = new Date(f.lastRaiseDate)
    let currentDate = new Date()

    let delta = currentDate.getTime() - fDate.getTime();
    if (f.isApproved) {
      if (delta >= BOOST_DELTA) {
        archiveForms.value.push(f)
      } else {
        activeForms.value.push(f)
      }
    } else {
      onModerationForms.value.push(f)
    }
  }
})

onMounted(async () => {
  await jobsAdminStore.getJobs();
})
</script>
<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <BackButton :button-text="'Назад'"></BackButton>
      </v-col>

      <v-col cols="12">
        <v-btn-toggle v-model="activeTab" mandatory variant="outlined" color="primary" class="w-100">
          <v-btn value="active" class="flex-grow-1">
            <v-icon start>mdi-check-circle-outline</v-icon>
            Активные ({{ activeForms.length }})
          </v-btn>
          <v-btn value="moderation" class="flex-grow-1">
            <v-icon start>mdi-clock-outline</v-icon>
            На рассмотрении ({{ onModerationForms.length }})
          </v-btn>
          <v-btn value="archive" class="flex-grow-1">
            <v-icon start>mdi-archive-outline</v-icon>
            В архиве ({{ archiveForms.length }})
          </v-btn>
        </v-btn-toggle>
      </v-col>

      <v-col v-if="activeTab == 'active'" cols="12">
        <JobAdminCardsList :job-forms="activeForms" />
      </v-col>
      <v-col v-else-if="activeTab == 'moderation'">
        <JobAdminCardsList :job-forms="onModerationForms" />
      </v-col>
      <v-col v-else-if="activeTab == 'archive'">
        <JobAdminCardsList :job-forms="archiveForms" />
      </v-col>
    </v-row>
  </v-container>
</template>