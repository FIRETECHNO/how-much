<script setup lang="ts">
import type { JobForm } from '~/types/job-form.interface';
defineProps<{ job: JobForm }>()
</script>
<template>
  <video :src="job.video.src"></video>
</template>