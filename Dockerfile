# 1. Базовый образ Node.js
FROM node:20-alpine

# 2. Рабочая директория
WORKDIR /app

# 3. Копируем package.json и package-lock.json
COPY package*.json ./

# 4. Устанавливаем зависимости
RUN npm ci

# 5. Копируем весь проект
COPY . .

# 6. Сборка Nuxt
RUN npm run build

# 7. Порт внутри контейнера (совпадает с твоим PORT)
ENV PORT=3000

# 8. Дополнительные переменные окружения
ENV NUXT_PUBLIC_ADMIN_EMAILS="grishadzyin@gmail.com,innokentiy.online@ya.ru,glazyrina@anna-glazyrina.ru,rukovich.arina@yandex.ru"

# 9. Экспонируем порт
EXPOSE 3000

# 10. Команда запуска Nuxt production
CMD ["node", ".output/server/index.mjs"]
