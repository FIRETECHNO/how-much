<script setup lang="ts">
import { useField, useForm } from 'vee-validate'
import { onMounted, ref, watch } from 'vue'
import type { CompanyFromDadata } from '~/types/company.interface'
import { toast } from 'vue3-toastify'
import { useRoute } from 'vue-router'

const route = useRoute()
const router = useRouter()
const auth = useAuth()

let targetCompany = ref<CompanyFromDadata>()

// Сохраняем параметры из URL для отправки на бэкенд
const externalParams = ref({
  name: '',
  inn: '',
  email: '',
  tgId: '',
  tgUsername: '',
})

async function checkCompanyAndDisplayIt(inn: string): Promise<boolean> {
  if (!inn) return false

  try {
    const res = await $fetch<CompanyFromDadata[]>("/api/dadata/search-company", {
      method: "GET",
      query: { q: inn }
    })

    const companies = res.map(suggestion => ({
      value: suggestion.value,
      data: {
        name: {
          full_with_opf: suggestion.data.name?.full_with_opf,
          short_with_opf: suggestion.data.name?.short_with_opf,
          full: suggestion.data.name?.full,
        },
        inn: suggestion.data.inn,
        ogrn: suggestion.data.ogrn,
        okved: suggestion.data.okved,
        kpp: suggestion.data.kpp || null,
        address: { value: suggestion.data.address?.value }
      }
    }))

    if (companies.length > 0) {
      targetCompany.value = companies[0]
      return true
    }

    targetCompany.value = undefined
    return false
  } catch (error) {
    console.error('Ошибка поиска компании:', error)
    return false
  }
}

const { meta, handleSubmit, setValues } = useForm<{
  name: string,
  inn: string,
  email: string,
  password: string,
  agreement: boolean,
}>({
  initialValues: {
    name: '',
    inn: '',
    email: '',
    password: '',
    agreement: false,
  },
  validationSchema: {
    name(value: string) {
      if (!value) return 'Введите ФИО контактного лица'
      if (value.length < 4) return 'Слишком короткое ФИО'
      if (value.length > 200) return 'Слишком длинное ФИО'
      return true
    },
    // async inn(value: string) {
    //   if (!value) return 'Введите ИНН'
    //   if (!/^(\d{10}|\d{12})$/.test(value)) {
    //     return 'ИНН должен состоять из 10 или 12 цифр'
    //   }
    //   return true
    // },
    email(value: string) {
      if (!value) return 'Введите почту'
      if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(value))
        return 'Некорректный формат почты'
      return true
    },
    password(value: string) {
      if (!value) return 'Введите пароль'
      if (value.length < 8) return 'Пароль должен быть не менее 8 символов'
      if (value.length > 30) return 'Слишком длинный пароль'
      return true
    },
    agreement(value: boolean) {
      if (value !== true) return 'Необходимо ваше согласие на обработку данных'
      return true
    },
  },
})

const name = useField<string>('name')
const innField = useField<string>('inn')
const email = useField<string>('email')
const password = useField<string>('password')
const agreement = useField<boolean>('agreement')

// Следим за изменениями ИНН и ищем компанию
watch(() => innField.value.value, async (newVal) => {
  if (newVal.length >= 10) {
    const found = await checkCompanyAndDisplayIt(newVal)
    if (!found) {
      innField.setErrors(['Компания с таким ИНН не найдена'])
    } else {
      innField.setErrors([])
    }
  }
})

// Загрузка данных из URL
onMounted(async () => {
  const query = route.query
  const name = query.name as string || ''
  const inn = query.inn as string || ''
  const email = query.email as string || ''
  const tgId = query.tgId as string || ''
  const tgUsername = query.tgUsername as string || ''

  // Сохраняем для отправки
  externalParams.value = { name, inn, email, tgId, tgUsername }

  // Подставляем в форму
  setValues({
    name,
    inn,
    email,
    password: '',
    agreement: false,
  })

  // Если ИНН есть — сразу ищем компанию
  if (inn) {
    await checkCompanyAndDisplayIt(inn)
  }
})

