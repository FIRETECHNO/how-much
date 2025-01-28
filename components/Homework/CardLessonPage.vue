<script setup lang="ts">
import type { Homework } from "~/types/homework.interface"

const router = useRouter();

defineProps<{
  hw: Homework,
  link: string,
}>()
</script>
<template>
  <v-row @click.stop="router.push(link)">
    <v-col cols="12">
      <v-row>
        <v-col cols="12">
          <p class="text-2xl font-semibold">{{ hw.name }}</p>
        </v-col>
        <v-col cols="12" md="6">
          <p class="micro-heading">Текст задания</p>
          <p>
            {{ hw.hwText }}
          </p>
        </v-col>
        <v-col cols="12" md="6">
          <p class="micro-heading">Прикреплённые материалы</p>
          <HomeworkMaterial :material-paths="hw.materials.archives" :material-type="'archives'" />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>
<style lang="scss" scoped>
.micro-heading {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 10px;
}
</style>
