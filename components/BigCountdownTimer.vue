<script setup lang="ts">
const props = defineProps<{
  startDate: string
  duration: number // в миллисекундах
}>();

const emit = defineEmits(['finished']);

const now = ref(new Date());
let intervalId: ReturnType<typeof setInterval> | null = null;

const timeLeft = computed(() => {
  const target = new Date(props.startDate).getTime() + props.duration;
  return Math.max(0, target - now.value.getTime());
});

const formattedTime = computed(() => {
  const totalSeconds = Math.floor(timeLeft.value / 1000);

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    days,
    hours: String(hours).padStart(2, '0'),
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(seconds).padStart(2, '0'),
  };
});

const isFinished = computed(() => timeLeft.value === 0);

function updateTime() {
  now.value = new Date();
  if (isFinished.value) {
    emit('finished');
    if (intervalId) clearInterval(intervalId);
  }
}

onMounted(() => {
  updateTime();
  intervalId = setInterval(updateTime, 1000);
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});
</script>

<template>
  <slot :days="formattedTime.days" :hours="formattedTime.hours" :minutes="formattedTime.minutes"
    :seconds="formattedTime.seconds" :is-finished="isFinished">
    <template v-if="formattedTime.days > 0">
      <span>{{ formattedTime.days }}д {{ formattedTime.hours }}ч</span>
    </template>
    <template v-else>
      <span>{{ formattedTime.hours }}:{{ formattedTime.minutes }}:{{ formattedTime.seconds }}</span>
    </template>
  </slot>
</template>
