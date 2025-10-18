# ---------- Этап сборки ----------
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ENV NUXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3011

# Сборка Nuxt
RUN npm run build

# ---------- Этап продакшена ----------
FROM node:20-alpine AS production
WORKDIR /app

COPY --from=builder /app/.output ./.output
COPY package*.json ./

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3011
EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
