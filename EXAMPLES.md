# Exemplos de Uso da API TikTok Scraper

## Usando cURL

### 1. Health Check
```bash
curl http://localhost:3000/api/health
```

### 2. Obter dados de um usuário (sem vídeos)
```bash
curl http://localhost:3000/api/user/google
```

### 3. Obter dados de um usuário (com vídeos)
```bash
curl http://localhost:3000/api/user/google?videos=true
```

### 4. Obter dados de múltiplos usuários
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "usernames": ["google", "facebook", "tiktok"],
    "includeVideos": false
  }'
```

### 5. Obter dados de múltiplos usuários com vídeos
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "usernames": ["google", "facebook"],
    "includeVideos": true
  }'
```

## Usando HTTPie

### 1. Health Check
```bash
http GET http://localhost:3000/api/health
```

### 2. Obter usuário
```bash
http GET http://localhost:3000/api/user/google videos==true
```

### 3. Múltiplos usuários
```bash
http POST http://localhost:3000/api/users \
  usernames:='["google", "facebook"]' \
  includeVideos:=true
```

## Usando JavaScript/Fetch

```javascript
// 1. Health Check
fetch('http://localhost:3000/api/health')
  .then(res => res.json())
  .then(data => console.log(data));

// 2. Obter usuário
fetch('http://localhost:3000/api/user/google?videos=true')
  .then(res => res.json())
  .then(data => console.log(data));

// 3. Múltiplos usuários
fetch('http://localhost:3000/api/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    usernames: ['google', 'facebook', 'tiktok'],
    includeVideos: true
  })
})
  .then(res => res.json())
  .then(data => console.log(data));
```

## Usando Python/Requests

```python
import requests

# 1. Health Check
response = requests.get('http://localhost:3000/api/health')
print(response.json())

# 2. Obter usuário
response = requests.get('http://localhost:3000/api/user/google', params={'videos': 'true'})
print(response.json())

# 3. Múltiplos usuários
response = requests.post('http://localhost:3000/api/users', json={
    'usernames': ['google', 'facebook', 'tiktok'],
    'includeVideos': True
})
print(response.json())
```

## Usando Node.js/Axios

```javascript
const axios = require('axios');

// 1. Health Check
axios.get('http://localhost:3000/api/health')
  .then(response => console.log(response.data))
  .catch(error => console.error(error));

// 2. Obter usuário
axios.get('http://localhost:3000/api/user/google', {
  params: { videos: true }
})
  .then(response => console.log(response.data))
  .catch(error => console.error(error));

// 3. Múltiplos usuários
axios.post('http://localhost:3000/api/users', {
  usernames: ['google', 'facebook', 'tiktok'],
  includeVideos: true
})
  .then(response => console.log(response.data))
  .catch(error => console.error(error));
```

## Respostas Esperadas

### Sucesso - Usuário único (sem vídeos)
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
    "external_url": "goo.gle/3DneWRb"
  }
}
```

### Sucesso - Usuário único (com vídeos)
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
        "short_description": "2024 was a year...",
        "views_count": "2.9M",
        "is_pinned": true
      }
    ]
  }
}
```

### Erro - Usuário não encontrado
```json
{
  "success": false,
  "error": "Erro ao fazer scraping do usuário",
  "message": "Navigation timeout of 60000 ms exceeded"
}
```

### Erro - Parâmetros inválidos
```json
{
  "success": false,
  "error": "Username é obrigatório"
}
```
