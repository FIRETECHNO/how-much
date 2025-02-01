<script setup lang="ts">
import type { Course } from "~/types/course.interface"
import type { Homework } from "~/types/homework.interface"

type HomeworkFromDb = {
  course: {
    _id: string;
    [key: string]: any;
  };
  [key: string]: any;
};

interface TasksGrouped {
  [propName: string]: {
    course: Course,
    tasks: [Homework]
  }
}

definePageMeta({
  middleware: ["teacher"],
})

const courseStore = useCourse()
const authStore = useAuth()
const router = useRouter()

let tasksGrouped = ref<TasksGrouped>({})

// получаем данные типа ->
// {
//   lesson_id: {
//     course: { courseinfo }
//     tasks:[ task1, task2]
//   }
// }

function divideIntoGroups(acc: any, item: HomeworkFromDb, index: number) {
  const lessonId = item.lesson;

  if (!acc[lessonId]) {
    acc[lessonId] = {}
    acc[lessonId].course = item.course;
    acc[lessonId].tasks = []
  }
  acc[lessonId].tasks.push(item)
  return acc
}

if (authStore.user?._id) {
  await courseStore.getAll()
  let courses = authStore.user?.createdCourses

  let res = await courseStore.getHomeworksByCourses(courses)
  let tasksArr = res.data.value;

  if (res.status.value == 'success') {
    tasksGrouped.value = tasksArr.reduce(divideIntoGroups, {})
  }
}
</script>
<template>
  <v-container>
    <v-col>
      <p class="text-4xl font-semibold">Мои задания</p>
    </v-col>

    <v-col v-for="(group, key) in tasksGrouped" class="mt-5">
      <v-col cols="12" class="flex flex-col md:flex-row align-center">
        <v-col class="flex flex-row align-center">
          <img v-if="group.course?.images?.logo" class="w-24 md:w-28 rounded-lg mr-4"
            :src="group.course?.images?.logo" />
          <div class="flex flex-col text-xs md:text-sm">
            <p class="ml-2">Курс: {{ group.course?.name }}</p>
            <div class="flex flex-row mt-4 border py-2 px-3 rounded-md  max-w-fit">
              <div class="mr-2" v-if="authStore.user?.avatars[0]">
                <v-avatar class="border" :image="authStore.user?.avatars[0]"></v-avatar>
              </div>
              <div class="mr-2" v-else>
                <v-avatar class="border">{{ authStore.user?.name[0] }}{{ authStore.user?.surname[0] }}</v-avatar>
              </div>
              <div class="mx-2">
                <p class="text-xs md:text-sm">
                  {{ authStore.user?.name }}
                </p>
                <p class="text-xs">
                  {{ authStore.user?.roles[0] }}
                </p>
              </div>
            </div>
          </div>
        </v-col>

        <v-col class="hidden md:flex justify-center">
          <v-icon>mdi-chevron-right</v-icon>
        </v-col>

        <v-col class="flex md:hidden justify-center">
          <v-icon>mdi-chevron-down</v-icon>
        </v-col>

        <v-col>
          <div class="flex flex-row align-center">
            <img v-if="group.tasks[0]?.lessonImages?.logo" class="w-24 md:w-28 rounded-lg mr-4"
              :src="group.tasks[0]?.lessonImages?.logo" />
            <div class="flex flex-col text-xs md:text-sm">
              <p class="ml-2">Урок: {{ group.tasks[0]?.lessonName }}</p>
            </div>
          </div>
        </v-col>
      </v-col>
      <v-row class="mt-2">
        <v-col cols="12" sm="6" md="4" lg="3">
          <div class="border cursor-pointer h-100 d-flex justify-center align-center"
            @click="router.push(`lesson-manage?lesson_id=${key}&course_id=${group.course._id}`)"
            style="font-size: 40px; border-radius: 36px;">
            <v-icon class="text-zinc-600 ma-8" icon="mdi-plus"></v-icon>
          </div>
        </v-col>
        <v-col cols="12" sm="6" md="4" lg="3" v-for="(task, index) in group.tasks">
          <TaskCard :task="task" :key="index" />
        </v-col>
      </v-row>
    </v-col>
  </v-container>
</template>