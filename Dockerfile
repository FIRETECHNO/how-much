FROM node:23-alpine3.20 AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build


FROM node:23-alpine3.20
WORKDIR /app
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/package.json /app/package-lock.json ./
RUN npm ci --omit=dev
CMD ["node", ".output/server/index.mjs"]