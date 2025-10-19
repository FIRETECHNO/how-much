<script setup lang="ts">
defineProps<{
  message: {
    _id: string,
    isIncoming: boolean,
    author: string,
    text: string
  }
}>();
</script>

<template>
  <div class="d-flex justify-md-start my-2">
    <v-card class="text-card" color="blue-grey-lighten-4" rounded="lg">
      <v-card-text class="text-body-1" style="overflow-wrap: anywhere;">
        {{ message.text }}
      </v-card-text>
    </v-card>
  </div>
</template>

<style scoped>
.text-card {
  max-width: 75%;
  max-height: 600px;
  width: fit-content;
  height: fit-content;
  overflow: auto;
  border-radius: 20px;
}

.focus-service {
  margin: 20px;
  border: 3px solid #ffffff;
  border-radius: 12px;
  transition: all 0.3s ease;
  cursor: pointer;
  max-width: 400px;
  max-height: 400px;
}

.scroll-container {
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  padding: 8px;
}

.service-item-col {
  width: 90%;
  min-width: 60%;
  padding: 8px;
}
</style>
