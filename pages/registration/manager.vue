<script setup lang="ts">
import { useField, useForm } from 'vee-validate';
import AuthApi from '~/api/AuthApi'; // Предполагается, что у вас есть API-файл для Auth

definePageMeta({
  layout: 'default', // Укажите ваш layout
});

const router = useRouter();
const route = useRoute();
const auth = useAuth();

const inviteToken = ref(route.query.invite_token as string | null);
// Состояние токена: 'validating' (проверяется), 'valid' (валидный), 'invalid' (невалидный)
const tokenState = ref<'validating' | 'valid' | 'invalid'>('validating');

onMounted(async () => {
  if (!inviteToken.value) {
    tokenState.value = 'invalid';
    return;
  }
  try {
    const responseEmail = await AuthApi.validateInviteToken(inviteToken.value);
    console.log(responseEmail);

    tokenState.value = responseEmail.email ? 'valid' : 'invalid';

    email.value.value = responseEmail.email
  } catch (error) {
    console.error("Ошибка при проверке инвайт-токена:", error);
    tokenState.value = 'invalid'; // Любая ошибка делает токен невалидным
  }
});


const { meta, handleSubmit } = useForm<{
  name: string,
  email: string,
  password: string,
  agreement: boolean,
}>({
  initialValues: {
    name: '',
    email: '',
    password: '',
    agreement: false,
  },
  validationSchema: {
    name(value: string) {
      if (!value) return 'Введите ФИО';
      if (value.length < 4) return 'Слишком короткое ФИО';
      if (value.length > 200) return 'Слишком длинное ФИО';
      return true;
    },
    email(value: string) {
      if (!value) return 'Введите почту';
      if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(value))
        return 'Некорректный формат почты';
      return true;
    },
    password(value: string) {
      if (!value) return 'Введите пароль';
      if (value.length < 8) return 'Пароль должен быть не менее 8 символов';
      if (value.length > 30) return 'Слишком длинный пароль';
      return true;
    },
    agreement(value: boolean) {
      if (value !== true) return 'Необходимо ваше согласие на обработку данных';
      return true;
    },
  },
});

const name = useField<string>('name');
const email = useField<string>('email');
const password = useField<string>('password');
const agreement = useField<boolean>('agreement');

const show_password = ref(false);
const loading = ref(false);

const submit = handleSubmit(async values => {
  loading.value = true;
  try {
    const res = await auth.registration({
      ...values,
      roles: ["manager"],
      inviteToken: inviteToken.value,
    });

    if (res) {
      await router.push(`/me`);
    }
  } catch (error) {
    console.error("Ошибка при регистрации:", error);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <v-container>
    <BackButton />

    <v-col cols="12" xs="12" sm="10" md="7" lg="5" class="mt-4 ma-auto">

      <div v-if="tokenState === 'validating'" class="text-center pa-10">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
        <p class="mt-4 text-h6 text-medium-emphasis">Проверка приглашения...</p>
      </div>

      <v-card v-else-if="tokenState === 'valid'" class="d-flex flex-column 
        justify-center align-center 
        text-center w-100 pa-6 rounded-lg">
        <div class="text-h6 font-weight-bold">
          Регистрация рекрутера
        </div>

        <v-form class="mt-6 w-100" @submit.prevent="submit">
          <v-text-field label="ФИО" placeholder="Иван Иванов Иванович" v-model="name.value.value"
            :error-messages="name.errors.value" variant="outlined" density="compact" class="w-100" />

          <v-text-field label="Email" type="email" placeholder="ivan@mail.com" v-model="email.value.value"
            :error-messages="email.errors.value" variant="outlined" density="compact" class="w-100 mt-1" />

          <v-text-field label="Пароль" v-model="password.value.value"
            :append-inner-icon="show_password ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append-inner="show_password = !show_password" :type="show_password ? 'text' : 'password'"
            :error-messages="password.errorMessage.value" variant="outlined" density="compact" class="w-100 mt-1" />

          <v-checkbox v-model="agreement.value.value" :error-messages="agreement.errorMessage.value" class="mt-2">
            <template v-slot:label>
              <div class="text-caption text-left">
                Я согласен с
                <a href="/documents/Пользовательское_соглашение_для_внешних_рекрутеров.pdf" target="_blank" @click.stop
                  class="text-primary">
                  политикой конфиденциальности и обработки персональных данных
                </a>
              </div>
            </template>
          </v-checkbox>

          <v-btn type="submit" :disabled="!meta.valid" :loading="loading" color="accent" class="mt-2" block>
            Зарегистрироваться
          </v-btn>
        </v-form>

        <div class="text-subtitle-1 w-100 mt-4">
          Уже есть аккаунт?
          <NuxtLink to="/login" class="font-weight-bold text-primary text-decoration-none">
            Войти
          </NuxtLink>
        </div>
      </v-card>

      <v-alert v-else type="error" title="Недействительная ссылка" variant="tonal" prominent icon="mdi-link-off">
        Ссылка для регистрации недействительна, просрочена или уже была использована. Пожалуйста, обратитесь к
        администратору
        для получения новой ссылки.
      </v-alert>

    </v-col>
  </v-container>
</template>