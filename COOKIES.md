# 🍪 Guia de Uso com Cookies e Captcha

## 🎯 Problema Resolvido

Agora o scraper **salva cookies automaticamente** e usa um **perfil de usuário persistente**, evitando captchas repetidos!

## ✅ Como Funciona Agora

1. **Primeira vez:** O navegador abre, você resolve o captcha manualmente
2. **Cookies são salvos automaticamente** após o scraping
3. **Próximas vezes:** O navegador carrega os cookies e **não pede captcha!**

---

## 🚀 Uso Passo a Passo

### 1️⃣ **Primeira Execução (Resolver Captcha)**

```powershell
# Certifique-se que HEADLESS=false no .env
# Isso permite ver o navegador

# Inicie o servidor
npm run start:dev

# Em outro terminal, faça uma requisição
curl "http://localhost:3000/api/user/cortesluqueta?videos=true"
```

**O que fazer:**
- 🖥️ O navegador Chrome abre automaticamente
- ✅ **Resolva o captcha manualmente** na janela que abriu
- ⏳ Aguarde a página carregar completamente
- 🍪 Os cookies são **salvos automaticamente** ao finalizar

### 2️⃣ **Próximas Execuções (SEM Captcha)**

```powershell
# Faça outra requisição
curl "http://localhost:3000/api/user/google?videos=true"
```

**O que acontece:**
- 🍪 Cookies são carregados automaticamente
- ✅ **SEM captcha!** Acesso direto
- 🚀 Scraping funciona normalmente

---

## 📂 Arquivos Criados

O sistema cria automaticamente:

```
tiktok-scraper-express/
├── cookies.json          # ← Cookies salvos
└── user_data/           # ← Perfil do Chrome (cache, sessões, etc)
    ├── Default/
    └── ...
```

**⚠️ IMPORTANTE:** Não delete esses arquivos! Eles mantêm você "logado".

---

## 🔄 Limpar Cookies (Recomeçar)

Se precisar limpar os cookies e recomeçar:

### Opção 1: Via API
```powershell
curl -X POST http://localhost:3000/api/clear-cookies
```

### Opção 2: Manualmente
```powershell
# Pare o servidor (Ctrl+C)
Remove-Item cookies.json -ErrorAction SilentlyContinue
Remove-Item -Recurse user_data -ErrorAction SilentlyContinue
```

---

## 🎭 Modo Headless vs Visual

### Modo VISUAL (recomendado para primeira vez):
```env
# .env
HEADLESS=false
```
- ✅ Você vê o navegador
- ✅ Pode resolver captcha
- ✅ Pode fazer login se quiser

### Modo HEADLESS (depois que salvou cookies):
```env
# .env
HEADLESS=true
```
- ✅ Mais rápido
- ✅ Não abre janela
- ✅ Usa os cookies salvos

---

## 🔐 Dica: Fazer Login no TikTok (Opcional)

Se quiser, você pode **fazer login** no TikTok na primeira execução:

1. Configure `HEADLESS=false`
2. Faça uma requisição para abrir o navegador
3. **Faça login manualmente** na conta do TikTok
4. Complete o scraping
5. Os cookies do login são salvos!

**Vantagens:**
- ✅ Menos chance de captcha
- ✅ Acesso a mais dados
- ✅ Maior limite de requisições

---

## 📊 Novo Endpoint

### POST /api/clear-cookies
Limpa todos os cookies e dados salvos.

**Exemplo:**
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/clear-cookies" -Method POST
```

**Resposta:**
```json
{
  "success": true,
  "message": "Cookies e dados do navegador foram limpos com sucesso!"
}
```

---

## 🎯 Fluxo Recomendado

### Primeira Vez:
1. ✅ Configure `HEADLESS=false` no `.env`
2. ✅ Faça uma requisição
3. ✅ Resolva o captcha na janela que abrir
4. ✅ Aguarde finalizar
5. ✅ Cookies salvos automaticamente!

### Depois:
1. ✅ Pode usar `HEADLESS=true` se quiser
2. ✅ Faça quantas requisições quiser
3. ✅ Sem captcha!

---

## 🛡️ Anti-Detecção

O sistema agora inclui:

- ✅ **User-Agent realista**
- ✅ **Perfil de usuário persistente**
- ✅ **Cookies salvos e reutilizados**
- ✅ **Desativa flags de automação**
- ✅ **Mascaramento de webdriver**
- ✅ **Headers realistas**

---

## ⚠️ Problemas Comuns

### "Ainda pede captcha toda vez"
- Certifique-se que o scraping **completou** (cookies só são salvos no final)
- Verifique se o arquivo `cookies.json` foi criado
- Tente fazer login no TikTok manualmente

### "Cookies.json existe mas ainda pede captcha"
- Os cookies podem ter expirado
- Delete e comece de novo:
  ```powershell
  Remove-Item cookies.json
  Remove-Item -Recurse user_data
  ```

### "Erro ao carregar cookies"
- Normal na primeira execução
- Ignore essa mensagem

---

## 🎉 Pronto!

Agora você tem um sistema que:
- 🍪 Salva cookies automaticamente
- 🔄 Reutiliza sessões
- ✅ Evita captchas repetidos
- 🚀 Funciona de forma persistente

**Teste agora:**
```powershell
# Configure modo visual
# No .env: HEADLESS=false

# Teste
curl "http://localhost:3000/api/user/cortesluqueta?videos=true"
```

Resolva o captcha UMA VEZ e nunca mais! 🎊
