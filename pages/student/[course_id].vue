<script setup lang="ts">
definePageMeta({
  middleware: ["auth"]
  // or middleware: 'auth'
})

const courseStore = useCourse()
const authStore = useAuth()

const router = useRouter()
const route = useRoute()

let { currentCourse } = storeToRefs(courseStore)

await courseStore.getCourseByIdWithLessons(String(route.params.course_id))

let breadcrums = ref([
  {
    title: `${currentCourse.value?.name}`,
    disabled: false,
    href: `/`,
  },
  {
    title: ``,
    disabled: false,
    href: ``,
  },
])

</script>
<template>
  <v-container v-if="currentCourse">
    <v-row>
      <v-col cols="12">
        <BackButton />
        <v-breadcrumbs :items="breadcrums">
        </v-breadcrumbs>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="6" md="4" lg="3" v-for="(lesson, index) in currentCourse.lessons">
        <LessonCard :key="index" :lesson="lesson" />
      </v-col>
    </v-row>
  </v-container>
</template>
