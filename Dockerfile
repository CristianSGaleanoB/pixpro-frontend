FROM node:22-alpine AS base

RUN corepack enable pnpm
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS development

EXPOSE 4200
CMD ["pnpm", "start", "--host", "0.0.0.0"]

FROM base AS build

COPY . .
RUN pnpm run build

FROM nginx:alpine AS production

COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 4200
CMD ["nginx", "-g", "daemon off;"]
