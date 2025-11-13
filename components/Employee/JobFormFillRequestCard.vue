<script setup lang="ts">
import type { JobFormFillRequestDB } from '~/types/job-form-fill-request.interface';

defineProps<{
  jobFormFillRequest: JobFormFillRequestDB
}>()
</script>
<template>
  {{ jobFormFillRequest }}
</template>