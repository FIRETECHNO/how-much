<script setup lang="ts">
import { toast } from "vue3-toastify"

const emit = defineEmits(['uploaded'])

let archiveInput = ref<any>(null)

let archives = ref<any>()
let archivesLength = ref<number>(0)
async function onZipChange(event: any) {
  const files = event.target.files
  if (files.length <= 10) {
    archives.value = files
    emit('uploaded', files)
  } else {
    toast("Максимум 10 архивов!", {
      type: "warning",
    })
    return
  }
  archivesLength.value = files.length
}

function triggerInput() {
  if (archiveInput.value) archiveInput.value.click()
}
</script>
<template>
  <p class="text-1xl font-semibold mb-4">Загрузка архивов</p>
  <input
    ref="archiveInput"
    type="file"
    @change="onZipChange"
    class="cursor-pointer"
    accept="zip,application/octet-stream,application/zip,application/x-zip,application/x-zip-compressed"
    multiple
  />
  <div class="input-container border rounded-lg cursor-pointer" @click="triggerInput">
    <v-icon class="upload-icon" icon="mdi-archive-arrow-down-outline"></v-icon>
    <div>
      <b>{{ archivesLength }} архивов</b>
    </div>
  </div>
</template>
<style lang="scss" scoped>
input {
  display: none;
}
.input-container {
  .upload-icon {
    font-size: 5em;
  }
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  min-height: 200px;
}
</style>
