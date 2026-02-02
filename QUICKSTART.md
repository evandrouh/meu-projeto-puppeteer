# 🚀 Guia Rápido - TikTok Scraper Express

## ⚡ Início Rápido (5 minutos)

### 1. Instalação
```bash
cd tiktok-scraper-express
npm install
```

### 2. Iniciar o servidor
```bash
# Desenvolvimento (com hot reload)
npm run start:dev

# OU Produção
npm run build
npm start
```

### 3. Testar a API
Abra outro terminal e execute:

```bash
# Health check
curl http://localhost:3000/api/health

# Obter dados de um usuário
curl http://localhost:3000/api/user/google

# Com vídeos
curl http://localhost:3000/api/user/google?videos=true
```

## 📋 Comandos Principais

| Comando | Descrição |
|---------|-----------|
| `npm install` | Instala as dependências |
| `npm run start:dev` | Inicia em modo desenvolvimento (recomendado) |
| `npm run build` | Compila o TypeScript |
| `npm start` | Inicia em modo produção |
| `node test-api.js` | Executa testes da API |

## 🎯 Endpoints Principais

### 1. Health Check
```bash
GET http://localhost:3000/api/health
```

### 2. Obter Usuário
```bash
GET http://localhost:3000/api/user/:username?videos=true
```

Exemplo:
```bash
curl http://localhost:3000/api/user/google?videos=true
```

### 3. Múltiplos Usuários
```bash
POST http://localhost:3000/api/users
Content-Type: application/json

{
  "usernames": ["google", "facebook"],
  "includeVideos": true
}
```

Exemplo:
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"usernames": ["google", "tiktok"], "includeVideos": false}'
```

## ⚙️ Configuração

Edite o arquivo `.env`:

```env
PORT=3000              # Porta do servidor
HEADLESS=true          # true = sem interface, false = mostra navegador
NODE_ENV=development   # development ou production
```

## 🐛 Troubleshooting

### Erro: "Cannot find module"
```bash
npm install
```

### Erro: "Port 3000 already in use"
Altere a porta no `.env`:
```env
PORT=3001
```

### Quero ver o navegador funcionando
No `.env`:
```env
HEADLESS=false
```

### Erro de timeout
O TikTok pode estar bloqueando. Tente:
1. Aguardar alguns minutos
2. Usar outro usuário
3. Verificar sua conexão de internet

## 📊 Estrutura de Resposta

### Sucesso
```json
{
  "success": true,
  "data": {
    "username": "google",
    "is_verified": true,
    "fullname": "Google",
    "followers": 412400,
    ...
  }
}
```

### Erro
```json
{
  "success": false,
  "error": "Descrição do erro",
  "message": "Detalhes adicionais"
}
```

## 📚 Documentação Completa

- **README.md** - Documentação completa
- **EXAMPLES.md** - Exemplos de uso em várias linguagens
- **test-api.js** - Script de testes automatizado

## 🆘 Suporte

Problemas? Verifique:
1. Node.js está instalado? `node --version` (precisa ser v18+ ou v20+)
2. Dependências instaladas? `npm install`
3. Porta 3000 está livre? Tente mudar no `.env`
4. Firewall bloqueando? Verifique as configurações

## ✨ Próximos Passos

1. ✅ Instalar dependências
2. ✅ Iniciar servidor
3. ✅ Testar com `curl` ou Postman
4. ✅ Integrar com sua aplicação
5. ✅ Deploy em produção (Heroku, Railway, etc.)

---

**Pronto para começar!** 🎉

Execute `npm install` e depois `npm run start:dev` para iniciar o servidor.
