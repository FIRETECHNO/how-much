<script setup lang="ts">
definePageMeta({
  middleware: 'employee'
})

const employeeJobFormsStore = useEmployeeJobForms();

const loading = ref(true);

const { myReservations } = employeeJobFormsStore



onMounted(async () => {
  if (myReservations.value.length == 0)
    await employeeJobFormsStore.getReservations();
  loading.value = false;
});
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 font-weight-bold">Вами заинтересовались</h1>
        <p class="text-medium-emphasis">

        </p>
      </v-col>
    </v-row>

    <v-row v-if="loading" class="mt-10">
      <v-col class="text-center">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
        <p class="mt-4">Загрузка откликов...</p>
      </v-col>
    </v-row>

    <v-row v-else-if="myReservations && myReservations.length > 0">
      <EmployeeJobFormReservations :my-reservations="myReservations" />
    </v-row>

    <v-row v-else>
      <v-col>
        <v-sheet min-height="400" class="d-flex align-center justify-center text-center" rounded="lg" border>
          <div>
            <v-icon icon="mdi-text-box-search-outline" size="64" color="grey"></v-icon>
            <div class="text-h5 mt-4">Вас пока не позвали на собеседование</div>
            <p class="text-medium-emphasis">

            </p>
          </div>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>