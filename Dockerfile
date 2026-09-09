# Dockerfile para Render.com / Cloud Run / Railway
FROM node:20-slim AS builder

WORKDIR /app

# Instalar dependencias
COPY package.json package-lock.json* bun.lock* ./
RUN npm install

# Copiar código fuente y compilar
COPY . .
RUN npm run build

# Entorno de ejecución de producción
FROM node:20-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/server.cjs"]
