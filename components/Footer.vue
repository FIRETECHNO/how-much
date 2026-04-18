<script setup lang="ts">
const currentYear = new Date().getFullYear()

type FooterLink =
  | { text: string; to: string }
  | { text: string; href: string }

const footerLinks: FooterLink[] = [
  { text: 'Политика конфиденциальности для Рекрутеров', href: '/documents/Пользовательское_соглашение_для_внешних_рекрутеров.pdf' },
  { text: 'Политика конфиденциальности для Работодателя', href: '/documents/Пользовательское_соглашение_для_цифрово\u0438\u0306_платформы_по_поиску_сотрудников.pdf' },
  { text: 'Инструкция', to: '/guide' },
]

const socialLinks: { icon: string; href: string }[] = [
  // { icon: 'mdi-telegram', href: '#' },
]

function isExternal(link: FooterLink): link is { text: string; href: string } {
  return 'href' in link
}
</script>

<template>
  <v-footer class="footer border-t-sm">
    <v-container class="footer__container">
      <v-row class="footer__main py-6 py-md-5" align="start">
        <v-col cols="12" md="4" class="text-center text-md-start pb-2 pb-md-0">
          <NuxtLink to="/" class="footer__brand text-h5 font-weight-bold text-decoration-none">
            Сколько
          </NuxtLink>
          <p class="footer__tagline text-body-2 text-medium-emphasis mt-2 mb-0 mx-auto mx-md-0" style="max-width: 20rem;">
            Видео-интервью и подбор без лишних собеседований
          </p>
        </v-col>

        <v-col cols="12" md="8">
          <nav class="footer__nav" aria-label="Документы и справка">
            <v-btn
              v-for="link in footerLinks"
              :key="link.text"
              :to="isExternal(link) ? undefined : link.to"
              :href="isExternal(link) ? link.href : undefined"
              :target="isExternal(link) ? '_blank' : undefined"
              :rel="isExternal(link) ? 'noopener noreferrer' : undefined"
              variant="text"
              rounded="lg"
              class="footer__link"
            >
              {{ link.text }}
            </v-btn>
          </nav>
        </v-col>
      </v-row>

      <v-divider class="footer__divider opacity-50" />

      <v-row align="center" class="py-4 py-md-3">
        <v-col cols="12" md="8" class="text-center text-md-start text-body-2 text-medium-emphasis">
          © {{ currentYear }} Сколько — Все права защищены.
        </v-col>

        <v-col cols="12" md="4" class="text-center text-md-end pt-3 pt-md-0">
          <v-btn
            v-for="social in socialLinks"
            :key="social.icon"
            :href="social.href"
            target="_blank"
            rel="noopener noreferrer"
            class="mx-1"
            icon
            variant="text"
            size="small"
          >
            <v-icon :icon="social.icon" />
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<style scoped lang="scss">
.footer {
  background: rgb(var(--v-theme-surface));
  padding-bottom: calc(12px + env(safe-area-inset-bottom, 0px)) !important;
}

.footer__brand {
  color: rgb(var(--v-theme-on-surface));
  transition: color 0.2s ease;

  &:hover {
    color: rgb(var(--v-theme-primary));
  }
}

.footer__nav {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 8px;
}

@media (min-width: 960px) {
  .footer__nav {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-end;
    align-items: center;
    gap: 4px 8px;
  }
}

.footer__link {
  height: auto !important;
  min-height: 44px;
  padding: 10px 14px !important;
  text-transform: none;
  letter-spacing: normal;
  color: rgb(var(--v-theme-on-surface)) !important;

  :deep(.v-btn__content) {
    white-space: normal;
    text-align: start;
    line-height: 1.4;
    justify-content: flex-start;
  }

  @media (min-width: 960px) {
    flex: 0 1 auto;
    max-width: 100%;
    min-height: 40px;
    padding-inline: 12px !important;

    :deep(.v-btn__content) {
      text-align: center;
      justify-content: center;
    }
  }
}

@media (max-width: 959px) {
  .footer__link {
    width: 100%;
    border-radius: 12px !important;
    background: rgba(var(--v-theme-on-surface), 0.04) !important;
  }
}
</style>
