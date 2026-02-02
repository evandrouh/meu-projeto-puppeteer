import { Page } from 'puppeteer';
import { IDENTIFIERS, SELECTORS } from './identifiers';
import { TikTokUserData, TikTokVideo } from '../../types';

export class UserTemplate {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async scrapeUserData(username: string, includeVideos: boolean = false): Promise<TikTokUserData> {
    const url = `https://www.tiktok.com/@${username}`;
    
    console.log(`Navegando para: ${url}`);
    
    try {
      await this.page.goto(url, { 
        waitUntil: 'networkidle2', 
        timeout: 60000 
      });

      // Simular comportamento humano - pequeno delay
      await this.delay(2000);

      // Scroll suave para baixo e para cima (parecer humano)
      await this.page.evaluate(() => {
        window.scrollBy(0, 300);
      });
      await this.delay(500);
      await this.page.evaluate(() => {
        window.scrollBy(0, -300);
      });
      await this.delay(1000);

      // Aguardar elementos principais carregarem
      await this.page.waitForSelector(SELECTORS.WAIT_FOR_USER_INFO, { timeout: 30000 });

    } catch (error) {
      console.error('Erro ao navegar ou aguardar elementos:', error);
      throw error;
    }

    // Extrair dados do usuário
    const userData: any = await this.page.evaluate((ids) => {
      const getText = (selector: string): string => {
        const element = document.querySelector(selector);
        return element?.textContent?.trim() || '';
      };

      const getNumber = (selector: string): number => {
        const text = getText(selector);
        // Converter formato "1.2M" ou "412.4K" para número
        if (text.includes('M')) {
          return parseFloat(text.replace('M', '')) * 1000000;
        } else if (text.includes('K')) {
          return parseFloat(text.replace('K', '')) * 1000;
        }
        return parseInt(text.replace(/,/g, '')) || 0;
      };

      const getAttr = (selector: string, attr: string): string | null => {
        const element = document.querySelector(selector);
        return element?.getAttribute(attr) || null;
      };

      return {
        username: getText(ids.USER_INFO.USERNAME),
        is_verified: !!document.querySelector(ids.USER_INFO.VERIFIED),
        fullname: getText(ids.USER_INFO.FULLNAME),
        avatar_url: getAttr(ids.USER_INFO.AVATAR, 'src'),
        followings: getNumber(ids.STATS.FOLLOWING),
        followers: getNumber(ids.STATS.FOLLOWERS),
        likes: getNumber(ids.STATS.LIKES),
        bio: getText(ids.USER_INFO.BIO),
        external_url: getAttr(ids.USER_INFO.EXTERNAL_URL, 'href')
      };
    }, IDENTIFIERS);

    // Se solicitado, extrair vídeos com scroll automático
    if (includeVideos) {
      try {
        await this.page.waitForSelector(SELECTORS.WAIT_FOR_VIDEOS, { timeout: 30000 });
        userData.videos = await this.scrapeVideosWithAutoScroll();
      } catch (error) {
        console.log('Nenhum vídeo encontrado ou timeout');
        userData.videos = [];
      }
    }

    return userData as TikTokUserData;
  }

  /**
   * NOVO MÉTODO: Scroll automático por 30 segundos para carregar mais vídeos
   */
  private async scrapeVideosWithAutoScroll(): Promise<TikTokVideo[]> {
    console.log('🔄 Iniciando scroll automático por 30 segundos...');
    
    const scrollDuration = 30000; // 30 segundos
    const scrollInterval = 2000;  // Scroll a cada 2 segundos
    const startTime = Date.now();
    let scrollCount = 0;
    
    // Função para contar quantos vídeos estão carregados
    const getVideoCount = async (): Promise<number> => {
      return await this.page.evaluate((ids) => {
        return document.querySelectorAll(ids.VIDEO.CONTAINER).length;
      }, IDENTIFIERS);
    };

    let previousCount = await getVideoCount();
    console.log(`📊 Vídeos iniciais: ${previousCount}`);

    // Loop de scroll por 30 segundos
    while (Date.now() - startTime < scrollDuration) {
      scrollCount++;
      
      // Scroll suave para baixo
      await this.page.evaluate(() => {
        const scrollHeight = document.documentElement.scrollHeight;
        const currentPosition = window.pageYOffset;
        const scrollAmount = Math.min(800, scrollHeight - currentPosition);
        
        window.scrollBy({
          top: scrollAmount,
          behavior: 'smooth'
        });
      });

      // Aguardar um pouco para carregar novos vídeos
      await this.delay(scrollInterval);

      // Verificar quantos vídeos temos agora
      const currentCount = await getVideoCount();
      
      if (currentCount > previousCount) {
        console.log(`📈 Scroll #${scrollCount}: ${currentCount} vídeos carregados (+${currentCount - previousCount})`);
        previousCount = currentCount;
      } else {
        console.log(`⏸️  Scroll #${scrollCount}: ${currentCount} vídeos (sem novos)`);
        
        // Se não carregou novos vídeos em 3 tentativas seguidas, podemos estar no fim
        if (scrollCount % 3 === 0) {
          // Tentar voltar um pouco para cima e descer de novo (às vezes ajuda)
          await this.page.evaluate(() => {
            window.scrollBy(0, -200);
          });
          await this.delay(500);
        }
      }

      // Verificar se chegamos ao final da página
      const isAtBottom = await this.page.evaluate(() => {
        const scrollTop = window.pageYOffset;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = window.innerHeight;
        return scrollTop + clientHeight >= scrollHeight - 100;
      });

      if (isAtBottom) {
        console.log('📍 Chegou ao final da página');
        // Ainda assim continua scrollando até completar 30 segundos
        // Pode haver lazy loading
      }
    }

    const finalCount = await getVideoCount();
    const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`✅ Scroll concluído após ${elapsedTime}s - Total: ${finalCount} vídeos`);

