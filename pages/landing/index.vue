<script setup lang="ts"></script>
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
      <v-col cols="12" class="d-flex justify-center align-center flex-column">
        <div class="flex items-center">
          <img height="60" width="60" src="/logo.png" alt="Логотип" class="shrink-0" />
          <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
            колько –– СЕРВИС, СОЕДИНЯЮЩИЙ СОИСКАТЕЛЕЙ И РАБОТОДАТЕЛЕЙ
          </h1>
        </div>
        <h3 class="text-sm md:text-lg font-bold text-gray-600">
          более 1000 работодателей уже нашли своих сотрудников
        </h3>
      </v-col>
    </v-row>

    <v-row class="d-flex justify-center">
      <v-col cols="12" class="d-flex justify-center"
        style="margin-bottom: clamp(3.75rem, 1.7614rem + 5.6818vw, 6.25rem);">
        <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
          КАК ЭТО РАБОТАЕТ?
        </h1>
      </v-col>

      <v-col cols="12" md="10" xl="8">
        <v-img src="/roadmap.svg"></v-img>
      </v-col>
    </v-row>

    <v-row class="d-flex justify-center">
      <v-col cols="12" class="d-flex justify-center" style="margin: clamp(3.75rem, 1.7614rem + 5.6818vw, 6.25rem) 0;  ">
        <h1 class=" text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
          ПОЧЕМУ МЫ?
        </h1>
      </v-col>
      <v-col cols="12" md="10" xl="8">
        <v-row>
          <v-col cols="12" md="4">
            <div class="employer-border pl-6">
              <h1 class=" text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                БОЛЕЕ 2000
              </h1>
              <h2 class="text-lg sm:text-xl font-normal text-gray-800 leading-relaxed">
                РАБОТОДАТЕЛЕЙ УЖЕ НАШЛИ СВОИХ СОТРУДНИКОВ
              </h2>
            </div>
          </v-col>
          <v-col cols="12" md="4">
            <div class="employee-border pl-6">
              <h1 class=" text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                3123
              </h1>
              <h2 class="text-lg sm:text-xl font-normal text-gray-800 leading-relaxed">
                СОТРУДНИКОВ НАШЛИ РАБОТУ <br><br>
                200 МАРКЕТОЛОГОВ<br>
                404 АССИСТЕНТА<br>
                9933 МЕНЕДЖЕРОВ
              </h2>
            </div>
          </v-col>
          <v-col cols="12" md="4">
            <div class="manager-border pl-6">
              <h1 class=" text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                213
              </h1>
              <h2 class="text-lg sm:text-xl font-normal text-gray-800 leading-relaxed">
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
        <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
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
</style>