import { Page } from 'puppeteer';
import { UserTemplate } from '../pages/userTemplate';
import { ScraperUtils } from '../utils';
import { TikTokUserData } from '../../types';

export class TikTokScraperService {
  async scrapeUser(username: string, includeVideos: boolean = false): Promise<TikTokUserData> {
    let page: Page | null = null;

    try {
      console.log(`Iniciando scraping do usuário: ${username}`);
      
      // Criar uma nova página
      page = await ScraperUtils.createPage();

      // Navegar para o perfil
      const url = `https://www.tiktok.com/@${username}`;
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

      // Detector de captcha/challenge
      const captchaElement = await page.$('div[data-e2e="captcha"], #captcha-verify-container, .captcha-container');
      if (captchaElement) {
        console.log("⚠️ Captcha detectado na página do TikTok");
        return {
          success: false,
          username,
          fullname: '',
          is_verified: false,
          avatar_url: null,
          followings: 0,
          followers: 0,
          likes: 0,
          bio: '',
          external_url: null,
          videos: [],
          error: 'Captcha detectado. Scraping bloqueado.'
        } as TikTokUserData;
      }

      // Simular scroll para carregar vídeos
      if (includeVideos) {
        for (let i = 0; i < 5; i++) {
          await page.evaluate(() => window.scrollBy(0, window.innerHeight));
          await page.waitForTimeout(2000);
        }
      }

      // Criar instância do template de usuário
      const userTemplate = new UserTemplate(page);
      
      // Fazer o scraping dos dados
      const userData = await userTemplate.scrapeUserData(username, includeVideos);
      
      // Salvar cookies após scraping bem-sucedido
      await ScraperUtils.saveCookies(page);
      
      console.log(`Scraping concluído para: ${username}`);
      
      return userData;
    } catch (error) {
      console.error(`Erro ao fazer scraping do usuário ${username}:`, error);
      throw error;
    } finally {
      // Fechar a página após o scraping
      if (page) {
        await ScraperUtils.closePage(page);
      }
    }
  }

  async scrapeMultipleUsers(usernames: string[], includeVideos: boolean = false): Promise<TikTokUserData[]> {
    const results: TikTokUserData[] = [];

    for (const username of usernames) {
      try {
        const userData = await this.scrapeUser(username, includeVideos);
        results.push(userData);
        
        // Pequeno delay entre requisições para evitar rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`Falha ao processar usuário ${username}:`, error);
        // Continuar com o próximo usuário mesmo se houver erro
      }
    }

    return results;
  }
}
