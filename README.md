# factum-edu

## Setup

Make sure to install the dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm run dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm run build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm run preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Документация

Генерация и просмотр документации автоматизированы и доступны прямо в приложении.

Скрипты:

```bash
# Сгенерировать всю документацию
npm run docs

# Отдельно: TypeScript API (composables/stores/types/server/utils)
npm run docs:types

# Отдельно: Документация компонентов Vue (из каталога components)
npm run docs:components

# Отдельно: Спецификация OpenAPI (хранится в public/docs/openapi.yaml)
npm run docs:api
```

Просмотр:

- Индекс документации: http://localhost:3011/docs/
- API (OpenAPI, ReDoc): http://localhost:3011/api-docs.html
- TypeScript API (TypeDoc): http://localhost:3011/docs/typedoc/
- Компоненты (Markdown-файлы): http://localhost:3011/docs/components/

Где править:

- Настройки TypeDoc: `docs/config/typedoc.json` (использует `docs/config/tsconfig.docs.json` для алиасов Nuxt)
- Настройки vue-docgen-cli: `docs/config/docgen.config.cjs`
- Описание REST API (исходник): `docs/openapi/openapi.yaml` (копируется в `public/docs/openapi.yaml` при `npm run docs:api`)
