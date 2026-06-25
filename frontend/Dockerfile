FROM node:latest AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN NEXT_PUBLIC_API_BASE="http://158.178.200.73:8080" \
    NEXT_PUBLIC_IMAGE_BASE="http://158.178.200.73:8080" \
    npm run build

FROM node:alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copie public seulement s'il existe
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]