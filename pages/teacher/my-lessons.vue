<script setup lang="ts">
definePageMeta({
  middleware: ["teacher"],
})

// type LessonFromDb = {
//   course: {
//     _id: string;
//     [key: string]: any;
//   };
//   [key: string]: any;
// };

const courseStore = useCourse()
const authStore = useAuth()
const router = useRouter()

let lessons = ref()
let { courses } = storeToRefs(courseStore)

if (authStore.user?._id) {
  await courseStore.getAll()

  let coursesIds = authStore.user?.createdCourses

  let res = await courseStore.getLessonsByCourses(coursesIds)
  let lessonsArr = res.data.value;

  if (res.status.value == 'success') {
    const groupedByCourseId = lessonsArr.reduce((acc: any, lesson: any) => {
      const { course } = lesson;

      if (!acc[course]) {
        acc[course] = [];
      }

      acc[course].push(lesson);
      return acc;
    }, {});

    if (courses.value) {
      const combinedData = courses.value.map((course) => {
        return {
          ...course,
          lessons: groupedByCourseId[course._id] || [],
        };
      });
      lessons.value = combinedData
      // данные типа
      // let lessons.value = [
      //   {
      //     course: info,
      //     lessons: [{ les1 }, { les2 }]
      //   } 
      //   {
      //     course: info,
      //     lessons: [{ les1 }, { les2 }]
      //   }]
    }
  }
}
</script>
<template>
  <v-container>
    <v-col>
      <p class="text-4xl font-semibold mb-6">Мои уроки</p>
    </v-col>

    <v-col v-for="(course, index) in lessons"> 
      <v-col class="flex flex-row align-center">
        <img v-if="course?.images?.logo" class="w-24 md:w-28 rounded-lg mr-4"
          :src="course.images.logo" />
        <div class="flex flex-col">
          <p class="ml-2 text-xs md:text-lg">Курс: {{ course.name }}</p>
          <div class="flex flex-row mt-4 border py-2 px-3 rounded-md max-w-fit">
            <div class="mr-2" v-if="authStore.user?.avatars[0]">
              <v-avatar class="border" :image="authStore.user?.avatars[0]"></v-avatar>
            </div>
            <div class="mr-2" v-else>
              <v-avatar class="border">{{ authStore.user?.name[0] }}{{ authStore.user?.surname[0] }}</v-avatar>
            </div>
            <div class="mx-2">
              <p class="text-sm">
                {{ authStore.user?.name }}
              </p>
              <p class="text-xs">
                {{ authStore.user?.roles[0] }}
              </p>
            </div>
          </div>
        </div>
      </v-col>
      <v-row class="mt-4">
        <v-col cols="12" sm="6" md="4" lg="3">
          <div class="border cursor-pointer h-100 d-flex justify-center align-center"
            @click="router.push(`add-lesson?course_id=${course._id}`)"
            style="font-size: 40px; border-radius: 36px;">
            <v-icon class="text-zinc-600 ma-8" icon="mdi-plus"></v-icon>
          </div>
        </v-col>
        <v-col cols="12" sm="6" md="4" lg="3" v-for="(lesson, index) in course.lessons">
          <LessonCard :lesson="lesson" :key="index" />
        </v-col>
      </v-row>
    </v-col>
  </v-container>
</template>