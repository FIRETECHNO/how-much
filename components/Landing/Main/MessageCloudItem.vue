<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

interface Message {
  name: string;
  text: string;
}

const props = defineProps<{
  messages: Message[]
}>()

const currentMessage = ref(getRandomMessage());
let timeoutId: number | null = null;

function getRandomMessage() {
  const randomIndex = Math.floor(Math.random() * props.messages.length);
  return props.messages[randomIndex];
}

function setRandomTimeout() {
  const randomDelay = Math.floor(Math.random() * 5000) + 5000;
  timeoutId = window.setTimeout(() => {
    currentMessage.value = getRandomMessage();
    setRandomTimeout();
  }, randomDelay);
}

onMounted(() => {
  setRandomTimeout();
});

onUnmounted(() => {
  if (timeoutId !== null) {
    clearTimeout(timeoutId);
  }
});
</script>

<template>
  <div class="message-container">
    <v-avatar color="surface-variant">{{ currentMessage.name[0] }}</v-avatar>
    <Transition name="fade" mode="out-in">
      <div :key="currentMessage.text" class="d-flex flex-column">
        <span class="text-caption ml-2">
          {{ currentMessage.name }}
        </span>
        <v-chip variant="tonal" class="message-chip">
          {{ currentMessage.text }}
        </v-chip>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.message-container {
  display: flex;
  align-items: center;
  gap: 8px;
  /* Гарантируем, что высота не изменится */
  min-height: 32px;
  /* высота v-chip по умолчанию */
}

/* Важно: чип должен быть inline-block, чтобы занимать свою ширину */
.message-chip {
  transition: opacity 0.4s ease;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from {
  opacity: 0;
}

.fade-leave-to {
  opacity: 0;
}
</style>