# 🛡️ Resolvendo "Verification - An unexpected error occurred"

## 🔍 O que é esse erro?

O TikTok detectou que você está usando automação e está bloqueando o acesso. Isso pode acontecer por:

1. ❌ TikTok detectou automação (webdriver)
2. ❌ Muitas requisições em pouco tempo
3. ❌ IP bloqueado temporariamente
4. ❌ Cookies inválidos ou expirados
5. ❌ Falta de comportamento "humano"

---

## ✅ SOLUÇÕES (em ordem de eficácia)

### 1️⃣ **Limpar cookies e recomeçar**

```powershell
# Pare o servidor (Ctrl+C)

# Delete cookies antigos
Remove-Item cookies.json -ErrorAction SilentlyContinue
Remove-Item -Recurse user_data -ErrorAction SilentlyContinue

# Reinicie
npm run start:dev
```

---

### 2️⃣ **Garantir que está usando Chrome instalado**

Verifique no console quando iniciar:

```
✅ Chrome encontrado em: C:\Program Files\Google\Chrome\Application\chrome.exe
🚀 Usando Google Chrome instalado
```

Se aparecer "Usando Chromium do Puppeteer", configure no `.env`:

```env
CHROME_PATH=C:\Program Files\Google\Chrome\Application\chrome.exe
```

---

### 3️⃣ **Modo HEADLESS=false + Resolver captcha manualmente**

```env
# .env
HEADLESS=false
```

**Passo a passo:**

1. Inicie o servidor
2. Faça uma requisição
3. O Chrome abre
4. **Se aparecer captcha/verificação:**
   - ✅ Resolva MANUALMENTE no navegador que abriu
   - ✅ Complete toda a verificação
   - ⏳ Aguarde a página carregar normalmente
   - 🍪 Os cookies serão salvos automaticamente

5. Próximas requisições devem funcionar!

---

### 4️⃣ **Fazer LOGIN no TikTok (Muito eficaz!)**

**Isso reduz MUITO os bloqueios!**

1. Configure `HEADLESS=false`
2. Faça uma requisição qualquer
3. No Chrome que abrir:
   - 👤 **Faça login na sua conta TikTok**
   - ✅ Complete qualquer verificação
   - 🍪 Os cookies do login são salvos
4. Feche manualmente o navegador
5. Próximas vezes: **muito menos bloqueios!**

---

### 5️⃣ **Aguardar entre requisições**

Se fizer muitas requisições seguidas, o TikTok bloqueia.

**Espere pelo menos 5-10 segundos entre cada requisição.**

O código já tem delay automático de 2 segundos entre múltiplos usuários, mas você pode aumentar:

Edite `src/services/scraperService.ts`:

```typescript
// Linha ~50
await new Promise(resolve => setTimeout(resolve, 10000)); // 10 segundos
```

---

### 6️⃣ **Trocar de IP (se bloqueado)**

Se seu IP foi bloqueado temporariamente:

**Opções:**
- 🔄 Reinicie seu roteador (muda IP)
- 📱 Use hotspot do celular
- 🌐 Use VPN
- ⏰ Aguarde algumas horas

---

### 7️⃣ **Verificar se não está banido**

Teste se consegue acessar normalmente pelo navegador:

1. Abra Chrome normalmente
2. Acesse `https://www.tiktok.com/@cortesluqueta`
3. **Funciona?**
   - ✅ Sim: O problema é na automação
   - ❌ Não: Seu IP/conta está bloqueado

---

## 🎯 FLUXO RECOMENDADO (Passo a passo completo)

### **Setup inicial (fazer UMA VEZ):**

```powershell
# 1. Limpar tudo
Remove-Item cookies.json -ErrorAction SilentlyContinue
Remove-Item -Recurse user_data -ErrorAction SilentlyContinue

# 2. Configurar .env
# HEADLESS=false
# (edite o arquivo .env)

# 3. Iniciar servidor
npm run start:dev

# 4. Fazer primeira requisição
curl "http://localhost:3000/api/user/google"
```

### **No Chrome que abrir:**

1. ✅ Se pedir verificação: **resolva manualmente**
2. 👤 **FAÇA LOGIN** na sua conta TikTok (recomendado!)
3. ✅ Complete qualquer verificação adicional
4. ⏳ Aguarde a página carregar completamente
5. ✅ O scraping vai completar e salvar cookies

### **Depois:**

```powershell
# Pode até usar HEADLESS=true agora
# Edite .env: HEADLESS=true

# Faça requisições normalmente
curl "http://localhost:3000/api/user/cortesluqueta?videos=true"
```

---

## 🔧 Melhorias implementadas na versão atual

✅ Anti-detecção melhorada:
- Máscara de webdriver
- Chrome object fake
- Permissions spoofing
- Plugin array fake
- Hardware specs realistas

✅ Comportamento humano:
- Scroll aleatório na página
- Delays entre ações
- Headers realistas

✅ Chrome instalado:
- Usa seu Chrome ao invés do Chromium
- Menos detecção

---

## 📊 Teste de diagnóstico

Execute este teste para ver o que está acontecendo:

```powershell
# Configure HEADLESS=false
# Faça uma requisição
curl "http://localhost:3000/api/user/google"

# Observe no Chrome que abrir:
```

**O que você vê?**

### ✅ Página carrega normal
- Solução: Está funcionando! Deixe completar.

### ⚠️ Aparece "Verification"
- Solução: Resolva manualmente, faça login

### ❌ Página em branco ou erro
- Solução: Limpe cookies, use Chrome instalado

### 🔒 "Access denied" ou "Forbidden"
- Solução: IP bloqueado, aguarde ou mude IP

---

## 💡 DICA PROFISSIONAL

**A melhor forma de evitar bloqueios:**

1. ✅ Use Chrome instalado (não Chromium)
2. ✅ Faça login no TikTok
3. ✅ Deixe HEADLESS=false na primeira vez
4. ✅ Resolva verificações manualmente
5. ✅ Aguarde 5-10s entre requisições
6. ✅ Não abuse (máximo 50-100 requisições/hora)

---

## 🆘 Ainda não funciona?

Tente esta configuração **ultra-segura**:

```env
# .env
PORT=3000
HEADLESS=false
NODE_ENV=development
CHROME_PATH=C:\Program Files\Google\Chrome\Application\chrome.exe
```

E faça:

1. Limpe tudo (cookies.json, user_data/)
2. Reinicie servidor
3. Faça UMA requisição
4. Faça login no Chrome que abrir
5. Aguarde completar
6. Feche o Chrome
7. Tente de novo

---

## 📞 Checklist final

- [ ] Limpou cookies.json e user_data/
- [ ] Configurou HEADLESS=false
- [ ] Está usando Chrome instalado (não Chromium)
- [ ] Resolveu verificação/captcha manualmente
- [ ] Fez login no TikTok
- [ ] Aguardou página carregar completamente
- [ ] Testou com outro perfil (google, tiktok, etc)
- [ ] Aguardou 5-10s entre requisições

Se tudo acima foi feito e ainda não funciona:
→ Seu IP pode estar bloqueado temporariamente pelo TikTok
→ Aguarde algumas horas ou mude de rede

---

**Boa sorte! 🚀**
