<script setup lang="ts">
const route = useRoute()

const breadcrumbTranslations: { [key: string]: string } = {
  "jobs": "Анкеты",
  "upload": "Загрузка",
  "list": "Список",
  "admin": "Админка"
}

const getTitle = (segment: string): string => {
  return breadcrumbTranslations[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)
}

const breadcrumbs = computed(() => {
  const pathSegments = route.path.split('/').filter(segment => segment) // ['dashboard', 'uploads']

  const items = pathSegments.map((segment, index) => {
    const to = '/' + pathSegments.slice(0, index + 1).join('/')

    return {
      title: getTitle(segment),
      to: to,
      disabled: index === pathSegments.length - 1,
    }
  })

  return [
    {
      title: 'Home',
      to: '/',
      disabled: route.path === '/',
    },
    ...items,
  ]
})
</script>
<template>
  <v-container>
    <v-row>
      <v-col cols="12">

        <v-breadcrumbs :items="breadcrumbs" class="text-h4 font-weight-bold pa-0">
          <!-- Кастомный разделитель для лучшего вида -->
          <template v-slot:divider>
            <v-icon icon="mdi-chevron-right"></v-icon>
          </template>
          <!-- Стилизация элементов -->
          <template v-slot:item="{ item }">
            <v-breadcrumbs-item :to="item.to" :disabled="item.disabled" class="text-decoration-none">
              {{ item.title }}
            </v-breadcrumbs-item>
          </template>
        </v-breadcrumbs>
        <!-- <p class="text-4xl font-semibold">Загрузки видео</p> -->
      </v-col>
    </v-row>
  </v-container>

  <slot />
</template>