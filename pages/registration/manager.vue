<script setup lang="ts">
import { useField, useForm } from 'vee-validate';
import AuthApi from '~/api/AuthApi';

definePageMeta({
  layout: 'default',
});

const router = useRouter();
const route = useRoute();
const auth = useAuth();
const { companyEmail } = useAppConst()

const inviteToken = ref(route.query.invite_token as string | null);
const tokenState = ref<'validating' | 'valid' | 'invalid'>('validating');

onMounted(async () => {
  if (!inviteToken.value) {
    tokenState.value = 'invalid';
    return;
  }
  try {
    const responseEmail = await AuthApi.validateInviteToken(inviteToken.value);
    tokenState.value = responseEmail.email ? 'valid' : 'invalid';
    email.value.value = responseEmail.email
  } catch (error) {
    console.error("Ошибка при проверке инвайт-токена:", error);
    tokenState.value = 'invalid';
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
  <div class="manager-reg-page">
    <v-container class="py-6 py-md-10">
      <BackButton />

      <v-row justify="center">
        <v-col cols="12" sm="11" md="8" lg="5" xl="4">

          <div v-if="tokenState === 'validating'" class="manager-reg-card manager-reg-card--muted text-center pa-10 pa-md-12">
            <v-progress-circular indeterminate size="56" width="4" color="manager" />
            <p class="mt-6 text-h6 font-weight-medium">Проверка приглашения…</p>
            <p class="mt-2 text-body-2 text-medium-emphasis">
              Подождите, мы подтверждаем вашу ссылку
            </p>
          </div>

          <v-card
            v-else-if="tokenState === 'valid'"
            class="manager-reg-card"
            elevation="6"
            rounded="xl"
          >
            <div class="manager-reg-banner text-center pa-6 pa-sm-8">
              <v-avatar size="64" class="manager-reg-banner__avatar mb-4">
                <v-icon icon="mdi-account-tie" size="36" color="manager" />
              </v-avatar>
              <h1 class="text-h5 text-sm-h4 font-weight-bold">
                Регистрация рекрутера
              </h1>
              <p class="manager-reg-banner__subtitle text-body-2 mt-3 mb-0">
                Создайте аккаунт и присоединяйтесь к платформе «Сколько»
              </p>
            </div>

            <v-divider />

            <v-card-text class="pa-6 pa-sm-8">
              <v-form @submit.prevent="submit">
                <v-text-field
                  v-model="name.value.value"
                  label="ФИО"
                  placeholder="Иван Иванов Иванович"
                  :error-messages="name.errors.value"
                  variant="outlined"
                  color="manager"
                  density="comfortable"
                  class="mb-1"
                  hide-details="auto"
                />

                <v-text-field
                  v-model="email.value.value"
                  label="Email"
                  type="email"
                  placeholder="ivan@mail.com"
                  :error-messages="email.errors.value"
                  variant="outlined"
                  color="manager"
                  density="comfortable"
                  class="mb-1"
                  hide-details="auto"
                />

                <v-text-field
                  v-model="password.value.value"
                  label="Пароль"
                  :type="show_password ? 'text' : 'password'"
                  :append-inner-icon="show_password ? 'mdi-eye' : 'mdi-eye-off'"
                  :error-messages="password.errorMessage.value"
                  variant="outlined"
                  color="manager"
                  density="comfortable"
                  hide-details="auto"
                  @click:append-inner="show_password = !show_password"
                />

                <v-checkbox
                  v-model="agreement.value.value"
                  color="manager"
                  :error-messages="agreement.errorMessage.value"
                  hide-details="auto"
                  class="mt-4 align-start"
                >
                  <template #label>
                    <div class="text-body-2 text-left text-wrap">
                      Я согласен с
                      <a
                        href="/documents/Пользовательское_соглашение_для_внешних_рекрутеров.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="manager-reg-link text-decoration-none"
                        @click.stop
                      >
                        политикой конфиденциальности и обработки персональных данных
                      </a>
                    </div>
                  </template>
                </v-checkbox>

                <v-btn
                  type="submit"
                  block
                  size="large"
                  rounded="xl"
                  color="manager"
                  :disabled="!meta.valid"
                  :loading="loading"
                  class="manager-reg-submit mt-6"
                >
                  Зарегистрироваться
                </v-btn>
              </v-form>
            </v-card-text>

            <v-card-actions class="px-6 px-sm-8 pb-8 pt-0 flex-column align-stretch">
              <p class="text-body-2 text-center text-medium-emphasis mb-0">
                Уже есть аккаунт?
                <NuxtLink to="/login" class="manager-reg-link font-weight-bold text-decoration-none">
                  Войти
                </NuxtLink>
              </p>
            </v-card-actions>
          </v-card>

          <v-card
            v-else
            class="manager-reg-card"
            elevation="6"
            rounded="xl"
          >
            <v-card-text class="pa-8 pa-sm-10 text-center">
              <v-avatar size="72" color="manager" variant="tonal" class="mb-4">
                <v-icon icon="mdi-email-fast-outline" size="40" color="manager" />
              </v-avatar>
              <h2 class="text-h5 font-weight-bold">
                Напишите нам
              </h2>
              <p class="mt-3 text-body-1 text-medium-emphasis mx-auto" style="max-width: 26rem;">
                Подскажем, как получить доступ к платформе в роли рекрутера, и поможем с регистрацией.
              </p>
              <div class="mt-8 d-flex flex-column ga-3 mx-auto" style="max-width: 22rem;">
                <v-btn
                  :href="`mailto:${companyEmail}`"
                  prepend-icon="mdi-email-outline"
                  block
                  rounded="xl"
                  size="large"
                  color="manager"
                  variant="flat"
                >
                  {{ companyEmail }}
                </v-btn>
                <v-btn
                  href="https://t.me/HR_GLAZYRINAinfo"
                  target="_blank"
                  rel="noopener noreferrer"
                  prepend-icon="mdi-send"
                  block
                  rounded="xl"
                  size="large"
                  color="manager"
                  variant="outlined"
                >
                  Написать в Telegram
                </v-btn>
              </div>
              <p class="mt-8 text-caption text-medium-emphasis mb-0 mx-auto" style="max-width: 28rem;">
                Регистрация только по приглашению. Если что-то пошло не так со ссылкой — просто напишите, пришлём новую.
              </p>
            </v-card-text>
          </v-card>

        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped lang="scss">
.manager-reg-page {
  min-height: 100%;
}

.manager-reg-card {
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
  overflow: hidden;

  &--muted {
    background: rgb(var(--v-theme-surface));
    border-radius: 24px;
    border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
  }
}

.manager-reg-banner {
  background: linear-gradient(
    135deg,
    rgb(var(--v-theme-manager)) 0%,
    rgba(var(--v-theme-manager), 0.88) 55%,
    rgba(var(--v-theme-manager), 0.75) 100%
  );
  color: white;

  &__avatar {
    background: white !important;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }

  &__subtitle {
    opacity: 0.95;
    max-width: 22rem;
    margin-left: auto;
    margin-right: auto;
  }
}

.manager-reg-link {
  color: rgb(var(--v-theme-manager));

  &:hover {
    text-decoration: underline !important;
  }
}

.manager-reg-submit {
  font-weight: 700;
  letter-spacing: 0.02em;
}
</style>
