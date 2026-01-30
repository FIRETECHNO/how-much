<script setup lang="ts">
useHead({
  title: 'Зарабатывайте на видео-интервью без поиска клиентов',
  meta: [
    {
      name: 'description',
      content: 'Регистрируйтесь, берите заявки соискателей, проводите интервью и получайте деньги после активации анкеты.'
    },
    // Open Graph
    { property: 'og:title', content: 'Зарабатывайте на видео-интервью без поиска клиентов' },
    {
      property: 'og:description',
      content: 'Регистрируйтесь, берите заявки соискателей, проводите интервью и получайте деньги после активации анкеты.'
    },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://how-much.firetechno.ru/landing/manager' },
    { property: 'og:image', content: 'https://how-much.firetechno.ru/og/manager.png' },
    { property: 'og:image:width', content: '1853' },
    { property: 'og:image:height', content: '957' },
    { property: 'og:locale', content: 'ru_RU' },

    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Зарабатывайте на видео-интервью без поиска клиентов' },
    {
      name: 'twitter:description',
      content: 'Регистрируйтесь, берите заявки соискателей, проводите интервью и получайте деньги после активации анкеты.'
    },
    { name: 'twitter:image', content: 'https://how-much.firetechno.ru/og/manager.png' },
  ],
  link: [
    { rel: 'canonical', href: 'https://how-much.firetechno.ru/landing/manager' }
  ]
})

const steps = [
  {
    number: 1,
    title: 'Регистрируетесь',
    description: 'После подтверждения профиля получаете доступ к базе заявок на интервью.'
  },
  {
    number: 2,
    title: 'Выбираете удобные заявки',
    description: 'Вся очередь кандидатов перед вами. Подтверждаете те слоты, которые подходят по времени.'
  },
  {
    number: 3,
    title: 'Проводите интервью 5–10 минут',
    description: 'Формат простой: основные вопросы + 5 рандомных из чек-листа «50 вопросов для успешного прохождения интервью».'
  },
  {
    number: 4,
    title: 'Кандидат активирует анкету — вы получаете оплату',
    description: 'За каждую успешно активированную видеовизитку начисляется 100 ₽. 10 интервью = 1000 ₽.'
  }
]
const advantages = [
  'Быстрый заработок: 5–10 минут = 100 ₽',
  'Гибкий график: берёте заявки тогда, когда удобно.',
  'Без поиска клиентов: платформа сама приводит поток кандидатов',
  'Бонусы за результат:\n— +100 ₽ за каждую активированную анкету.\n— X2 мотивация, если приводите своих кандидатов (по регламенту и стандарту)',
  'Минимум рутины: готовые вопросы, понятный сценарий, один формат для всех',
  'Подходит начинающим и опытным рекрутерам.',
  'Прозрачная статистика дохода.'
]
</script>
<template>
  <v-container>
    <v-row class="d-flex justify-center">
      <v-col cols="12" md="10" lg="9">
        <v-row class="d-flex justify-center align-center" style="min-height: 80vh;">
          <v-col cols="12" lg="6">
            <h1 class="text-xl sm:text-2xl md:text-3xl font-bold leading-tight my-5" style="text-transform: uppercase;">
              Зарабатывайте на видео-интервью<br>
              без поиска клиентов
            </h1>
            <h3 class="text-sm md:text-lg md:font-bold">
              Регистрируйтесь, берите заявки соискателей, проводите интервью и получайте деньги
              после активации анкеты.
            </h3>
            <v-btn class="button mt-6 d-none d-lg-flex" size="x-large" to="/registration/manager">
              <b>Стать рекрутером</b>
            </v-btn>
          </v-col>
          <v-col cols="12" lg="6" class="d-flex align-center">
            <LandingMainImageSelect />
          </v-col>
          <v-col cols="12" class="d-flex justify-center align-center">
            <v-btn class="button mt-6 d-flex d-lg-none" size="x-large" to="/registration/manager">
              <b>Стать рекрутером</b>
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

              <i class="text-lg">Быстро, прозрачно и без лишней бюрократии</i>
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
            <LandingCurvedList :color="'manager'" :items="advantages" />
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
            <h3 class="text-lg md:text-xl font-bold mb-8">Хотите зарабатывать в удобном ритме
              и без поиска заказчиков?</h3>
            <p>Присоединяйтесь к платформе, проводите короткие видео-интервью и получайте стабильный доход.</p>
          </v-col>
          <v-col cols="12" md="6" class="d-flex justify-center align-center">
            <v-btn class="button mt-6" size="x-large" to="/registration/manager">
              <b>Стать рекрутером платформы</b>
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
  background-color: rgb(var(--v-theme-manager));
  color: white;
  border-radius: 20px;
}

.current-bg {
  background-color: rgb(var(--v-theme-manager));
}

.circle {
  border-radius: 9999px;
}

.hero-container {
  height: 50vh;
  aspect-ratio: 1;
  background-image: url("/landing/manager-hero-image.png");
  background-position: top;
  background-size: cover;
}

.hero-second-layer {
  background-color: rgb(var(--v-theme-manager));
  aspect-ratio: 1;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.hero-first-layer {
  z-index: 0;
  background-color: rgba(var(--v-theme-manager), 0.5);
  aspect-ratio: 1;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>