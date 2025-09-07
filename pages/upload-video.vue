<script setup lang="ts">

</script>
<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="mb-4">
        <p class="text-4xl font-semibold">Загрузить видео</p>
        <BackButton :button-text="'Не нужно загружать'" :to-route="'/'" class="mt-4"></BackButton>
      </v-col>

      <v-col cols="12">
        <VideoUpload />
      </v-col>
    </v-row>
  </v-container>
</template>
