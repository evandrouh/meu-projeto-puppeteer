# 🔧 CORREÇÃO DE ERROS - LEIA PRIMEIRO!

## ⚠️ Problema: Erros de TypeScript com "document"

Se você está vendo erros como:
```
error TS2584: Cannot find name 'document'
```

## ✅ SOLUÇÃO RÁPIDA (Execute estes comandos):

### No Windows (PowerShell):
```powershell
# 1. Pare o servidor (Ctrl+C se estiver rodando)

# 2. Limpe o cache do ts-node
Remove-Item -Recurse -Force node_modules\.cache -ErrorAction SilentlyContinue

# 3. Delete o tsconfig.tsbuildinfo se existir
Remove-Item tsconfig.tsbuildinfo -ErrorAction SilentlyContinue

# 4. Reinstale as dependências
npm install

# 5. Inicie novamente
npm run start:dev
```

### No Linux/Mac:
```bash
# 1. Pare o servidor (Ctrl+C se estiver rodando)

# 2. Limpe o cache
rm -rf node_modules/.cache
rm -f tsconfig.tsbuildinfo

# 3. Reinstale as dependências
npm install

# 4. Inicie novamente
npm run start:dev
```

## 📝 ALTERNATIVA: Substituir o tsconfig.json manualmente

Se o problema persistir, substitua todo o conteúdo do arquivo `tsconfig.json` por:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020", "DOM"],
    "outDir": "./build",
    "rootDir": "./src",
    "strict": false,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "noImplicitAny": false,
    "strictNullChecks": false,
    "strictFunctionTypes": false,
    "strictBindCallApply": false,
    "strictPropertyInitialization": false,
    "noImplicitThis": false,
    "alwaysStrict": false
  },
  "ts-node": {
    "compilerOptions": {
      "module": "commonjs",
      "lib": ["ES2020", "DOM"]
    }
  },
  "include": ["src/**/*", "types/**/*"],
  "exclude": ["node_modules", "build"]
}
```

Salve o arquivo e execute:
```powershell
npm run start:dev
```

## 🚀 ALTERNATIVA 2: Usar modo produção (mais estável)

Se continuar com problemas, use o modo produção:

```powershell
# Compilar
npm run build

# Executar
npm start
```

Isso evita o ts-node e usa o código JavaScript compilado.

## ✅ Como saber se funcionou?

Você deve ver esta mensagem:

```
==================================================
🚀 TikTok Scraper API rodando em http://localhost:3000
📝 Modo: development
🎭 Headless: true
==================================================

Endpoints disponíveis:
  • GET  http://localhost:3000/api/health
  • GET  http://localhost:3000/api/user/:username
  • POST http://localhost:3000/api/users
==================================================
```

E nenhum erro de TypeScript!

## 🧪 Testar se está funcionando:

Abra outro terminal e execute:

```powershell
curl http://localhost:3000/api/health
```

Ou abra no navegador:
```
http://localhost:3000/api/health
```

---

**Se nada disso funcionar, me avise! Vou criar uma versão alternativa em JavaScript puro (sem TypeScript).**
