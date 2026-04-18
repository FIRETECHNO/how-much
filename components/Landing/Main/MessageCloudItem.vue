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
      <div :key="currentMessage.text" class="message-body d-flex flex-column">
        <span class="text-caption ml-2">
          {{ currentMessage.name }}
        </span>
        <div class="message-bubble">
          {{ currentMessage.text }}
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.message-container {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  min-height: 32px;
  max-width: 100%;
  min-width: 0;
}

.message-body {
  flex: 1;
  min-width: 0;
  max-width: 100%;
}

.message-bubble {
  display: block;
  width: fit-content;
  max-width: 100%;
  margin-top: 2px;
  padding: 8px 12px;
  border-radius: 16px;
  font-size: 0.875rem;
  line-height: 1.4;
  white-space: normal;
  overflow-wrap: anywhere;
  word-break: break-word;
  transition: opacity 0.4s ease;
  background-color: rgba(var(--v-theme-on-surface), 0.08);
  color: rgb(var(--v-theme-on-surface));
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