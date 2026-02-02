import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { Browser, Page } from 'puppeteer';
import { config } from '../environment/config';
import * as fs from 'fs';
import * as path from 'path';

// Adicionar plugin stealth
puppeteer.use(StealthPlugin());

export class ScraperUtils {
  private static browser: Browser | null = null;
  private static COOKIES_PATH = path.join(__dirname, '../../cookies.json');
  private static USER_DATA_DIR = path.join(__dirname, '../../user_data');

  // Caminhos comuns do Chrome no Windows
  private static CHROME_PATHS = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe',
    process.env.PROGRAMFILES + '\\Google\\Chrome\\Application\\chrome.exe',
    process.env['PROGRAMFILES(X86)'] + '\\Google\\Chrome\\Application\\chrome.exe'
  ];

  static findChrome(): string | undefined {
    // Primeiro verifica se foi configurado manualmente no .env
    if (config.chromePath && fs.existsSync(config.chromePath)) {
      console.log(`✅ Chrome encontrado (configurado): ${config.chromePath}`);
      return config.chromePath;
    }

    // Caminho padrão do Chromium no Linux (Railway/Docker)
    const linuxChromiumPath = '/usr/bin/chromium';
    if (fs.existsSync(linuxChromiumPath)) {
      console.log(`✅ Chromium encontrado em: ${linuxChromiumPath}`);
      return linuxChromiumPath;
    }

    // Senão, procura nos caminhos padrão do Windows
    for (const chromePath of this.CHROME_PATHS) {
      if (chromePath && fs.existsSync(chromePath)) {
        console.log(`✅ Chrome encontrado em: ${chromePath}`);
        return chromePath;
      }
    }

    console.log('⚠️  Chrome/Chromium não encontrado. Usando Chromium padrão do Puppeteer.');
    return undefined;
  }

  static async initBrowser(): Promise<Browser> {
    if (this.browser) {
      return this.browser;
    }

    console.log('🔒 Iniciando navegador com Stealth Plugin...');
    
    // Criar diretório de dados do usuário se não existir
    if (!fs.existsSync(this.USER_DATA_DIR)) {
      fs.mkdirSync(this.USER_DATA_DIR, { recursive: true });
    }

    const chromePath = this.findChrome();
    
    const launchOptions: any = {
      headless: config.puppeteer.headless,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-blink-features=AutomationControlled',
        '--disable-features=IsolateOrigins,site-per-process',
        `--user-data-dir=${this.USER_DATA_DIR}`,
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--no-first-run',
        '--no-default-browser-check',
        '--window-size=1920,1080'
      ],
      ignoreDefaultArgs: ['--enable-automation', '--enable-blink-features=IdleDetection'],
      ignoreHTTPSErrors: true
    };

    // Se encontrou Chrome/Chromium, usa ele
    if (chromePath) {
      launchOptions.executablePath = chromePath;
      console.log(`🚀 Usando navegador em: ${chromePath}`);
    } else {
      // fallback para Linux
      launchOptions.executablePath = '/usr/bin/chromium';
      console.log('🚀 Usando Chromium instalado no container');
    }

    this.browser = await puppeteer.launch(launchOptions);

    return this.browser;
  }

  static async createPage(): Promise<Page> {
    const browser = await this.initBrowser();
    const page = await browser.newPage();
    
    // O stealth plugin já faz a maioria das máscaras, mas vamos adicionar extras
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => 8 });
      Object.defineProperty(navigator, 'deviceMemory', { get: () => 8 });

      (window as any).chrome = {
        runtime: {},
        loadTimes: function() {},
        csi: function() {},
        app: {}
      };
    });

    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
    );

    await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });

    await page.setExtraHTTPHeaders({
      'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1',
    });

    await this.loadCookies(page);

    return page;
  }

  static async saveCookies(page: Page): Promise<void> {
    try {
      const cookies = await page.cookies();
      fs.writeFileSync(this.COOKIES_PATH, JSON.stringify(cookies, null, 2));
      console.log('✅ Cookies salvos com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao salvar cookies:', error);
    }
  }

  static async loadCookies(page: Page): Promise<void> {
    try {
      if (fs.existsSync(this.COOKIES_PATH)) {
        const cookiesString = fs.readFileSync(this.COOKIES_PATH, 'utf8');
        const cookies = JSON.parse(cookiesString);
        await page.setCookie(...cookies);
        console.log('✅ Cookies carregados com sucesso!');
      } else {
        console.log('ℹ️  Nenhum cookie salvo encontrado. Primeira execução.');
      }
    } catch (error) {
      console.error('❌ Erro ao carregar cookies:', error);
    }
  }

  static async clearCookies(): Promise<void> {
    try {
      if (fs.existsSync(this.COOKIES_PATH)) {
        fs.unlinkSync(this.COOKIES_PATH);
        console.log('✅ Cookies deletados!');
      }
      if (fs.existsSync(this.USER_DATA_DIR)) {
        fs.rmSync(this.USER_DATA_DIR, { recursive: true, force: true });
        console.log('✅ Dados do usuário deletados!');
      }
    } catch (error) {
      console.error('❌ Erro ao limpar cookies:', error);
    }
  }

  static async closeBrowser(): Promise<void> {
    if (this.browser) {
      console.log('Fechando navegador...');
      await this.browser.close();
      this.browser = null;
    }
  }

  static async closePage(page: Page): Promise<void> {
    if (page && !page.isClosed()) {
      await page.close();
    }
  }

  static formatNumber(value: string | number): number {
    if (typeof value === 'number') return value;
    
    const text = value.toString().toUpperCase();
    if (text.includes('M')) {
      return parseFloat(text.replace('M', '')) * 1000000;
    } else if (text.includes('K')) {
      return parseFloat(text.replace('K', '')) * 1000;
    }
    return parseInt(text.replace(/,/g, '')) || 0;
  }
}
