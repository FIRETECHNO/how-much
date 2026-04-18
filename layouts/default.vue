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
    <v-app-bar flat border class="app-bar--shell">
      <v-container class="d-flex align-center py-2 py-sm-3">
        <NuxtLink to="/" class="text-decoration-none text-high-emphasis d-flex align-center">
          <v-img src="/logo.svg" class="app-bar-logo" height="52" width="52" max-width="60" max-height="60" />
        </NuxtLink>

        <v-spacer></v-spacer>

        <div class="d-flex align-center">
          <v-btn icon @click="toggleTheme" title="Переключить тему">
            <v-icon icon="mdi-theme-light-dark"></v-icon>
          </v-btn>
        </div>
      </v-container>
    </v-app-bar>

    <v-main class="app-main app-main--tinted">
      <div class="app-page-shell">
        <slot />
      </div>
    </v-main>

    <Footer />
  </v-app>
</template>