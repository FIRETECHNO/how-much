<script setup lang="ts">
const images = [
  '/landing/employee-hero-image.png',
  '/landing/manager-hero-image.png',
  '/landing/employer-hero-image.png',
]
const router = useRouter()
const activeIndex = ref(0)
let timer: ReturnType<typeof setInterval>

onMounted(() => {
  timer = setInterval(() => {
    activeIndex.value = (activeIndex.value + 1) % images.length
  }, 6000) // скорость переключения
})

onUnmounted(() => {
  clearInterval(timer)
})
function getLinkByImageName(name: string) {
  let a = name.split("/")
  return a[2].split('-')[0]
}
const getHeight = (index: number) =>
  index === activeIndex.value ? '55vh' : '45vh'
</script>

<template>
  <v-row style="min-height: 60vh;">
    <v-col v-for="(img, index) in images" :key="img" class="d-flex align-center justify-center">
      <v-img :src="img" cover :style="{
        height: getHeight(index),
        borderRadius: '999px',
        transition: 'height 0.4s ease'
      }" class="cursor-pointer" @click="router.push(`/registration/${getLinkByImageName(img)}`)" />
    </v-col>
  </v-row>
</template>
