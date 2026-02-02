# 🌐 Usando Chrome Instalado ao invés de "Chrome for Testing"

## ✅ Agora o sistema usa automaticamente o Chrome instalado!

O scraper agora **detecta e usa automaticamente** o Google Chrome instalado no seu computador, evitando o "Chrome for Testing" que o TikTok bloqueia mais facilmente.

---

## 🔍 Detecção Automática

O sistema procura o Chrome nos seguintes locais (Windows):

1. `C:\Program Files\Google\Chrome\Application\chrome.exe`
2. `C:\Program Files (x86)\Google\Chrome\Application\chrome.exe`
3. `%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe`
4. E outras localizações padrão...

**Se encontrar:** ✅ Usa o Chrome instalado  
**Se não encontrar:** ⚠️ Usa o Chromium do Puppeteer

---

## 📊 Verificando qual está sendo usado

Quando você iniciar o servidor, verá uma das mensagens:

### ✅ Chrome encontrado:
```
✅ Chrome encontrado em: C:\Program Files\Google\Chrome\Application\chrome.exe
🚀 Usando Google Chrome instalado
```

### ⚠️ Chrome não encontrado:
```
⚠️  Chrome não encontrado. Usando Chromium padrão do Puppeteer.
🚀 Usando Chromium do Puppeteer
```

---

## 🛠️ Configuração Manual (Opcional)

Se o Chrome não for detectado automaticamente, você pode configurar o caminho manualmente:

### No arquivo `.env`:
```env
PORT=3000
HEADLESS=false
NODE_ENV=development

# Configurar caminho do Chrome manualmente
CHROME_PATH=C:\Program Files\Google\Chrome\Application\chrome.exe
```

### Caminhos comuns:

**Windows (64-bit):**
```
C:\Program Files\Google\Chrome\Application\chrome.exe
```

**Windows (32-bit):**
```
C:\Program Files (x86)\Google\Chrome\Application\chrome.exe
```

**Windows (AppData):**
```
C:\Users\SeuUsuario\AppData\Local\Google\Chrome\Application\chrome.exe
```

**Linux:**
```
/usr/bin/google-chrome
/usr/bin/chromium-browser
```

**Mac:**
```
/Applications/Google Chrome.app/Contents/MacOS/Google Chrome
```

---

## 🎯 Como descobrir o caminho do Chrome no seu PC

### Método 1: PowerShell
```powershell
Get-Command chrome | Select-Object Source
```

### Método 2: Verificar manualmente
1. Abra o Chrome
2. Digite na barra de endereço: `chrome://version`
3. Procure por "Caminho do executável" ou "Executable Path"
4. Copie o caminho completo

### Método 3: Explorador de Arquivos
```
C:\Program Files\Google\Chrome\Application\
```
Procure por `chrome.exe`

---

## 🆚 Diferenças: Chrome vs Chrome for Testing

| Característica | Chrome Instalado | Chrome for Testing |
|----------------|------------------|-------------------|
| **Detecção** | ✅ Menos detectado | ❌ Facilmente detectado |
| **Captchas** | ✅ Menos frequentes | ❌ Mais frequentes |
| **Cookies** | ✅ Pode usar perfil real | ⚠️ Perfil separado |
| **Extensões** | ✅ Suportadas | ❌ Não suportadas |
| **Atualizações** | ✅ Auto-atualiza | ❌ Manual |

---

## 🎭 Usando seu perfil pessoal do Chrome (Avançado)

**⚠️ CUIDADO:** Isso pode expor seus dados pessoais!

Se quiser usar seu perfil real do Chrome (com login, extensões, etc):

### 1. Encontre seu User Data do Chrome:

**Windows:**
```
%LOCALAPPDATA%\Google\Chrome\User Data
```

**Linux:**
```
~/.config/google-chrome
```

**Mac:**
```
~/Library/Application Support/Google/Chrome
```

### 2. Configure no código:

Edite `src/utils/index.ts` e mude a linha:
```typescript
private static USER_DATA_DIR = 'C:\\Users\\SeuUsuario\\AppData\\Local\\Google\\Chrome\\User Data';
```

**⚠️ ATENÇÃO:** 
- Feche TODOS os Chrome abertos antes de rodar
- Pode expor dados pessoais
- Use por sua conta e risco!

---

## ✅ Recomendação

Para melhor resultado:

1. ✅ Use o Chrome instalado (já configurado automaticamente)
2. ✅ Configure `HEADLESS=false` na primeira vez
3. ✅ Deixe o sistema salvar cookies no perfil separado
4. ✅ Depois pode usar `HEADLESS=true`

**NÃO** use seu perfil pessoal do Chrome a menos que seja realmente necessário!

---

## 🧪 Testando

```powershell
# Inicie o servidor
npm run start:dev

# Observe as mensagens:
# ✅ Chrome encontrado em: C:\Program Files\...
# 🚀 Usando Google Chrome instalado

# Faça uma requisição
curl "http://localhost:3000/api/user/cortesluqueta?videos=true"
```

Agora você deve ver o **Chrome normal** abrindo, não o "Chrome for Testing"! 🎉

---

## ❓ Troubleshooting

### Chrome não está sendo detectado

1. Verifique se o Chrome está instalado
2. Configure `CHROME_PATH` manualmente no `.env`
3. Reinicie o servidor

### Erro: "Chrome failed to start"

- Feche todas as janelas do Chrome
- Delete a pasta `user_data/`
- Tente novamente

### Ainda aparece "Chrome for Testing"

- Configure `CHROME_PATH` manualmente
- Verifique os logs do servidor
- Certifique-se que o caminho está correto

---

**Pronto! Agora seu scraper usa o Chrome instalado! 🚀**
