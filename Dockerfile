FROM node:23-alpine3.20 AS builder
WORKDIR /app

# копируем env-файл
COPY .env.frontend .env

# загружаем все переменные в shell
SHELL ["/bin/sh", "-c"]

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# экспортируем ВСЕ переменные из .env и билдим
RUN set -a \
 && . ./.env \
 && set +a \
 && npm run build


FROM node:23-alpine3.20
WORKDIR /app

# копируем env-файл
COPY .env.frontend .env

SHELL ["/bin/sh", "-c"]

# экспорт env для runtime
RUN set -a \
 && . ./.env \
 && set +a

COPY --from=builder /app/.output ./.output
COPY --from=builder /app/package.json /app/package-lock.json ./
RUN npm ci --omit=dev

CMD ["node", ".output/server/index.mjs"]
