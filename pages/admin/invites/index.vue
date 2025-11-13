<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Invite, InviteStatus, CreateInvitePayload } from "../../../types/invite.interface"
import AdminApi from '~/api/AdminApi'
import { toast } from "vue3-toastify"

const config = useRuntimeConfig()

const invites = ref<Invite[]>([])
const loading = ref(true)

const headers = [
  { title: 'Email', key: 'email', sortable: true },
  { title: 'Роль', key: 'role', sortable: true },
  { title: 'Статус', key: 'status', sortable: true },
  { title: 'Истекает', key: 'expiresAt', sortable: true },
  { title: 'Принято', key: 'acceptedBy', sortable: false },
  { title: 'Действия', key: 'actions', sortable: false },
]

const roles = ['manager',]
let dialog = ref(false)
let formLoading = ref(false)
const form = ref<CreateInvitePayload>({
  email: '',
  role: '',
})
function getStatusConfig(status: InviteStatus): { text: string; color: string } {
  switch (status) {
    case 'pending':
      return { text: 'Ожидает', color: 'warning' }
    case 'accepted':
      return { text: 'Принято', color: 'success' }
    case 'expired':
      return { text: 'Истекло', color: 'error' }
    default:
      return { text: status, color: 'grey' }
  }
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}


async function fetchInvites() {
  loading.value = true
  try {
    const data = await AdminApi.getAllInvites()
    invites.value = data
  } catch (error) {
    console.error('Ошибка при загрузке инвайтов:', error)
    // Можно показать ошибку через toast
  } finally {
    loading.value = false
  }
}

const rules = {
  required: (v: string) => !!v || 'Обязательное поле',
  email: (v: string) => /.+@.+/.test(v) || 'Некорректный email',
}

async function submit() {
  if (!form.value.email || !form.value.role) return

  formLoading.value = true
  try {
    await AdminApi.createInvite(form.value)
    toast.success('Инвайт успешно создан')
    dialog.value = false
    fetchInvites() // обновляем список
    form.value = { email: '', role: '' }
  } catch (error: any) {
    const message = error.data?.message || 'Ошибка при создании инвайта'
    toast.error(message)
  } finally {
    formLoading.value = false
  }
}

function resetAndClose() {
  dialog.value = false
  form.value = { email: '', role: '' }
}

async function copyInviteLink(token: string, role: string) {
  const fullUrl = new URL(`/registration/${role}?invite_token=${encodeURIComponent(token)}`, config.public.siteUrl).toString()
  try {
    await navigator.clipboard.writeText(fullUrl)
    toast.success('Ссылка скопирована в буфер обмена')
  } catch (err) {
    toast.error('Не удалось скопировать ссылку')
    console.error('Ошибка копирования:', err)
  }
}

onMounted(() => {
  fetchInvites()
})
</script>

<template>
  <v-container>
    <v-row class="mb-6">
      <v-col class="d-flex align-center">
        <v-btn color="primary" prepend-icon="mdi-plus" @click="dialog = true">
          Создать инвайт
        </v-btn>
      </v-col>
    </v-row>
    <v-row v-if="loading">
      <v-col>
        <v-skeleton-loader type="table-thead, table-tbody" height="400"></v-skeleton-loader>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col>
        <v-data-table :headers="headers" :items="invites" :items-per-page="15" class="elevation-1 rounded-lg"
          density="comfortable">
          <template #item.status="{ item }">
            <v-chip :color="getStatusConfig(item.status).color" size="small" variant="flat">
              {{ getStatusConfig(item.status).text }}
            </v-chip>
          </template>

          <template #item.expiresAt="{ item }">
            {{ formatDate(item.expiresAt) }}
          </template>

          <template #item.acceptedBy="{ item }">
            <v-icon v-if="item.acceptedBy" color="success" size="small" icon="mdi-check-circle-outline"></v-icon>
            <span v-else class="text-grey">—</span>
          </template>

          <template #item.actions="{ item }">
            <v-btn v-if="item.status === 'pending'" size="small" variant="text" icon="mdi-content-copy"
              @click="copyInviteLink(item.token, item.role)" :title="`Скопировать ссылку для ${item.email}`"></v-btn>
            <span v-else class="text-grey text-caption">Истёк/Принят</span>
          </template>
        </v-data-table>
      </v-col>
    </v-row>


    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>Создать приглашение</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="submit">
            <v-text-field v-model="form.email" label="Email" type="email" :rules="[rules.required, rules.email]"
              variant="outlined" clearable></v-text-field>

            <v-select v-model="form.role" :items="roles" label="Роль" :rules="[rules.required]" variant="outlined"
              clearable></v-select>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn @click="resetAndClose">Отмена</v-btn>
          <v-btn color="primary" @click="submit" :loading="formLoading" :disabled="!form.email || !form.role">
            Отправить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>



<style scoped>
.v-data-table :deep(th),
.v-data-table :deep(td) {
  white-space: nowrap;
}
</style>