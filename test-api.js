#!/usr/bin/env node

/**
 * Script de teste simples para a API TikTok Scraper
 * 
 * Uso: node test-api.js
 * 
 * Certifique-se de que o servidor está rodando em http://localhost:3000
 */

const http = require('http');

const BASE_URL = 'http://localhost:3000';

// Função auxiliar para fazer requisições HTTP
function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = http.request(url, options, (res) => {
      let body = '';
      
      res.on('data', (chunk) => {
        body += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(body);
          resolve({
            status: res.statusCode,
            data: jsonData
          });
        } catch (error) {
          reject(new Error(`Erro ao parsear JSON: ${error.message}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Testes
async function runTests() {
  console.log('🧪 Iniciando testes da API TikTok Scraper\n');
  console.log('=' .repeat(60));

  // Teste 1: Health Check
  try {
    console.log('\n1️⃣  Testando Health Check...');
    const result = await makeRequest('/api/health');
    console.log('   ✅ Status:', result.status);
    console.log('   📊 Resposta:', JSON.stringify(result.data, null, 2));
  } catch (error) {
    console.error('   ❌ Erro:', error.message);
  }

  // Teste 2: Obter usuário sem vídeos
  try {
    console.log('\n2️⃣  Testando GET /api/user/google (sem vídeos)...');
    const result = await makeRequest('/api/user/google');
    console.log('   ✅ Status:', result.status);
    console.log('   👤 Username:', result.data.data?.username);
    console.log('   ✓ Verificado:', result.data.data?.is_verified);
    console.log('   👥 Seguidores:', result.data.data?.followers);
  } catch (error) {
    console.error('   ❌ Erro:', error.message);
  }

  // Teste 3: Obter usuário com vídeos
  try {
    console.log('\n3️⃣  Testando GET /api/user/google (com vídeos)...');
    const result = await makeRequest('/api/user/google?videos=true');
    console.log('   ✅ Status:', result.status);
    console.log('   👤 Username:', result.data.data?.username);
    console.log('   🎥 Vídeos encontrados:', result.data.data?.videos?.length || 0);
  } catch (error) {
    console.error('   ❌ Erro:', error.message);
  }

  // Teste 4: Múltiplos usuários
  try {
    console.log('\n4️⃣  Testando POST /api/users (múltiplos usuários)...');
    const result = await makeRequest('/api/users', 'POST', {
      usernames: ['google', 'tiktok'],
      includeVideos: false
    });
    console.log('   ✅ Status:', result.status);
    console.log('   👥 Usuários processados:', result.data.data?.length || 0);
    if (result.data.data) {
      result.data.data.forEach((user, index) => {
        console.log(`      ${index + 1}. ${user.username} - ${user.followers} seguidores`);
      });
    }
  } catch (error) {
    console.error('   ❌ Erro:', error.message);
  }

  // Teste 5: Erro - usuário inválido
  try {
    console.log('\n5️⃣  Testando tratamento de erro (usuário inexistente)...');
    const result = await makeRequest('/api/user/usuarioquenaoexiste123456789');
    console.log('   Status:', result.status);
    console.log('   Resposta:', result.data);
  } catch (error) {
    console.error('   ✅ Erro esperado capturado:', error.message);
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ Testes concluídos!\n');
}

// Executar testes
runTests().catch(error => {
  console.error('❌ Erro fatal:', error);
  process.exit(1);
});
