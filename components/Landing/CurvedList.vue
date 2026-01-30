<script setup lang="ts">
import { useTheme } from 'vuetify'

const props = defineProps<{
  color: string,
  items: string[]
}>()
const marginLeftValues = ref<number[]>([])
const theme = useTheme()


const resolvedColor = computed(() => {
  const colors = theme.themes.value.dark?.colors || {}
  return colors[props.color] || colors.primary || '#1e8d99'
})
// const offsets = [0, 8 * 2, 16 * 2, 24 * 2, 16 * 2, 8 * 2, 0]

// Рассчитываем margin-left по дуге на основе 70vh
onMounted(() => {
  const containerHeight = window.innerHeight * 0.8
  const R = containerHeight / 2
  const n = props.items.length

  if (n === 0) return
  if (n === 1) {
    marginLeftValues.value = [R]
    return
  }

  const angleHalfRad = (50 * Math.PI) / 180 // 50 градусов в радианах
  const maxDy = R * Math.sin(angleHalfRad) // ≈ R * 0.7660

  const margins = []
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1) // от 0 до 1
    const dy = (t - 0.5) * 2 * maxDy // от -maxDy до +maxDy
    const x = R - Math.sqrt(Math.max(0, R * R - dy * dy))
    margins.push(x - 30)
  }
  marginLeftValues.value = margins
})
</script>
<template>
  <div class="d-flex flex-column justify-space-between h-100">
    <div v-for="(item, index) in items" :key="index" class="flex items-start"
      :style="{ marginLeft: `${-marginLeftValues[index] || 0}px` }">
      <!-- Круглая точка -->
      <div class="rounded-full flex-shrink-0" style="width: 40px; height: 40px; border-radius: 99px;"
        :style="{ backgroundColor: resolvedColor }"></div>

      <!-- Текст -->
      <p class="ml-4 text-lg md:text-xl">
        {{ item }}
      </p>
    </div>
  </div>
</template>
