FROM node:latest AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ARG NEXT_PUBLIC_API_BASE
ARG NEXT_PUBLIC_IMAGE_BASE
ENV NEXT_PUBLIC_API_BASE=${NEXT_PUBLIC_API_BASE}
ENV NEXT_PUBLIC_IMAGE_BASE=${NEXT_PUBLIC_IMAGE_BASE}

RUN npm run build

FROM node:alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copie public seulement s'il existe
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]