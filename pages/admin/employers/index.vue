<script setup lang="ts">
import { toast } from 'vue3-toastify';

const adminStore = useAdminJobs();
const { notModeratedEmployers } = adminStore

const loading = ref(true);

onMounted(async () => {
  await adminStore.getNotModeratedEmployers();
  loading.value = false;
});

async function approveEmployer(employerId: string) {
  try {
    await adminStore.moderateEmployer(employerId, true);
    toast.success('Работодатель одобрен!');
  } catch (error) {
    toast.error('Ошибка при одобрении.');
    console.error(error);
  }
}

async function rejectEmployer(employerId: string) {
  try {
    await adminStore.moderateEmployer(employerId, false);
    toast.warn('Работодатель отклонен.');
  } catch (error) {
    toast.error('Ошибка при отклонении.');
    console.error(error);
  }
}
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <p class="text-medium-emphasis">
          Новые заявки на регистрацию от работодателей.
        </p>
      </v-col>
    </v-row>

    <v-row v-if="loading">
      <v-col class="text-center mt-10">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
        <p class="mt-4">Загрузка заявок...</p>
      </v-col>
    </v-row>

    <v-row v-else-if="notModeratedEmployers && notModeratedEmployers.length > 0">
      <v-col v-for="employer in notModeratedEmployers" :key="employer._id" cols="12" md="6" lg="4">
        <v-card border flat>
          <v-card-title class="font-weight-bold text-wrap">
            {{ employer.company?.data.name.short_with_opf || 'Компания не указана' }}
          </v-card-title>
          <v-card-subtitle>
            Заявка на регистрацию
          </v-card-subtitle>

          <v-divider class="my-2"></v-divider>

          <v-list density="compact">
            <v-list-item :title="employer.name" subtitle="Контактное лицо"
              prepend-icon="mdi-account-tie-outline"></v-list-item>

            <v-list-item :title="employer.email" subtitle="Email" prepend-icon="mdi-email-outline"></v-list-item>

            <template v-if="employer.company">
              <v-list-item :title="employer.company.data.inn" subtitle="ИНН"
                prepend-icon="mdi-identifier"></v-list-item>

              <v-list-item :title="employer.company.data.address.value" subtitle="Юридический адрес"
                prepend-icon="mdi-map-marker-outline"></v-list-item>
            </template>

            <v-list-item v-else title="-" subtitle="Данные компании отсутствуют"
              prepend-icon="mdi-office-building-outline"></v-list-item>

          </v-list>

          <v-divider></v-divider>

          <v-card-actions class="pa-3">
            <v-btn color="error" variant="text" @click="rejectEmployer(employer._id)">
              Отклонить
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="success" variant="flat" @click="approveEmployer(employer._id)">
              Одобрить
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col>
        <v-sheet min-height="400" class="d-flex align-center justify-center text-center" rounded="lg" border>
          <div>
            <v-icon icon="mdi-check-all" size="64" color="grey"></v-icon>
            <div class="text-h5 mt-4">Нет заявок на модерацию</div>
            <p class="text-medium-emphasis">Все работодатели были отмодерированы.</p>
          </div>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.v-card-title.text-wrap {
  white-space: normal;
}
</style>