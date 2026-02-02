import { Router, Request, Response } from 'express';
import { TikTokScraperService } from '../services/scraperService';
import { ApiResponse } from '../../types';

const router = Router();
const scraperService = new TikTokScraperService();

/**
 * GET /api/user/:username
 * Obtém dados de um usuário do TikTok
 * Query params:
 *   - videos: boolean (default: false) - Incluir vídeos do usuário
 */
router.get('/user/:username', async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    const includeVideos = req.query.videos === 'true';

    if (!username) {
      const response: ApiResponse = {
        success: false,
        error: 'Username é obrigatório'
      };
      return res.status(400).json(response);
    }

    console.log(`[API] Requisição recebida para usuário: ${username}`);

    const userData = await scraperService.scrapeUser(username, includeVideos);

    const response: ApiResponse = {
      success: true,
      data: userData
    };

    res.json(response);
  } catch (error: any) {
    console.error('[API] Erro:', error);
    
    const response: ApiResponse = {
      success: false,
      error: 'Erro ao fazer scraping do usuário',
      message: error.message
    };

    res.status(500).json(response);
  }
});

/**
 * POST /api/users
 * Obtém dados de múltiplos usuários do TikTok
 * Body:
 *   {
 *     "usernames": ["user1", "user2", ...],
 *     "includeVideos": false
 *   }
 */
router.post('/users', async (req: Request, res: Response) => {
  try {
    const { usernames, includeVideos = false } = req.body;

    if (!usernames || !Array.isArray(usernames) || usernames.length === 0) {
      const response: ApiResponse = {
        success: false,
        error: 'Array de usernames é obrigatório'
      };
      return res.status(400).json(response);
    }

    console.log(`[API] Requisição recebida para ${usernames.length} usuários`);

    const usersData = await scraperService.scrapeMultipleUsers(usernames, includeVideos);

    const response: ApiResponse = {
      success: true,
      data: usersData
    };

    res.json(response);
  } catch (error: any) {
    console.error('[API] Erro:', error);
    
    const response: ApiResponse = {
      success: false,
      error: 'Erro ao fazer scraping dos usuários',
      message: error.message
    };

    res.status(500).json(response);
  }
});

/**
 * GET /api/health
 * Health check endpoint
 */
router.get('/health', (req: Request, res: Response) => {
  const response: ApiResponse = {
    success: true,
    data: {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    }
  };
  res.json(response);
});

/**
 * POST /api/clear-cookies
 * Limpa cookies salvos e dados do navegador
 */
router.post('/clear-cookies', async (req: Request, res: Response) => {
  try {
    const { ScraperUtils } = await import('../utils');
    await ScraperUtils.clearCookies();
    
    const response: ApiResponse = {
      success: true,
      message: 'Cookies e dados do navegador foram limpos com sucesso!'
    };
    res.json(response);
  } catch (error: any) {
    const response: ApiResponse = {
      success: false,
      error: 'Erro ao limpar cookies',
      message: error.message
    };
    res.status(500).json(response);
  }
});

export default router;
