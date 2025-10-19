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
  <div class="d-flex justify-md-end my-2">
    <v-card class="text-card" color="blue-grey-lighten-5" rounded="lg">
      <v-card-text class="text-body-1" style="overflow-wrap: anywhere;">
        {{ message.text }}
      </v-card-text>
    </v-card>
  </div>
</template>
<style>
.text-card {
  max-width: 75%;
  max-height: 600px;
  width: fit-content;
  height: fit-content;
  overflow: auto;
}
</style>
