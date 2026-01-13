<script setup lang="ts">
const router = useRouter()

</script>
<template>
  <v-row>
    <v-col cols="12" md="4">
      <div class="employer card" @click="router.push('/registration/employer')">
        <h1 class="sm:text-lg md:text-xl lg:text-2xl font-semibold text-white leading-tight">
          Я РАБОТОДАТЕЛЬ
        </h1>
        <div class="w-100 d-flex justify-end">
          <img src="/icons/employer.png" alt="">
        </div>
      </div>
    </v-col>
    <v-col cols="12" md="4">
      <div class="employee card" @click="router.push('/registration/employee')">
        <h1 class="sm:text-lg md:text-xl lg:text-2xl font-semibold text-white leading-tight">
          Я СОТРУДНИК
        </h1>
        <div class="w-100 d-flex justify-end">
          <img src="/icons/employee.png" alt="">
        </div>
      </div>
    </v-col>
    <v-col cols="12" md="4">
      <div class="manager card" @click="router.push('/registration/manager')">
        <h1 class="sm:text-lg md:text-xl lg:text-2xl font-semibold text-white leading-tight">
          Я РЕКРУТЕР
        </h1>
        <div class="w-100 d-flex justify-end">
          <img src="/icons/manager.png" alt="">
        </div>
      </div>
    </v-col>
  </v-row>
</template>
<style scoped lang="scss">
.card {
  border-radius: 40px;

  padding: 25px;
  padding-left: 40px;
  padding-top: 40px;
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.08);
    opacity: 0;
    transition: opacity 0.2s ease;
    pointer-events: none;
    border-radius: 40px;
  }

  &:hover::before {
    opacity: 1;
  }

  img {
    max-height: clamp(12.5rem, 7.5284rem + 14.2045vw, 18.75rem); // 200->300
  }
}

.employee {
  background-color: rgb(var(--v-theme-employee));
}

.employer {
  background-color: rgb(var(--v-theme-employer));
}

.manager {
  background-color: rgb(var(--v-theme-manager));
}
</style>