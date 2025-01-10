<script setup lang="ts">
import type { Homework } from "~/types/homework.interface"

definePageMeta({
  middleware: ["admin"],
  // or middleware: 'auth'
})

const courseStore = useCourse()
const userStore = useAuth()
const router = useRouter()
const route = useRoute()
const lessonId = route.query._id

let { currentCourse } = storeToRefs(courseStore)
let homeworks = ref<Homework[]>([])

let currentLesson = computed(() => {
  if (!currentCourse.value) return null
  for (let lesson of currentCourse.value.lessons) {
    if (lesson._id == lessonId) return lesson
  }
  return null
})

if (route.query.course_id) {
  let res = await courseStore.getHomeworksByCourses([String(route.query.course_id)])
  if (res.status.value == "success") {
    homeworks.value = res.data.value
  }
}

await courseStore.getCourseByIdWithLessons(String(route.query.course_id))

let breadcrumbs = ref([
  {
    title: `${currentCourse.value?.name}`,
    disabled: false,
    href: `/`,
  },
  {
    title: `${currentLesson.value?.name}`,
    disabled: false,
    href: `${currentCourse.value?._id}`,
  },
])
</script>
<template>
  <v-container v-if="currentLesson?._id">
    <v-row>
      <v-col cols="12">
        <BackButton />
        <v-breadcrumbs :items="breadcrumbs" class="text-xs md:text-base" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
        <M3U8Player :src="currentLesson?.videos[0]" />
      </v-col>
      <v-col cols="12" md="3">
        <p class="text-4xl font-semibold mb-5">
          {{ currentLesson.name }}
        </p>
        <p class="text-base">
          {{ currentLesson.shortDescription }}
        </p>
      </v-col>
      <v-col cols="12" md="3">
        <NuxtLink v-for="link of currentLesson.links" :to="link.value" target="blank">
          <v-btn class="ma-1 w-100 border" variant="text" rounded="lg">{{ link.name }}</v-btn>
        </NuxtLink>
      </v-col>
      <v-col cols="12" md="6" class="flex flex-row">
        <v-col>
          <p class="text-4xl font-semibold mb-5">Материалы</p>
          <div class="grid grid-cols-4 gap-4 place-content-stretch">
            <div v-for="i in 8" class="border h-24"></div>
          </div>
        </v-col>
      </v-col>
      <v-col cols="12">
        <p class="text-4xl font-semibold mb-5">Домашнее задание</p>
        <v-row>
          <v-col
            v-if="homeworks.length > 0"
            cols="12"
            v-for="task of homeworks"
            class="border rounded-lg cursor-pointer h-100 mb-5"
            @click.stop="
              router.push(
                `/student/add-solution?homework_id=${task._id}&lesson_id=${task.lesson}&course_id=${task.course}`
              )
            "
          >
            <v-row>
              <v-col cols="12">
                <v-row>
                  <v-col cols="12">
                    <p class="text-2xl font-semibold">{{ task.name }}</p>
                  </v-col>
                  <v-col cols="12" md="6">
                    <p class="micro-heading">Текст задания</p>
                    <p>
                      {{ task.hwText }}
                    </p>
                  </v-col>
                  <v-col cols="12" md="6">
                    <p class="micro-heading">Прикреплённые материалы</p>
                    {{ task.materials }}
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
          <v-col
            v-else
            cols="12">Пусто</v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
  <v-container v-else> писец... </v-container>
</template>
<style lang="scss" scoped>
.micro-heading {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 10px;
}
</style>
