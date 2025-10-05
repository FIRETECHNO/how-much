<script setup lang="ts">
import { useField, useForm } from 'vee-validate'
import _ from 'lodash'

let router = useRouter()
const auth = useAuth()
let { user } = storeToRefs(auth);

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
      if (value?.length === 0) return 'введите фамилию, имя'
      if (value?.length < 4) return 'слишком короткое имя и фамилия'
      if (value?.length > 200) return 'слишком длинное имя и фамилия'
      return true
    },
    email(value: string) {
      if (value?.length === 0) return 'введите почту'
      if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(value))
        return 'неправильно ведено'
      return true
    },
    password(value: string) {
      if (value?.length === 0) return 'введите пароль'
      if (value?.length < 8) return 'минимум 8 символов'
      if (value?.length > 30) return 'слишком длинный пароль'
      return true
    },
    agreement(value: boolean) {
      if (value !== true) return 'Необходимо ваше согласие на обработку данных'
      return true
    },
  },
})

let name = useField<string>('name')
let email = useField<string>('email')
let password = useField<string>('password')
let agreement = useField<boolean>('agreement')

let show_password = ref(false)
let loading = ref(false)

const submit = handleSubmit(async values => {
  return;
  loading.value = true
  let res = await auth.registration(Object.assign(values, {
    roles: ["manager"],
  }))

  if (res)
    router.push(`/me`)

  loading.value = false
})
</script>
<template>
  <v-container>
    <BackButton />

    <v-col cols="12" xs="12" sm="10" md="7" lg="5" class="mt-4 ma-auto">
      <v-card class="d-flex flex-column 
        justify-center align-center 
        text-center w-100 pl-6 pr-6 
        pt-4 pb-6 rounded-lg">
        <div class="text-h6 font-weight-bold">
          Регистрация
        </div>

        <v-form class="mt-6 w-100" @submit.prevent="submit">
          <v-text-field label="ФИО" type="name" placeholder="Иван Иванов Иванович" v-model="name.value.value"
            :error-messages="name.errors.value" variant="outlined" density="compact" class="w-100" />

          <v-text-field label="Email" type="email" placeholder="vasya@ya.ru" v-model="email.value.value"
            :error-messages="email.errors.value" variant="outlined" density="compact" class="w-100 mt-1" />

          <v-text-field label="Пароль" v-model="password.value.value"
            :append-inner-icon="show_password ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append-inner="show_password = !show_password" :type="show_password ? 'text' : 'password'"
            :error-messages="password.errorMessage.value" variant="outlined" density="compact" class="w-100 mt-1" />

          <v-checkbox v-model="agreement.value.value" :error-messages="agreement.errorMessage.value" class="mt-2">
            <template v-slot:label>
              <div class="text-caption text-left">
                Я согласен на
                <NuxtLink to="/personal-data-policy" @click.stop class="text-primary">
                  обработку персональных данных
                </NuxtLink>
                и принимаю условия
                <NuxtLink to="/privacy-policy" @click.stop class="text-primary">
                  политики конфиденциальности
                </NuxtLink>
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
    </v-col>
  </v-container>
</template>