# 🚀 Guia de Deploy - TikTok Scraper Express API

## 📦 Opções de Deploy

### 1. Deploy Local (Desenvolvimento)

```bash
# Instalar dependências
npm install

# Modo desenvolvimento
npm run start:dev

# Modo produção
npm run build
npm start
```

---

### 2. Deploy com Docker

#### Construir e executar:
```bash
# Construir imagem
docker build -t tiktok-scraper-api .

# Executar container
docker run -d \
  --name tiktok-scraper \
  -p 3000:3000 \
  -e HEADLESS=true \
  -e NODE_ENV=production \
  tiktok-scraper-api
```

#### Ou usar Docker Compose:
```bash
# Iniciar
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar
docker-compose down
```

---

### 3. Deploy no Heroku

```bash
# Instalar Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login

# Criar app
heroku create tiktok-scraper-api

# Adicionar buildpack do Puppeteer
heroku buildpacks:add jontewks/puppeteer

# Deploy
git push heroku main

# Configurar variáveis de ambiente
heroku config:set HEADLESS=true
heroku config:set NODE_ENV=production

# Ver logs
heroku logs --tail
```

---

### 4. Deploy no Railway

1. Acesse [railway.app](https://railway.app)
2. Conecte seu repositório GitHub
3. Configure as variáveis de ambiente:
   - `HEADLESS=true`
   - `NODE_ENV=production`
4. Deploy automático!

**railway.toml** (criar na raiz):
```toml
[build]
builder = "NIXPACKS"

[deploy]
startCommand = "npm start"
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10
```

---

### 5. Deploy no Render

1. Acesse [render.com](https://render.com)
2. Crie um novo Web Service
3. Conecte seu repositório
4. Configure:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment**: `Node`

**Variáveis de ambiente**:
```
HEADLESS=true
NODE_ENV=production
PORT=10000
```

---

### 6. Deploy no DigitalOcean App Platform

1. Acesse [DigitalOcean App Platform](https://www.digitalocean.com/products/app-platform)
2. Crie um novo app
3. Conecte seu repositório
4. Configure:
   - **Run Command**: `npm start`
   - **Build Command**: `npm run build`

**app.yaml** (opcional):
```yaml
name: tiktok-scraper-api
services:
  - name: web
    github:
      repo: seu-usuario/tiktok-scraper-express
      branch: main
    build_command: npm run build
    run_command: npm start
    environment_slug: node-js
    instance_size_slug: basic-xxs
    instance_count: 1
    envs:
      - key: HEADLESS
        value: "true"
      - key: NODE_ENV
        value: "production"
```

---

### 7. Deploy em VPS (Ubuntu/Debian)

```bash
# Conectar ao servidor
ssh user@seu-servidor.com

# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PM2
sudo npm install -g pm2

# Clonar repositório
git clone https://github.com/seu-usuario/tiktok-scraper-express.git
cd tiktok-scraper-express

# Instalar dependências
npm install

# Compilar
npm run build

# Configurar variáveis de ambiente
cp .env.example .env
nano .env

# Iniciar com PM2
pm2 start build/server.js --name tiktok-scraper

# Configurar para iniciar no boot
pm2 startup
pm2 save

# Ver logs
pm2 logs tiktok-scraper

# Monitorar
pm2 monit
```

#### Configurar Nginx (opcional):
```nginx
server {
    listen 80;
    server_name seu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🔧 Variáveis de Ambiente por Plataforma

### Desenvolvimento
```env
PORT=3000
HEADLESS=true
NODE_ENV=development
```

### Produção
```env
PORT=3000
HEADLESS=true
NODE_ENV=production
```

### Heroku (adicionar buildpack)
```bash
heroku buildpacks:add jontewks/puppeteer
```

### Railway/Render
- Não precisa configuração extra para Puppeteer
- Usar `HEADLESS=true` sempre

---

## 📊 Monitoramento

### Health Check
Todas as plataformas podem usar:
```
GET /api/health
```

### Logs
```bash
# Docker
docker logs tiktok-scraper -f

# PM2
pm2 logs tiktok-scraper

# Heroku
heroku logs --tail

# Railway
railway logs
```

---

## 🔒 Considerações de Segurança

1. **Rate Limiting**: Considere adicionar rate limiting:
```bash
npm install express-rate-limit
```

2. **API Keys**: Adicione autenticação se necessário:
```bash
npm install helmet
```

3. **CORS**: Configure CORS para domínios específicos:
```javascript
app.use(cors({
  origin: ['https://seu-dominio.com']
}));
```

---

## 🚨 Troubleshooting

### Erro: "Chromium didn't download"
```bash
# Adicionar em package.json
"scripts": {
  "postinstall": "node node_modules/puppeteer/install.js"
}
```

### Erro: "EADDRINUSE"
Porta já em uso. Mude a porta:
```env
PORT=3001
```

### Timeout no scraping
Aumente o timeout em `userTemplate.ts`:
```typescript
await this.page.goto(url, { 
  waitUntil: 'networkidle2', 
  timeout: 90000  // 90 segundos
});
```

---

## 📈 Escalabilidade

### Opções:

1. **Horizontal**: Multiple instances com load balancer
2. **Queue System**: Redis + Bull para processar requisições
3. **Caching**: Redis para cachear resultados
4. **CDN**: Cloudflare para distribuir requisições

---

## ✅ Checklist de Deploy

- [ ] Variáveis de ambiente configuradas
- [ ] HEADLESS=true em produção
- [ ] Health check funcionando
- [ ] Logs configurados
- [ ] Monitoramento ativo
- [ ] Backups configurados (se necessário)
- [ ] SSL/HTTPS configurado
- [ ] Rate limiting implementado
- [ ] Domínio configurado
- [ ] Testes de carga realizados

---

**Boa sorte com o deploy!** 🎉
