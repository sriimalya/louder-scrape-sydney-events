'use server'

import puppeteer from 'puppeteer';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ScrapedEvent {
  title: string;
  date: string;
  location: string;
  imageUrl: string;
  detailsUrl: string;
  description?: string | null;
}

interface DatabaseEvent extends ScrapedEvent {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function scrapeSydneyEvents(): Promise<{ newEvents: number; updatedEvents: number }> {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    await page.setViewport({ width: 1280, height: 800 });

    console.log('Navigating to Sydney events...');
    await page.goto('https://www.sydney.com/events', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    await page.waitForSelector('ol > li > div.grid-item.product-list-widget', { timeout: 10000 });

    console.log('Scraping event data...');
    const scrapedEvents = await page.evaluate((): ScrapedEvent[] => {
      return Array.from(document.querySelectorAll('ol > li > div.grid-item.product-list-widget')).map((el) => {
        const getText = (selector: string) => 
          el.querySelector(selector)?.textContent?.trim() || '';
          
        const getAttr = (selector: string, attr: string) =>
          el.querySelector(selector)?.getAttribute(attr) || '';

        const link = el.querySelector('.tile__product-list-link');
        let detailsUrl = link?.getAttribute('href') || '';
        if (detailsUrl && !detailsUrl.startsWith('http')) {
          detailsUrl = `https://www.sydney.com${detailsUrl}`;
        }

        return {
          title: getText('.tile__product-list-tile-heading h3'),
          date: (() => {
            const start = getText('time.start-date');
            const end = getText('time.end-date');
            return start === end ? start : `${start} - ${end}`;
          })(),
          location: getText('.tile__area-name'),
          imageUrl: getAttr('.tile__product-list-image img', 'src'),
          detailsUrl,
          description: getText('div[itemprop="description"]')
        };
      });
    });

    console.log(`🛢️ Processing ${scrapedEvents.length} events...`);
    let newEvents = 0;
    let updatedEvents = 0;

    for (const event of scrapedEvents) {
      try {
        const result = await prisma.event.upsert({
          where: { detailsUrl: event.detailsUrl },
          update: { 
            ...event,
            updatedAt: new Date()
          },
          create: event
        });

        result.createdAt === result.updatedAt ? newEvents++ : updatedEvents++;
      } catch (error) {
        console.error(`Failed to process event "${event.title}":`, error instanceof Error ? error.message : error);
      }
    }

    console.log(`Success! New: ${newEvents}, Updated: ${updatedEvents}`);
    return { newEvents, updatedEvents };

  } catch (error) {
    console.error('Critical scraping error:', error);
    throw new Error(`Scraping failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  } finally {
    if (browser) await browser.close();
    await prisma.$disconnect();
  }
}

export async function getEventsFromDB(): Promise<DatabaseEvent[]> {
  try {
    return await prisma.event.findMany({
      orderBy: { date: 'asc' },
      take: 100
    });
  } catch (error) {
    console.error('Database fetch error:', error);
    return [];
  }
}