const show_password = ref(false)
const loading = ref(false)

const submit = handleSubmit(async (values) => {
  if (!targetCompany.value) {
    toast("Непредвиденная ошибка! Перезагрузите страницу", { type: "error" })
    return false
  }

  loading.value = true

  try {
    const toSend = {
      name: values.name,
      email: values.email,
      password: values.password,
      // company: targetCompany.value,
      roles: ["employer"],
      // Передаём внешние параметры для сохранения
      tgId: externalParams.value.tgId,
      tgUsername: externalParams.value.tgUsername,
    }

    const res = await auth.registration(toSend)
    if (res) router.push('/me')
  } catch (error) {
    toast("Ошибка регистрации", { type: "error" })
  } finally {
    loading.value = false
  }
})
</script>
<template>
  <v-container>
    <BackButton />

    <v-col cols="12" xs="12" sm="10" md="7" lg="5" class="mt-4 ma-auto">
      <v-card class="d-flex flex-column 
        justify-center align-center 
        text-center w-100 pa-6 rounded-lg">
        <div class="text-h6 font-weight-bold">
          Регистрация работодателя
        </div>

        <v-form class="mt-6 w-100" @submit.prevent="submit">
          <v-text-field label="ФИО контактного лица" placeholder="Иван Иванов Иванович" v-model="name.value.value"
            :error-messages="name.errors.value" variant="outlined" density="compact" class="w-100" />

          <v-text-field label="ИНН" placeholder="10 или 12 цифр без пробелов" v-model="innField.value.value"
            :error-messages="innField.errors.value" variant="outlined" density="compact" class="w-100 mt-1"
            counter="12" />

          <v-card variant="outlined" border v-if="targetCompany" class="mb-8">
            <v-card-title class="text-h6 pb-1">
              {{ targetCompany.data.name.short_with_opf }}
            </v-card-title>

            <v-card-subtitle>
              {{ targetCompany.data.name.full }}
            </v-card-subtitle>

            <v-divider class="mx-4 my-2"></v-divider>

            <v-list density="compact">
              <v-list-item :title="targetCompany.data.inn" subtitle="ИНН" prepend-icon="mdi-identifier"></v-list-item>
              <v-list-item :title="targetCompany.data.ogrn" subtitle="ОГРН" prepend-icon="mdi-identifier"></v-list-item>
              <v-list-item v-if="targetCompany.data.kpp" :title="targetCompany.data.kpp" subtitle="КПП"
                prepend-icon="mdi-identifier"></v-list-item>
              <v-list-item :title="targetCompany.data.address.value" subtitle="Юридический адрес"
                prepend-icon="mdi-map-marker-outline"></v-list-item>
              <v-list-item :title="targetCompany.data.okved" subtitle="Основной вид деятельности (ОКВЭД)"
                prepend-icon="mdi-briefcase-outline"></v-list-item>
            </v-list>
          </v-card>

          <v-text-field label="Рабочий Email" type="email" placeholder="hr@company.com" v-model="email.value.value"
            :error-messages="email.errors.value" variant="outlined" density="compact" class="w-100 mt-1" />

          <v-text-field label="Пароль" v-model="password.value.value"
            :append-inner-icon="show_password ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append-inner="show_password = !show_password" :type="show_password ? 'text' : 'password'"
            :error-messages="password.errorMessage.value" variant="outlined" density="compact" class="w-100 mt-1" />

          <v-checkbox v-model="agreement.value.value" :error-messages="agreement.errorMessage.value" class="mt-2">
            <template v-slot:label>
              <div class="text-caption text-left">
                Я согласен с
                <a href="/documents/Пользовательское_соглашение_для_цифровой_платформы_по_поиску_сотрудников.pdf"
                  target="_blank" @click.stop class="text-primary">
                  с политикой конфиденциальности и обработки персональных данных
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
    </v-col>
  </v-container>
</template>