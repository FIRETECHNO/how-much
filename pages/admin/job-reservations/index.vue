<script setup lang="ts">
definePageMeta({
  middleware: "admin"
})

const adminStore = useAdminJobs()
let { jobReservations } = adminStore

onMounted(async () => {
  await adminStore.getAllReservations()
})
</script>
<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <JobAdminReservationsList :reservations="jobReservations" />
      </v-col>
    </v-row>
  </v-container>
</template>