# TikTok Scraper Express API

API REST em Express.js para fazer scraping de dados de perfis públicos do TikTok usando Puppeteer.

## 🚀 Características

- ✅ Scraping de dados de perfis públicos do TikTok
- ✅ API REST com Express.js
- ✅ TypeScript para type safety
- ✅ Suporte a múltiplos usuários em uma única requisição
- ✅ Opção de incluir vídeos do perfil
- ✅ Modo headless configurável
- ✅ **Sistema de cookies persistentes (evita captchas repetidos!)**
- ✅ **Perfil de usuário salvo automaticamente**
- ✅ **Anti-detecção com user-agent realista**
- ✅ CORS habilitado
- ✅ Health check endpoint
- ✅ Tratamento de erros robusto

## 📋 Pré-requisitos

- Node.js v18.x ou v20.x (recomendado usar [nvm](https://github.com/nvm-sh/nvm))
- npm ou yarn

## 🔧 Instalação

1. **Clone ou crie o projeto:**
```bash
cd tiktok-scraper-express
```

2. **Instale as dependências:**
```bash
npm install
# ou
yarn install
```

3. **Configure as variáveis de ambiente:**
```bash
cp .env.example .env
```

Edite o arquivo `.env` conforme necessário:
```env
PORT=3000
HEADLESS=true
NODE_ENV=development
```

## 🏃 Como executar

### Modo desenvolvimento (com hot reload):
```bash
npm run start:dev
# ou
yarn start:dev
```

### Modo produção:
```bash
# Compilar TypeScript
npm run build
# ou
yarn build

# Executar
npm start
# ou
yarn start
```

## 📡 Endpoints da API

### 1. Health Check
```http
GET /api/health
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "status": "OK",
    "timestamp": "2025-02-02T12:00:00.000Z",
    "uptime": 123.456
  }
}
```

### 2. Limpar Cookies
```http
POST /api/clear-cookies
```

**Resposta:**
```json
{
  "success": true,
  "message": "Cookies e dados do navegador foram limpos com sucesso!"
}
```

### 3. Obter dados de um usuário
```http
GET /api/user/:username?videos=true
```

**Parâmetros:**
- `username` (obrigatório): Nome de usuário do TikTok
- `videos` (opcional): `true` para incluir vídeos, `false` por padrão

**Exemplo:**
```bash
curl http://localhost:3000/api/user/google?videos=true
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "username": "google",
    "is_verified": true,
    "fullname": "Google",
    "avatar_url": "https://...",
    "followings": 0,
    "followers": 412400,
    "likes": 719400,
    "bio": "Here to help 🔍",
    "external_url": "goo.gle/3DneWRb",
    "videos": [
      {
        "link": "https://www.tiktok.com/@google/video/...",
        "pic_url": "https://...",
        "short_description": "...",
        "views_count": "2.9M",
        "is_pinned": true
      }
    ]
  }
}
```

### 3. Obter dados de múltiplos usuários
```http
POST /api/users
Content-Type: application/json
```

**Body:**
```json
{
  "usernames": ["google", "facebook", "tiktok"],
  "includeVideos": false
}
```

**Exemplo:**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"usernames": ["google", "facebook"], "includeVideos": false}'
```

**Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "username": "google",
      "is_verified": true,
      "fullname": "Google",
      ...
    },
    {
      "username": "facebook",
      "is_verified": true,
      "fullname": "Facebook",
      ...
    }
  ]
}
```

## 🧪 Testando a API

### Usando cURL:

```bash
# Health check
curl http://localhost:3000/api/health

# Obter usuário sem vídeos
curl http://localhost:3000/api/user/google

# Obter usuário com vídeos
curl http://localhost:3000/api/user/google?videos=true

# Múltiplos usuários
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"usernames": ["google", "tiktok"], "includeVideos": true}'
```

### Usando Postman ou Insomnia:

1. **GET Request:**
   - URL: `http://localhost:3000/api/user/google?videos=true`
   - Method: GET

2. **POST Request:**
   - URL: `http://localhost:3000/api/users`
   - Method: POST
   - Headers: `Content-Type: application/json`
   - Body:
     ```json
     {
       "usernames": ["google", "facebook"],
       "includeVideos": true
     }
     ```

## 📁 Estrutura do Projeto

```
tiktok-scraper-express/
├── src/
│   ├── environment/
│   │   └── config.ts          # Configurações do app
│   ├── pages/
│   │   ├── identifiers.ts     # Seletores CSS do TikTok
│   │   ├── userTemplate.ts    # Template de scraping
│   │   └── index.ts
│   ├── routes/
│   │   └── index.ts           # Rotas da API
│   ├── services/
│   │   └── scraperService.ts  # Lógica de scraping
│   ├── utils/
│   │   └── index.ts           # Utilitários
│   └── server.ts              # Servidor Express
├── types/
│   └── index.d.ts             # Definições TypeScript
├── build/                     # Código compilado (gerado)
├── .env                       # Variáveis de ambiente
├── .env.example              # Exemplo de variáveis
├── .gitignore
├── nodemon.json
├── package.json
├── tsconfig.json
└── README.md
```

## ⚙️ Configurações

### Puppeteer

O Puppeteer está configurado com as seguintes opções padrão:

```javascript
{
  headless: true,  // Pode ser alterado via .env
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-accelerated-2d-canvas',
    '--disable-gpu',
    '--window-size=1920x1080'
  ]
}
```

Para rodar em modo não-headless (ver o navegador), altere no `.env`:
```env
HEADLESS=false
```

## 🚨 Tratamento de Erros

A API retorna erros no seguinte formato:

```json
{
  "success": false,
  "error": "Descrição do erro",
  "message": "Mensagem detalhada (opcional)"
}
```

**Códigos de status HTTP:**
- `200`: Sucesso
- `400`: Requisição inválida
- `404`: Endpoint não encontrado
- `500`: Erro interno do servidor

## 🔒 Limitações e Considerações

1. **Rate Limiting**: O TikTok pode bloquear requisições muito frequentes. A API inclui um delay de 2 segundos entre requisições múltiplas.

2. **Dados Públicos**: Apenas dados públicos podem ser acessados.

3. **Seletores CSS**: Os seletores podem mudar se o TikTok atualizar sua interface. Nesse caso, será necessário atualizar os seletores em `src/pages/identifiers.ts`.

4. **Performance**: O modo headless é mais rápido, mas o modo com interface pode ser útil para debug.

## 🐛 Debug

Para visualizar o navegador durante o scraping:

1. Altere `.env`:
```env
HEADLESS=false
```

2. Reinicie o servidor

## 📝 Licença

MIT

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

## 📧 Suporte

Para questões ou problemas, abra uma issue no repositório.

---

**Desenvolvido com ❤️ usando TypeScript, Express e Puppeteer**
