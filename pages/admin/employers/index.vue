<script setup lang="ts">
const adminJobsStore = useAdminJobs();

let { notModeratedEmployers } = adminJobsStore;

await adminJobsStore.getNotModeratedEmployers()
</script>
<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        {{ notModeratedEmployers }}
      </v-col>
    </v-row>
  </v-container>
</template>