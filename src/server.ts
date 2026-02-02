import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { config } from './environment/config';
import routes from './routes';
import { ScraperUtils } from './utils';

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api', routes);

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'TikTok Scraper API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      user: '/api/user/:username?videos=true',
      users: '/api/users (POST)'
    },
    documentation: {
      getUserExample: 'GET /api/user/google?videos=true',
      postUsersExample: 'POST /api/users with body: { "usernames": ["google", "facebook"], "includeVideos": false }'
    }
  });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({
    success: false,
    error: 'Erro interno do servidor',
    message: err.message
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint não encontrado'
  });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nRecebido SIGINT, encerrando servidor...');
  await ScraperUtils.closeBrowser();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\nRecebido SIGTERM, encerrando servidor...');
  await ScraperUtils.closeBrowser();
  process.exit(0);
});

// Start server
const PORT = config.port;

app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`🚀 TikTok Scraper API rodando em http://localhost:${PORT}`);
  console.log(`📝 Modo: ${config.nodeEnv}`);
  console.log(`🎭 Headless: ${config.headless}`);
  console.log('='.repeat(50));
  console.log('\nEndpoints disponíveis:');
  console.log(`  • GET  http://localhost:${PORT}/api/health`);
  console.log(`  • GET  http://localhost:${PORT}/api/user/:username`);
  console.log(`  • POST http://localhost:${PORT}/api/users`);
  console.log('='.repeat(50));
});

export default app;
