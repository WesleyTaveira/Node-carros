# Estágio 1: Builder - Instala dependências e compila o TypeScript
FROM node:18-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --include=dev && npm install -g typescript
COPY . .
RUN npm run build # Este comando deve compilar seu TS para JS na pasta /dist

# Estágio 2: Runner - Imagem final, leve e pronta para produção
FROM node:18-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=builder /usr/src/app/dist ./dist
CMD [ "node", "dist/server.js" ]