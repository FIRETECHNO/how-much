<script setup lang="ts">
import { useTheme } from "vuetify"

const theme = useTheme()
const router = useRouter()
const savedTheme = useCookie('theme')
const userStore = useAuth();

let drawer = ref(false);
let dialog = ref(false);

if (['light', 'dark'].includes(String(savedTheme.value))) {
  theme.global.name.value = String(savedTheme.value);
}

const navigationItems: any[] = [
  // { title: 'Панель управления', path: '/admin', icon: 'mdi-view-dashboard-outline' },
  // { title: 'Вакансии', path: '/admin/jobs', icon: 'mdi-briefcase-outline' },
  // { title: 'Отклики', path: '/admin/responses', icon: 'mdi-file-account-outline' },
]

function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? "light" : "dark"
  savedTheme.value = theme.global.name.value
}

async function logOut() {
  dialog.value = false;
  await userStore.logout();
}
</script>

<template>
  <v-app>
    <v-app-bar flat border>
      <v-container class="d-flex align-center">
        <NuxtLink to="/" class="text-decoration-none text-high-emphasis">
          <div class="font-weight-bold text-h6">Сколько?</div>
        </NuxtLink>

        <v-spacer></v-spacer>

        <div class="hidden-sm-and-down d-flex align-center">
          <v-btn v-for="item in navigationItems" :key="item.path" :to="item.path" variant="text" class="mx-1">
            {{ item.title }}
          </v-btn>

          <v-btn icon @click="toggleTheme" title="Переключить тему">
            <v-icon icon="mdi-theme-light-dark"></v-icon>
          </v-btn>

          <v-menu location="bottom end">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" class="ml-2">
                <v-avatar size="32" class="mr-2 border">
                  <span v-if="userStore.user?.name">{{ userStore.user.name[0] }}</span>
                </v-avatar>
                {{ userStore.user?.name }}
                <v-icon icon="mdi-chevron-down"></v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item to="/admin/settings" prepend-icon="mdi-cog-outline">
                <v-list-item-title>Настройки</v-list-item-title>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item @click="dialog = true" prepend-icon="mdi-logout" base-color="error">
                <v-list-item-title>Выйти</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>

        <v-app-bar-nav-icon class="hidden-md-and-up" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      </v-container>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" location="right" temporary>
      <v-list>
        <v-list-item :title="userStore.user?.name" :subtitle="userStore.user?.email">
          <template v-slot:prepend>
            <v-avatar class="border">
              <span v-if="userStore.user?.name">{{ userStore.user.name[0] }}</span>
            </v-avatar>
          </template>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list nav>
        <v-list-item v-for="item in navigationItems" :key="item.path" :to="item.path" :prepend-icon="item.icon"
          :title="item.title"></v-list-item>
      </v-list>

      <template v-slot:append>
        <div class="pa-2">
          <!-- <v-btn block variant="tonal" prepend-icon="mdi-cog-outline" to="/admin/settings" class="mb-2">
            Настройки
          </v-btn> -->
          <v-btn block color="red" variant="tonal" prepend-icon="mdi-logout" @click="dialog = true">
            Выйти
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-main>
      <slot />
    </v-main>

    <v-dialog v-model="dialog" max-width="400">
      <v-card title="Выйти из аккаунта?" text="Вы уверены, что хотите завершить текущую сессию?">
        <template v-slot:actions>
          <v-spacer></v-spacer>
          <v-btn text="Отмена" @click="dialog = false"></v-btn>
          <v-btn text="Да, выйти" color="primary" @click="logOut"></v-btn>
        </template>
      </v-card>
    </v-dialog>

    <Footer />
  </v-app>
</template>