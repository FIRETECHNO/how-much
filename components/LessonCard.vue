<script setup lang="ts">
import type { Lesson } from "~/types/lesson.interface"
import { toast } from "vue3-toastify"

const router = useRouter()
const route = useRoute()

const authStore = useAuth()
const lessonStore = useLesson()

let { lesson } = defineProps<{
  lesson: Lesson
}>()

let link = ref<string>()

let addLinkDialog = ref<boolean>(false)
function addLink() {
  addLinkDialog.value = true
}

async function addTelemostLink() {
  if (link.value) {
    let res = lessonStore.addTelemostLink(lesson._id, link.value)
    res.then(onFulfilled, onRejected)

    function onFulfilled() {
      toast("Ссылка добавлена", {
        type: "success",
        autoClose: 200,
        onClose: () => {
          addLinkDialog.value = false
        },
      })
    }

    function onRejected() {
      console.log(res);
      toast("Ошибка при создании", {
        type: "error",
        autoClose: 2000,
        onClose: () => {
          window.location.reload()
        },
      })
    }
  }
}

// async function addLinkAndClose() {
//   let copy = Object.assign({}, currentLink.value)
//   // save current link
//   let res = await lessonStore.addTelemostlink(copy)
//   // clear current link
//   currentLink.value.name = ""
//   currentLink.value.value = ""
//   addLinkDialog.value = false
// }

// let editLinkDialog = ref<boolean>(false)

// let currentIndex = ref<number | null>(null)
// function openEditLinkDialog(linkIndex: number) {
//   try {
//     currentLink.value.name = form.value.links[linkIndex].name
//     currentLink.value.value = form.value.links[linkIndex].value

//     currentIndex.value = linkIndex
//     editLinkDialog.value = true
//   } catch (error) { }
// }

// function closeEditLink() {
//   // clear
//   currentIndex.value = null

//   currentLink.value.name = ""
//   currentLink.value.value = ""

//   editLinkDialog.value = false
// }

// function editLinkAndClose() {
//   if (currentIndex.value == null) return

//   form.value.links[currentIndex.value].name = currentLink.value.name
//   form.value.links[currentIndex.value].value = currentLink.value.value

//   // clear
//   currentIndex.value = null

//   currentLink.value.name = ""
//   currentLink.value.value = ""

//   editLinkDialog.value = false
// }


</script>
<template>
  <div class="border rounded-lg relative cursor-pointer h-100"
    style="border-radius: 36px !important; padding: 12px 24px;"
    @click="router.push(`lesson?_id=${lesson._id}&course_id=${route.params?.course_id || lesson.course}`)">
    <v-col cols="12" class="flex justify-center">
      <img class="w-50 mt-5" :src="lesson.images?.logo" />
      <div class="btn-action">
        <v-btn v-if="authStore.user?.roles[0] == 'teacher' || authStore.user?.roles[0] == 'admin'" @click.stop="
          router.push(
            `/${authStore.user?.roles[0]}/lesson-manage?lesson_id=${lesson._id}&course_id=${route.params?.course_id || lesson.course
            }`
          )
          " class="" icon="mdi-pencil-outline"></v-btn>
        <v-btn v-if="authStore.user?.roles[0] == 'teacher' || authStore.user?.roles[0] == 'admin'" @click.stop="addLink"
          class="" icon="mdi mdi-link-variant-plus"></v-btn>
      </div>
      <v-dialog max-width="600" v-model="addLinkDialog" persistent>
        <v-card title="Добавить" prepend-icon="mdi-plus">
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-text-field variant="outlined" label="Ссылка" v-model="link" hide-details></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-btn class="default-btn" variant="tonal" color="error" @click="addLinkDialog = false">Отмена</v-btn>
            <v-btn class="default-btn" variant="tonal" color="success" @click="addTelemostLink">Готово</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>
    <v-col cols="12">
      <p class="text-2xl font-semibold">{{ lesson.name }}</p>
    </v-col>
    <v-col cols="12">
      <p class="text-base">
        {{ lesson.shortDescription }}
      </p>
    </v-col>
  </div>
</template>
<style lang="scss" scoped>
.btn-action {
  display: flex;
  position: absolute;
  gap: 10px;
  left: 50%;
  transform: translate(-50%, 0);
  top: -1.5rem !important;
}
</style>
