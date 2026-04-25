# Dockerfile para o backend do Sistema de Busca de Passagens Aéreas
FROM node:18-alpine

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências
RUN npm ci --only=production

# Copia o restante do código
COPY . .

# Cria diretório de dados se não existir
RUN mkdir -p data

# Expõe a porta
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3001/ || exit 1

# Comando para iniciar a aplicação
CMD ["node", "index.js"]
