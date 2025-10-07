<script setup lang="ts">
const employeeJobFormsStore = useEmployeeJobForms();

const { myJobForms } = employeeJobFormsStore
const loading = ref(true);



const dialog = ref(false); // Управляет видимостью диалога
const selectedJobFormId = ref<string | null>(null); // Хранит ID анкеты, которую подтверждают
const agreementChecked = ref(false); // Состояние чекбокса в диалоге
const isApproving = ref(false); // Состояние загрузки для кнопки в диалоге

function openApproveDialog(jobFormId: string) {
  selectedJobFormId.value = jobFormId;
  agreementChecked.value = false;
  dialog.value = true;
}


async function confirmAndApprove() {
  if (!selectedJobFormId.value) return;

  isApproving.value = true;
  try {
    await employeeJobFormsStore.approveJobForm(selectedJobFormId.value);
  } finally {
    isApproving.value = false;
    dialog.value = false;
  }
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
              <v-btn v-if="!form.isApproved" color="success" variant="tonal" size="large" append-icon="mdi-check"
                @click="openApproveDialog(form._id)">
                Опубликовать анкету
              </v-btn>
              <v-btn v-else color="error" variant="tonal" size="large" append-icon="mdi-eye-off"
                @click="disapproveJobForm(form._id)">
                Скрыть анкету
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



    <v-dialog v-model="dialog" max-width="650" persistent>
      <v-card>
        <v-card-title class="text-h5 font-weight-bold">
          Подтверждение публикации анкеты
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="text-body-1">
          <p class="mb-4">
            Перед публикацией вашей анкеты, пожалуйста, внимательно ознакомьтесь с условиями.
            Нажимая "Подтвердить", вы даете свое согласие на то, что ваши персональные данные,
            включая ФИО, контакты и видео-визитку, будут доступны для просмотра
            зарегистрированным работодателям на платформе "Сколько".
          </p>
          <p>
            Вы можете в любой момент скрыть свою анкету из общего доступа в личном кабинете.
            Подробные условия описаны в
            <a href="/documents/Согласие_на_использование_видео_и_аудио_Соискатель.docx" target="_blank"
              class="text-primary">
              Пользовательском соглашении.
            </a>
          </p>

          <v-checkbox v-model="agreementChecked" class="mt-4">
            <template v-slot:label>
              <div class="font-weight-medium">
                Я прочитал(а) и принимаю условия публикации
              </div>
            </template>
          </v-checkbox>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="dialog = false">
            Отмена
          </v-btn>
          <v-btn color="success" variant="flat" :disabled="!agreementChecked" :loading="isApproving"
            @click="confirmAndApprove">
            Подтвердить и опубликовать
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>