    // Pequeno delay final antes de extrair os dados
    await this.delay(2000);

    // Agora extrair todos os vídeos carregados
    return await this.page.evaluate((ids) => {
      const videos: TikTokVideo[] = [];
      const videoElements = document.querySelectorAll(ids.VIDEO.CONTAINER);

      console.log(`[Scraper] Processando ${videoElements.length} vídeos...`);

      videoElements.forEach((video: any, index: number) => {
        try {
          // 1. Buscar link do vídeo
          const linkElement = video.querySelector(ids.VIDEO.LINK);
          const link = linkElement?.getAttribute('href') || '';
          
          if (!link) {
            return;
          }

          // 2. Buscar thumbnail com múltiplas estratégias
          let pic_url = '';
          
          const thumbnailImg = video.querySelector(ids.VIDEO.THUMBNAIL);
          if (thumbnailImg) {
            pic_url = thumbnailImg.getAttribute('src') || thumbnailImg.src || '';
          }
          
          if (!pic_url) {
            const anyImg = video.querySelector('img');
            if (anyImg) {
              pic_url = anyImg.getAttribute('src') || anyImg.src || '';
            }
          }
          
          if (!pic_url) {
            const canvas = video.querySelector('canvas');
            if (canvas) {
              const parent = canvas.parentElement;
              if (parent) {
                const siblingImg = parent.querySelector('img');
                if (siblingImg) {
                  pic_url = siblingImg.getAttribute('src') || siblingImg.src || '';
                }
              }
            }
          }

          if (!pic_url) {
            const possibleElements = video.querySelectorAll('[style*="background-image"]');
            possibleElements.forEach((el: any) => {
              if (!pic_url) {
                const bgImage = el.style.backgroundImage;
                const match = bgImage?.match(/url\(['"]?([^'"]+)['"]?\)/);
                if (match && match[1]) {
                  pic_url = match[1];
                }
              }
            });
          }

          // 3. Buscar descrição
          let short_description = '';
          
          const descElement = video.querySelector(ids.VIDEO.DESCRIPTION);
          if (descElement) {
            short_description = descElement.textContent?.trim() || '';
          }
          
          if (!short_description && linkElement) {
            short_description = linkElement.getAttribute('title') || '';
          }
          
          if (!short_description) {
            const imgWithAlt = video.querySelector('img[alt]');
            if (imgWithAlt) {
              short_description = imgWithAlt.getAttribute('alt') || '';
            }
          }
          
          if (!short_description) {
            const ariaElement = video.querySelector('[aria-label]');
            if (ariaElement) {
              short_description = ariaElement.getAttribute('aria-label') || '';
            }
          }

          // 4. Buscar visualizações
          const viewsElement = video.querySelector(ids.VIDEO.VIEWS);
          const views_count = viewsElement?.textContent?.trim() || '0';
          
          // 5. Verificar se está pinado
          const is_pinned = !!video.querySelector(ids.VIDEO.PINNED);

          videos.push({
            link: link.startsWith('http') ? link : `https://www.tiktok.com${link}`,
            pic_url,
            short_description,
            views_count,
            is_pinned
          });
        } catch (err) {
          console.error(`[Scraper] Erro ao processar vídeo ${index}:`, err);
        }
      });

      console.log(`[Scraper] ✅ ${videos.length} vídeos processados com sucesso`);
      return videos;
    }, IDENTIFIERS);
  }

  /**
   * MÉTODO ORIGINAL (mantido para compatibilidade)
   */
  private async scrapeVideos(): Promise<TikTokVideo[]> {
    // Scroll adicional para garantir que os vídeos carregaram completamente
    await this.page.evaluate(() => {
      window.scrollBy(0, 800);
    });
    await this.delay(2000);

    return await this.page.evaluate((ids) => {
      const videos: TikTokVideo[] = [];
      const videoElements = document.querySelectorAll(ids.VIDEO.CONTAINER);

      console.log(`[Scraper] Encontrados ${videoElements.length} containers de vídeo`);

      videoElements.forEach((video: any, index: number) => {
        try {
          const linkElement = video.querySelector(ids.VIDEO.LINK);
          const link = linkElement?.getAttribute('href') || '';
          
          if (!link) {
            return;
          }

          let pic_url = '';
          const thumbnailImg = video.querySelector(ids.VIDEO.THUMBNAIL);
          if (thumbnailImg) {
            pic_url = thumbnailImg.getAttribute('src') || thumbnailImg.src || '';
          }

          let short_description = '';
          const descElement = video.querySelector(ids.VIDEO.DESCRIPTION);
          if (descElement) {
            short_description = descElement.textContent?.trim() || '';
          }

          const viewsElement = video.querySelector(ids.VIDEO.VIEWS);
          const views_count = viewsElement?.textContent?.trim() || '0';
          const is_pinned = !!video.querySelector(ids.VIDEO.PINNED);

          videos.push({
            link: link.startsWith('http') ? link : `https://www.tiktok.com${link}`,
            pic_url,
            short_description,
            views_count,
            is_pinned
          });
        } catch (err) {
          console.error(`[Scraper] Erro ao processar vídeo ${index}:`, err);
        }
      });

      return videos;
    }, IDENTIFIERS);
  }
}