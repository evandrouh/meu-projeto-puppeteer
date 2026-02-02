# Usar imagem base do Node.js
FROM node:20-slim

# Instalar dependências necessárias para o Puppeteer
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgbm1 \
    libgcc1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    lsb-release \
    xdg-utils \
    && rm -rf /var/lib/apt/lists/*

# Instalar Chromium
RUN apt-get update && apt-get install -y chromium \
    && rm -rf /var/lib/apt/lists/*

# Criar diretório da aplicação
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar código da aplicação
COPY . .

# Compilar TypeScript
RUN npm run build

# Expor a porta
EXPOSE 3000

# Definir variáveis de ambiente padrão
ENV NODE_ENV=production
ENV HEADLESS=true
ENV PORT=3000

# Criar usuário não-root para executar a aplicação
RUN groupadd -r nodeuser && useradd -r -g nodeuser -G audio,video nodeuser \
    && mkdir -p /home/nodeuser/Downloads \
    && chown -R nodeuser:nodeuser /home/nodeuser \
    && chown -R nodeuser:nodeuser /app

# Mudar para usuário não-root
USER nodeuser

# Comando para iniciar a aplicação
CMD ["node", "build/server.js"]
