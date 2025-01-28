<script setup lang="ts">
const config = useRuntimeConfig()
const router = useRouter()

let { materialType } = defineProps<{
  materialType: string
  materialPaths: string[]
}>()

let icon = computed(() => {
  switch (materialType) {
    case "archives":
      return "mdi-archive-arrow-up-outline"
  }
})

function getDownloadLink(filePath: string): string {
  // replace // -> /, to avoid "/" duplicates
  return (config.public.apiBase + "/" + filePath).replaceAll("//", "/")
}

function getFilename(path: string): string {
  return path.split("/").pop() || "Некорректное название"
}

// там проблема с eventPropagation, так что это самое логичное решение
const downloadFile = (fileUrl: string) => {
  if (process.client) {
    const link = document.createElement("a")
    link.href = fileUrl
    link.download = '';
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}
</script>
<template>
  <v-row>
    <v-col cols="12" sm="6" md="3" v-if="materialPaths.length > 0" v-for="(material, index) of materialPaths">
      <div class="card border rounded-lg cursor-pointer" @click.stop="downloadFile(material)">
        <v-icon :icon="icon" class="icon"></v-icon>
        <div>
          {{ getFilename(material) }}
        </div>
      </div>
    </v-col>
    <v-col v-else cols="12">
      Пусто
    </v-col>
  </v-row>
</template>
<style scoped lang="scss">
.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  justify-content: center;
  aspect-ratio: 1;
  z-index: 1000;

  .icon {
    font-size: 50px;
  }
}
</style>
