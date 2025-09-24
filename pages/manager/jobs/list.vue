<script setup lang="ts">
definePageMeta({
  middleware: "manager"
})
</script>
<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <BackButton :button-text="'Назад'" class="mt-4"></BackButton>
      </v-col>

      <JobAdminCardsList />
    </v-row>
  </v-container>
</template>