<script setup lang="ts">
const roles = [
  {
    title: 'Соискатель',
    description: 'Я хочу найти работу',
    icon: 'mdi-account-search-outline',
    link: "https://docs.google.com/document/d/1FpMPoOHVXJKegIJJTg67QPz99S5pjccrB3MhFtDpXlE/edit?usp=sharing"
  },
  {
    title: 'Работодатель',
    description: 'Для HR-ов, которые нанимают (физ. лицо, ИП или ООО)',
    icon: 'mdi-account-group-outline',
    link: "https://docs.google.com/document/d/1q8GQ4takVQSJGc_vavgDkHRRHRgoJG-BYqwWVwzY--k/edit?usp=sharing"
  },
  // {
  //   title: 'Рекрутер',
  //   description: 'Для HR-ов, которые выкладывают вакансии',
  //   icon: 'mdi-briefcase-account-outline',
  //   link: ""
  // }
]
</script>

<template>
  <v-container class="fill-height">
    <v-row align="center" justify="center" class="text-center">
      <v-col cols="12" class="mb-10">
        <h1 class="text-h3 font-weight-bold">Инструкции</h1>
        <p class="text-h6 text-medium-emphasis mt-2">
          Ниже описаны инструкции для каждой роли
        </p>
      </v-col>

      <v-col v-for="(item, index) in roles" :key="index" cols="12" md="6" lg="4">
        <NuxtLink :href="item.link" target="_blank" class="text-decoration-none">
          <v-sheet class="role-card d-flex flex-column align-center justify-center pa-8" rounded="xl" elevation="8"
            min-height="350">
            <v-icon :icon="item.icon" color="primary" size="90" class="mb-5"></v-icon>

            <h2 class="text-h4 font-weight-bold text-grey-darken-3">
              {{ item.title }}
            </h2>

            <p class="text-body-1 text-grey-darken-1 mt-3">
              {{ item.description }}
            </p>
          </v-sheet>
        </NuxtLink>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.role-card {
  transition: transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out;
}

.role-card:hover {
  transform: translateY(-12px);
  box-shadow: 0px 16px 32px -8px rgba(0, 0, 0, 0.2) !important;
}
</style>