<script setup lang="ts">
const employeeJobFormsStore = useEmployeeJobForms();

const { myJobForms, BOOST_DELTA } = employeeJobFormsStore

let props = defineProps<{
  form: string
}>()

const form = computed(() => {
  return myJobForms.value.find(f => f._id === props.form) || null
})

const dialog = ref(false); // Управляет видимостью диалога
const selectedJobFormId = ref<string | null>(null); // Хранит ID анкеты, которую подтверждают
const agreementChecked = ref(false); // Состояние чекбокса в диалоге
const isApproving = ref(false); // Состояние загрузки для кнопки в диалоге


function isMustBeBoosted(jobFormId: string): boolean {
  for (let i = 0; i < myJobForms.value.length; i++) {
    if (!myJobForms.value[i]?.lastRaiseDate) return true;

    if (myJobForms.value[i]._id == jobFormId) {
      let lastRaise = new Date(myJobForms.value[i].lastRaiseDate);
      let currentDate = new Date();
      let delta = currentDate.getTime() - lastRaise.getTime()

      if (delta >= BOOST_DELTA) {
        return true
      }

      return false
    }
  }

  return false
}

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
  }
  finally {
    isApproving.value = false;
    dialog.value = false;
  }
}
async function disapproveJobForm(jobFormId: string) {
  await employeeJobFormsStore.disapproveJobForm(jobFormId);
}
async function boostJobForm(jobFormId: string) {
  await employeeJobFormsStore.boostJobForm(jobFormId)
}
</script>
<template>
  <v-card border flat class="d-flex flex-column status-card" height="100%" v-if="form">

    <div class="status-chip-container">
      <div v-if="form.isApproved">
        <v-chip variant="elevated" prepend-icon="mdi-clock-outline" class="mr-2" v-if="form.lastRaiseDate">
          <b>
            <ClientOnly>
              <BigCountdownTimer :start-date="form.lastRaiseDate" :duration="BOOST_DELTA" />
            </ClientOnly>
          </b>
        </v-chip>
        <v-chip color="success" variant="elevated">
          <b>
            Опубликована
          </b>
        </v-chip>
      </div>
      <v-chip v-else variant="elevated" color="error">
        Не опубликована
      </v-chip>
    </div>

    <v-responsive v-if="form.video && form.video?.src" :aspect-ratio="16 / 9">
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
        <v-btn v-if="form?.isApproved" variant="tonal" size="small" append-icon="mdi-eye-off"
          @click="disapproveJobForm(form._id)">
          Скрыть
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn v-if="!form?.isApproved" color="success" variant="tonal" size="large" append-icon="mdi-check"
          @click="openApproveDialog(form._id)">
          Опубликовать анкету
        </v-btn>
        <template v-if="form?.isApproved && isMustBeBoosted(form._id)">
          <v-btn class="pulsing-button" color="success" variant="tonal" size="large"
            append-icon="mdi-arrow-up-bold-box-outline" @click="boostJobForm(form._id)">
            Поднять в поиске
          </v-btn>
        </template>
      </v-card-actions>
    </div>
  </v-card>

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
</template>


<style scoped lang="scss">
.status-card {
  position: relative;
  overflow: visible;
}

.status-chip-container {
  position: absolute;
  top: -10px;
  right: -10px;
  z-index: 2;
  font-weight: 700;
}


.pulsing-button {
  /* 
    Параметры анимации: 
    - bounce-animation: имя анимации (описана ниже)
    - 2.5s: длительность одного цикла анимации
    - ease-in-out: плавность хода анимации
    - infinite: повторять бесконечно
  */
  animation: bounce-animation 1s ease-in-out infinite;
}

/* Описание самой анимации "прыжка" */
@keyframes bounce-animation {

  /* 
    Анимация разделена на временные отрезки (от 0% до 100%).
    Большую часть времени (0-80%) кнопка находится в обычном состоянии.
    Затем она совершает небольшой "прыжок".
  */
  0%,
  80%,
  100% {
    transform: translateY(0);
    /* Вернуться в исходное положение */
  }

  90% {
    transform: translateY(-10px) scale(1.02);
    /* Подпрыгнуть вверх на 10 пикселей */
  }

  95% {
    transform: translateY(5px);
    /* Слегка опуститься ниже исходной точки для эффекта "приземления" */
  }
}
</style>