<script setup lang="ts">
import { toast } from 'vue3-toastify';

const props = defineProps({
  // URL для "поделиться" или копирования (обязательный)
  shareUrl: {
    type: String,
    required: true,
  },
  // Заголовок для нативного меню "Поделиться"
  shareTitle: {
    type: String,
    default: 'Поделиться ссылкой',
  },
  // Текст для нативного меню "Поделиться"
  shareText: {
    type: String,
    default: 'Ознакомьтесь с этой вакансией',
  },
});


async function shareContent() {
  if (!props.shareUrl) {
    console.error('ShareButton: URL для "поделиться" не предоставлен.');
    toast("URL не найден, невозможно поделиться.", { type: "error" });
    return;
  }

  const shareData = {
    title: props.shareTitle,
    text: props.shareText,
    url: props.shareUrl,
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
    } catch (err) {

      console.error('Ошибка Web Share API:', err);
    }
  } else {
    try {
      await navigator.clipboard.writeText(props.shareUrl);
      toast("Ссылка скопирована!", { type: "success" });
    } catch (err) {
      toast("Не удалось скопировать ссылку!", { type: "error" });
      console.error('Не удалось скопировать ссылку:', err);
    }
  }
}
</script>

<template>
  <v-btn icon="mdi-share-variant-outline" variant="text" title="Поделиться" @click="shareContent"></v-btn>
</template>