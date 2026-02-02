import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  headless: process.env.HEADLESS || "new",
  nodeEnv: process.env.NODE_ENV || "development",
  chromePath: process.env.CHROME_PATH || undefined,
  puppeteer: {
    headless: process.env.HEADLESS || "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--disable-gpu",
      "--window-size=1920x1080"
    ],
    defaultViewport: {
      width: 1920,
      height: 1080
    }
  }
};

