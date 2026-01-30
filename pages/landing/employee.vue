<script setup lang="ts">
useHead({
  title: 'Найди работу быстрее — одно видео-интервью и ты в подборке',
  meta: [
    {
      name: 'description',
      content: 'Запишись на короткое интервью с рекрутером. Работодатели сразу видят тебя в деле — без бесконечных собесов.'
    },
    // Open Graph (Facebook, WhatsApp, Telegram и др.)
    { property: 'og:title', content: 'Найди работу быстрее — одно видео-интервью и ты в подборке' },
    {
      property: 'og:description',
      content: 'Запишись на короткое интервью с рекрутером. Работодатели сразу видят тебя в деле — без бесконечных собесов.'
    },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://how-much.firetechno.ru/landing/employee' }, // ← замените на ваш реальный URL
    { property: 'og:image', content: 'https://how-much.firetechno.ru/logo.png' }, // ← обязательно HTTPS
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:locale', content: 'ru_RU' },
  ],
  link: [
    { rel: 'canonical', href: 'https://how-much.firetechno.ru/landing/employee' }
  ]
})

const steps = [
  {
    number: 1,
    title: 'Выбираешь дату',
    description: 'Регистрация занимает меньше минуты.'
  },
  {
    number: 2,
    title: 'Получаешь чек-лист «50 вопросов для успешного прохождения интервью»',
    description: 'Готовишься спокойно. Вопросов много — на интервью дадут только 5 случайных.'
  },
  {
    number: 3,
    title: 'Проходишь видео-интервью (8–12 минут)',
    description: 'Рекрутер задаёт основные вопросы + 5 рандомных из списка. Это и есть твоя видеовизитка.'
  },
  {
    number: 4,
    title: 'Работодатели экономят время — и зовут быстрее',
    description: 'Они смотрят тебя заранее, поэтому на собеседовании вы сразу обсуждаете условия, задачи и мотивацию.'
  }
]
const advantages = [
  "Максимальная экономия времени: одно интервью вместо 10 одинаковых собеседований.",
  "Работодатели уже знают, кто ты — шанс на приглашение выше.",
  "Без поиска клиентов: платформа сама приводит поток кандидатов",
  "Подготовка под контролем: чек-лист из 50 вопросов приходит сразу.",
  "Формат живой и честный — видно реальные навыки, а не отрепетированный текст.",
  "Собеседования только по делу, без воды. Конфиденциально. Бесплатно.",
  "Подходит маркетологам, продажникам, ассистентам и молодым специалистам 18–35."
];
</script>
<template>
  <v-container>
    <v-row class="d-flex justify-center">
      <v-col cols="12" md="10" lg="9">
        <v-row class="d-flex justify-center align-center" style="min-height: 80vh;">
          <v-col cols="12" lg="6">
            <h1 class="text-xl sm:text-2xl md:text-3xl font-bold leading-tight my-5" style="text-transform: uppercase;">
              Найди работу быстрее. <br />
              Одно видео-интервью — и ты уже
              в подборке у работодателей.
            </h1>
            <h3 class="text-sm md:text-lg md:font-bold">
              Запишись на короткое интервью с рекрутером. Работодатели сразу видят тебя в деле — без бесконечных
              собесов.
            </h3>
            <v-btn class="button mt-6 d-none d-lg-flex" size="x-large" to="/registration/employee">
              <b>Записаться на интервью</b>
            </v-btn>
          </v-col>
          <v-col cols="12" lg="6" class="d-flex align-center">
            <LandingMainImageSelect />
          </v-col>
          <v-col cols="12" class="d-flex justify-center align-center">
            <v-btn class="button mt-6 d-flex d-lg-none" size="x-large" to="/registration/employee">
              <b>Записаться на интервью</b>
            </v-btn>
          </v-col>
        </v-row>

        <v-row style="margin-bottom: clamp(3.125rem, 0.6392rem + 7.1023vw, 6.25rem);">
          <v-col cols="12">
            <h1 class="text-xl sm:text-2xl md:text-3xl font-bold leading-tight my-5" style="text-transform: uppercase;">
              Как это работает
            </h1>

            <div class="relative pl-8">
              <div class="absolute left-0 top-0 bottom-0 current-bg" style="width: 3px;"></div>
              <div v-for="(step, index) in steps" :key="index" class="mb-12 relative">
                <div
                  style="width: 12px; height: 12px; border-radius: 999px; left: calc(-32px - 4px); top: calc(50% - 16px)"
                  class="absolute current-bg">
                </div>
                <h3 class="text-lg md:text-xl font-bold">{{ step.number }}. {{ step.title }}</h3>
                <p class="text-lg">{{ step.description }}</p>
              </div>

              <i class="text-lg">Первичные интервью больше не нужны.</i>
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-row class="d-flex justify-center">
      <v-col cols="12" md="10" lg="9">
        <h1 class="text-xl sm:text-2xl md:text-3xl font-bold leading-tight my-5" style="text-transform: uppercase;">
          Преимущества
        </h1>
      </v-col>
    </v-row>
    <!-- big screen -->
    <v-row class="d-none d-md-flex" style="height: 80vh; position: relative;">
      <v-col cols="12">
        <div style="position: absolute; left: calc(-40vh); top: 0; display: flex; align-items: center;">
          <div style="height: 80vh;" class="d-flex align-center hero-first-layer">
            <div style="height: 65vh;" class="d-flex align-center hero-second-layer">
              <div class="hero-container circle">
              </div>
            </div>
          </div>
          <div style="height: 80vh;">
            <LandingCurvedList :color="'employee'" :items="advantages" />
          </div>
        </div>
      </v-col>
    </v-row>
    <!-- small screen -->
    <v-row class="d-flex d-md-none">
      <v-col cols="12" v-for="value in advantages">
        {{ value }}
      </v-col>
    </v-row>

    <v-row class="d-flex justify-center" style="margin: clamp(3.125rem, -4.3324rem + 21.3068vw, 12.5rem) 0 100px 0;">
      <v-col cols="12" md="10" lg="9">
        <v-row>
          <v-col cols="12" md="6">
            <h3 class="text-lg md:text-xl font-bold mb-8">Хочешь сэкономить недели и выйти на оффер быстрее?</h3>
            <p>Пройди одно видео-интервью — и переходи сразу к важным собеседованиям.</p>
          </v-col>
          <v-col cols="12" md="6" class="d-flex justify-center align-center">
            <v-btn class="button mt-6" size="x-large" to="/registration/employee">
              <b>Выбрать дату интервью</b>
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>
<style scoped lang="scss">
.button {
  padding: 0 40px 0 40px;
  background-color: rgb(var(--v-theme-employee));
  color: white;
  border-radius: 20px;
}

.current-bg {
  background-color: rgb(var(--v-theme-employee));
}

.circle {
  border-radius: 9999px;
}

.hero-container {
  height: 50vh;
  aspect-ratio: 1;
  background-image: url("/landing/employee-hero-image.png");
  background-position: top;
  background-size: cover;
}

.hero-second-layer {
  background-color: rgb(var(--v-theme-employee));
  aspect-ratio: 1;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.hero-first-layer {
  z-index: 0;
  background-color: rgba(var(--v-theme-employee), 0.5);
  aspect-ratio: 1;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>