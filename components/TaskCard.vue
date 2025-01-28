<script setup lang="ts">
import type { Homework } from "~/types/homework.interface"
import type { Course } from "~/types/course.interface"


defineProps<{
  task: Homework
}>()

const userStore = useAuth()

const router = useRouter()
</script>
<template>
  <div class="border relative cursor-pointer h-100" style="border-radius: 36px; padding: 12px 24px;"
    @click="router.push(`/${userStore.user?.roles[0]}/add-solution?homework_id=${task._id}&lesson_id=${task.lesson}&course_id=${task.course}`)">
    <v-col cols="12" class="d-flex justify-start">
      <p class="text-2xl font-semibold">{{ task.name }}</p>
      <div v-if="userStore.user?.roles[0] == 'student'">
        <v-btn class="ma-1" variant="tonal" size="small" rounded="lg"
          @click.stop="router.push(`/${userStore.user?.roles[0]}/${task.course}`)">{{ task.courseName }}</v-btn> /
        <v-btn class="ma-1" variant="tonal" size="small" rounded="lg"
          @click.stop="router.push(`/${userStore.user?.roles[0]}/lesson?_id=${task.lesson}&course_id=${task.course}`)">{{
            task.lessonName }}</v-btn>
      </div>
    </v-col>
    <v-col cols="12" class="text-base">
      <p>
        {{ task.hwText }}
      </p>
    </v-col>
  </div>
</template>
<style scoped>
/* .card {
  border: 1px solid rgba(128, 146, 72, 0.2);
  border-radius: 4px;
} */
</style>
