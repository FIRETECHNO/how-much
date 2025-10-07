<script setup lang="ts">
const employeeJobFormsStore = useEmployeeJobForms();

const { myJobForms } = employeeJobFormsStore
const loading = ref(true);

async function approveJobForm(jobFormId: string) {
  await employeeJobFormsStore.approveJobForm(jobFormId);
}
async function disapproveJobForm(jobFormId: string) {
  await employeeJobFormsStore.disapproveJobForm(jobFormId);
}

onMounted(async () => {
  if (myJobForms.value.length == 0)
    await employeeJobFormsStore.getMyJobForms();
  loading.value = false;
});
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 font-weight-bold">Мои анкеты</h1>
        <p class="text-medium-emphasis">
          Здесь отображаются все ваши анкеты и их статусы.
        </p>
      </v-col>
    </v-row>

    <v-row v-if="loading" class="mt-10">
      <v-col class="text-center">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
        <p class="mt-4">Загрузка анкет...</p>
      </v-col>
    </v-row>

    <v-row v-else-if="myJobForms && myJobForms.length > 0">
      <v-col v-for="form in myJobForms" :key="form._id" cols="12" md="6">
        <v-card border flat class="d-flex flex-column" height="100%">
          <v-responsive v-if="form.video && form.video.src" :aspect-ratio="16 / 9">
            <video :src="form.video.src" style="width: 100%; height: 100%; object-fit: cover;" controls></video>
          </v-responsive>

          <v-list-item :title="form.job" :subtitle="form.fullName" class="py-3">
            <template v-slot:prepend>
              <v-avatar color="grey-lighten-3">
                <v-icon color="grey-darken-1">mdi-briefcase-variant-outline</v-icon>
              </v-avatar>
            </template>
          </v-list-item>

          <v-divider></v-divider>

          <div class="d-flex flex-column flex-grow-1">
            <v-list density="compact" class="flex-grow-1">
              <v-list-item :title="form.email" subtitle="Email" prepend-icon="mdi-email-outline"></v-list-item>
              <v-list-item :title="form.phone" subtitle="Телефон" prepend-icon="mdi-phone-outline"></v-list-item>
              <v-list-item :title="`@${form.telegram}`" subtitle="Telegram" prepend-icon="mdi-telegram"></v-list-item>
            </v-list>

            <v-card-actions class="pa-3">
              <v-spacer></v-spacer>
              <v-btn color="success" variant="tonal" size="large" append-icon="mdi-check"
                @click="approveJobForm(form._id)" v-if="!form.isApproved">
                Я согласен. Опубликовать!
              </v-btn>
              <v-btn color="error" variant="tonal" size="large" append-icon="mdi-eye-off"
                @click="disapproveJobForm(form._id)" v-else>
                Скрыть эту анкету
              </v-btn>
            </v-card-actions>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col>
        <v-sheet min-height="400" class="d-flex align-center justify-center text-center" rounded="lg" border>
          <div>
            <v-icon icon="mdi-text-box-search-outline" size="64" color="grey"></v-icon>
            <div class="text-h5 mt-4">У вас пока нет анкет</div>
            <p class="text-medium-emphasis">
              Обратитесь к нам, чтобы создать анкету!
            </p>
          </div>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>