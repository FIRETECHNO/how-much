<script setup lang="ts">
useHead({
  title: 'Найдите сотрудников без собеседований — смотрите видеовизитки кандидатов',
  meta: [
    {
      name: 'description',
      content: 'Для предпринимателей, которые устали искать кадры. Видео-кандидаты в продажах, маркетинге и ассистировании — ежедневно пополняются.'
    },
    // Open Graph (Facebook, WhatsApp, Telegram и др.)
    { property: 'og:title', content: 'Найдите сотрудников без собеседований — смотрите видеовизитки кандидатов' },
    {
      property: 'og:description',
      content: 'Для предпринимателей, которые устали искать кадры. Видео-кандидаты в продажах, маркетинге и ассистировании — ежедневно пополняются.'
    },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://how-much.firetechno.ru/landing/employer' },
    { property: 'og:image', content: 'https://how-much.firetechno.ru/logo.png' },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:locale', content: 'ru_RU' },

    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Найдите сотрудников без собеседований — смотрите видеовизитки кандидатов' },
    {
      name: 'twitter:description',
      content: 'Для предпринимателей, которые устали искать кадры. Видео-кандидаты в продажах, маркетинге и ассистировании — ежедневно пополняются.'
    },
    { name: 'twitter:image', content: 'https://how-much.firetechno.ru/logo.png' },
  ],
  link: [
    { rel: 'canonical', href: 'https://how-much.firetechno.ru/landing/employer' }
  ]
})

const steps = [
  {
    number: 1,
    title: 'Регистрируетесь и оплачиваете подписку',
    description: 'Меньше минуты — и у вас доступ к базе кандидатов.'
  },
  {
    number: 2,
    title: 'Получаете доступ к видеовизиткам',
    description: 'Каждый кандидат проходит видео-интервью. Вы видите его коммуникацию, мотивацию, адекватность и стиль работы.'
  },
  {
    number: 3,
    title: 'Смотрите, фильтруете, выбираете',
    description: 'Видеоформат позволяет понять человека за 1–2 минуты просмотра.'
  },
  {
    number: 4,
    title: 'Приглашаете лучших прямо в работу',
    description: 'На собеседование зовёте только тех, кто уже понравился по видео.'
  }
]
const advantages = [
  'Экономия времени и нервов: минус десятки часов на первичные звонки и просмотр резюме.',
  'Честная оценка: видно, как человек говорит, думает, реагирует, а не только что написал в резюме.',
  'Единый стандарт интервью: всем задают одинаковую базу.',
  'Поддерживает любой масштаб бизнеса: от маленьких команд до крупных отделов.',
  'Особенно эффективно для быстрых позиций: продажи, маркетинг, ассистенты, администраторы.',
  'Подписка дешевле и быстрее, чем найм рекрутера или HR-агентства.',
  'Можно закрывать вакансии за 1–3 дня.'
]
</script>
<template>
  <v-container>
    <v-row class="d-flex justify-center">
      <v-col cols="12" md="10" lg="9">
        <v-row class="d-flex justify-center align-center" style="min-height: 80vh;">
          <v-col cols="12" lg="6">
            <h1 class="text-xl sm:text-2xl md:text-3xl font-bold leading-tight my-5" style="text-transform: uppercase;">
              Найдите сотрудников без собеседований!<br /> Смотрите готовые видеовизитки маркетологов
            </h1>
            <h3 class="text-sm md:text-lg md:font-bold">
              Для предпринимателей, которые устали искать кадры.
              Видео-кандидаты в продажах, маркетинге и ассистировании — ежедневно пополняются
            </h3>
            <v-btn class="button mt-6 d-none d-lg-flex" size="x-large" to="/registration/employer">
              <b>Оформить подписку и начать подбор</b>
            </v-btn>
          </v-col>
          <v-col cols="12" lg="6" class="d-flex align-center">
            <LandingMainImageSelect />
          </v-col>
          <v-col cols="12" class="d-flex justify-center align-center">
            <v-btn class="button mt-6 d-flex d-lg-none" size="x-large" to="/registration/employer">
              <b>Оформить подписку и начать</b>
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
            <LandingCurvedList :color="'employer'" :items="advantages" />
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
            <h3 class="text-lg md:text-xl font-bold mb-8">Хватит тратить время на поиск сотрудников вручную!</h3>
            <p>Получите постоянный поток проверенных кандидатов в удобном видеоформате.</p>
          </v-col>
          <v-col cols="12" md="6" class="d-flex justify-center align-center">
            <v-btn class="button mt-6" size="x-large" to="/registration/employer">
              <b>Оформить подписку и начать</b>
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
  background-color: rgb(var(--v-theme-employer));
  color: white;
  border-radius: 20px;
}

.current-bg {
  background-color: rgb(var(--v-theme-employer));
}

.circle {
  border-radius: 9999px;
}

.hero-container {
  height: 50vh;
  aspect-ratio: 1;
  background-image: url("/landing/employer-hero-image.png");
  background-position: top;
  background-size: cover;
}

.hero-second-layer {
  background-color: rgb(var(--v-theme-employer));
  aspect-ratio: 1;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.hero-first-layer {
  z-index: 0;
  background-color: rgba(var(--v-theme-employer), 0.5);
  aspect-ratio: 1;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>