<script setup lang="ts">
definePageMeta({
  middleware: 'employee'
})

const employeeJobFormsStore = useEmployeeJobForms();

const loading = ref(true);

const { myJobForms, BOOST_DELTA } = employeeJobFormsStore



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
      <v-col v-for="form in myJobForms" cols="12" md="6" lg="4">
        <EmployeeJobFormCard :form="form._id" :key="form._id" />
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