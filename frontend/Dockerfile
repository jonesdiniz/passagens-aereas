# Dockerfile para o frontend do Sistema de Busca de Passagens Aéreas
FROM node:18-alpine AS builder

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências
RUN npm ci

# Copia o restante do código
COPY . .

# Builda a aplicação
RUN npm run build

# Estágio de produção com nginx
FROM nginx:alpine

# Copia o build do React para o nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia configuração customizada do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expõe a porta
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Comando para iniciar o nginx
CMD ["nginx", "-g", "daemon off;"]
