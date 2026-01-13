<script setup lang="ts">
import { useTheme } from "vuetify";

const theme = useTheme();
let mapPath = computed(() => theme.global.current.value.dark ? "/roadmap-whitetext.svg" : "/roadmap.svg")
</script>
<template>
  <v-container>
    <v-row class="d-flex justify-center align-center">
      <v-col cols="12" md="3" lg="3" xl="4">
        <ClientOnly>
          <LandingMainMessageCloud :variant="'left'" />
        </ClientOnly>
      </v-col>
      <v-col cols="12" md="6" lg="5" xl="4" style="min-height: 72vh !important;" class="d-flex align-center">
        <LandingMainImageSelect />
      </v-col>
      <v-col cols="12" md="3" lg="3" xl="4" class="d-none d-md-flex">
        <ClientOnly>
          <LandingMainMessageCloud :variant="'right'" />
        </ClientOnly>
      </v-col>
    </v-row>

    <v-row style="margin-top: 100px; margin-bottom: 100px;">

      <!-- small screens -->
      <v-col cols="12" class="d-flex d-md-none justify-center align-center flex-column">
        <div class="landing-header">
          <img src="/logo.svg" alt="Логотип"
            style="height: clamp(1.875rem, 0.3835rem + 4.2614vw, 3.75rem); width: clamp(1.875rem, 0.3835rem + 4.2614vw, 3.75rem);"
            class="logo-float" />
          <h1 class="text-xl sm:text-2xl md:text-3xl font-bold  leading-tight break-words">
            колько –– СЕРВИС, СОЕДИНЯЮЩИЙ СОИСКАТЕЛЕЙ И РАБОТОДАТЕЛЕЙ
          </h1>
          <h3 class="text-sm md:text-lg font-bold">
            более 1000 работодателей уже нашли своих сотрудников
          </h3>
        </div>
      </v-col>
      <!-- small screens -->
      <!-- big screens -->
      <v-col cols="12" class="d-none d-md-flex justify-center align-center flex-column">
        <div class="flex items-center">
          <img height="60" width="60" src="/logo.svg" alt="Логотип" class="shrink-0" />
          <h1 class="text-xl sm:text-2xl md:text-3xl font-bold leading-tight">
            колько –– СЕРВИС, СОЕДИНЯЮЩИЙ СОИСКАТЕЛЕЙ И РАБОТОДАТЕЛЕЙ
          </h1>
        </div>
        <h3 class="text-sm md:text-lg font-bold">
          более 1000 работодателей уже нашли своих сотрудников
        </h3>
      </v-col>
      <!-- big screens -->
    </v-row>
    <v-row class="d-flex justify-center">
      <v-col cols="12" class="d-flex justify-center"
        style="margin-bottom: clamp(3.75rem, 1.7614rem + 5.6818vw, 6.25rem);">
        <h1 class="text-xl sm:text-2xl md:text-3xl font-bold  leading-tight">
          КАК ЭТО РАБОТАЕТ?
        </h1>
      </v-col>

      <v-col cols="12" md="10" xl="8">
        <v-img :src="mapPath"></v-img>
      </v-col>
    </v-row>

    <v-row class="d-flex justify-center">
      <v-col cols="12" class="d-flex justify-center" style="margin: clamp(3.75rem, 1.7614rem + 5.6818vw, 6.25rem) 0;  ">
        <h1 class=" text-xl sm:text-2xl md:text-3xl font-bold leading-tight">
          ПОЧЕМУ МЫ?
        </h1>
      </v-col>
      <v-col cols="12" md="10" xl="8">
        <v-row>
          <v-col cols="12" md="4">
            <div class="employer-border pl-6">
              <h1 class=" text-xl sm:text-2xl md:text-3xl font-bold leading-tight">
                БОЛЕЕ 2000
              </h1>
              <h2 class="text-lg sm:text-xl font-normal leading-relaxed">
                РАБОТОДАТЕЛЕЙ УЖЕ НАШЛИ СВОИХ СОТРУДНИКОВ
              </h2>
            </div>
          </v-col>
          <v-col cols="12" md="4">
            <div class="employee-border pl-6">
              <h1 class=" text-xl sm:text-2xl md:text-3xl font-bold leading-tight">
                3123
              </h1>
              <h2 class="text-lg sm:text-xl font-normal leading-relaxed">
                СОТРУДНИКОВ НАШЛИ РАБОТУ <br><br>
                200 МАРКЕТОЛОГОВ<br>
                404 АССИСТЕНТА<br>
                9933 МЕНЕДЖЕРОВ
              </h2>
            </div>
          </v-col>
          <v-col cols="12" md="4">
            <div class="manager-border pl-6">
              <h1 class=" text-xl sm:text-2xl md:text-3xl font-bold leading-tight">
                213
              </h1>
              <h2 class="text-lg sm:text-xl font-normal leading-relaxed">
                РЕКРУТЕРОВ ГОТОВЫ ПРОВЕСТИ СОБЕСЕДОВАНИЯ
              </h2>
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-row class="d-flex justify-center">
      <v-col cols="12" class="d-flex justify-center"
        style="margin-top: clamp(4.375rem, 1.8892rem + 7.1023vw, 7.5rem); margin-bottom: clamp(3.125rem, 2.1307rem + 2.8409vw, 4.375rem);">
        <h1 class="text-xl sm:text-2xl md:text-3xl font-bold leading-tight">
          ВЫБЕРИТЕ РОЛЬ И ЗАРЕГИСТРИРУЙТЕСЬ НА ПЛАТФОРМЕ
        </h1>
      </v-col>
      <v-col cols="12" md="10" xl="8">
        <LandingMainRoleSelect />
      </v-col>
    </v-row>
  </v-container>
</template>
<style scoped lang="scss">
.employee-border {
  border-left: 3px solid rgb(var(--v-theme-employee));
}

.employer-border {
  border-left: 3px solid rgb(var(--v-theme-employer));
}

.manager-border {
  border-left: 3px solid rgb(var(--v-theme-manager));
}

.landing-header {
  display: block;
  overflow: hidden;
  /* clearfix */
}

.logo-float {
  float: left;
  margin-right: 0.25rem;
  /* отступ между логотипом и текстом */
  // margin-bottom: 0.25rem;
  /* небольшой отступ снизу, если текст короткий */
}
</style>