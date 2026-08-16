import Parser from 'rss-parser';
import { FEED_SOURCES } from './feeds';
import { detectCategory } from './categories';

export interface NewsItem {
  id: string;
  title: string;
  link: string;
  source: string;
  sourceUrl: string;
  pubDate: string;
  contentSnippet: string;
  category: string;
  image: string | null;
  language: 'tr' | 'en';
}

const parser = new Parser({ timeout: 10000, headers: { 'User-Agent': 'Mozilla/5.0' } });

function getImage(item: any, sourceName: string, title: string): string | null {
  let url: string | null = null;

  // 1. RSS görsel alanlarını dene
  if (item.enclosure?.url && item.enclosure.type?.startsWith('image')) {
    url = item.enclosure.url;
  } else if (item['media:content']?.url) {
    url = item['media:content'].url;
  } else if (item['media:thumbnail']?.url) {
    url = item['media:thumbnail'].url;
  } else if (item.image?.url) {
    url = item.image.url;
  }

  // 2. HTML içindeki ilk img'yi yakala
  if (!url) {
    const html = item['content:encoded'] || item.content || item.description || '';
    const m = html.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (m) url = m[1];
  }

  // 3. Göreceli adresleri tam adrese çevir
  if (url && url.startsWith('/')) {
    if (sourceName === 'DonanımHaber') {
      url = 'https://resim.donanimhaber.com' + url;
    } else if (sourceName === 'ShiftDelete') {
      url = 'https://shiftdelete.net' + url;
    } else {
      try {
        const baseLink = item.link ? new URL(item.link) : null;
        if (baseLink) url = new URL(url, baseLink.origin).href;
      } catch (e) {}
    }
  }

  // 4. ShiftDelete özel: Bazı RSS'lerde görsel URL'si eksik gelir,
  // haber linkinden basit görsel adresi türet (yedek)
  if (!url && sourceName === 'ShiftDelete') {
    try {
      const path = item.link ? item.link.split('/').pop() || 'haber' : 'haber';
      url = `https://picsum.photos/seed/shiftdelete-${path}/800/450`;
    } catch (e) {
      url = `https://picsum.photos/seed/shiftdelete/800/450`;
    }
  }

  // 5. DonanımHaber özel: Görsel yoksa üret (diğer siteler null kalır)
  if (!url) {
    if (sourceName === 'DonanımHaber') {
      const seed = (sourceName + '-' + title).replace(/[^a-z0-9]/gi, '').slice(0, 20);
      url = `https://picsum.photos/seed/${seed}/800/450`;
    } else {
      url = null;
    }
  }

  return url;
}

function generateId(title: string, source: string): string {
  return Buffer.from(`${source}-${title}`).toString('base64').replace(/[+/=]/g, '').slice(0, 20);
}

export async function getNews(): Promise<NewsItem[]> {
  const allNews: NewsItem[] = [];

  await Promise.all(
    FEED_SOURCES.map(async (source) => {
      try {
        const feed = await parser.parseURL(source.url);
        const items = (feed.items || []).slice(0, 8);
        for (const item of items) {
          const title = item.title?.trim() || '';
          if (!title || !item.link) continue;

          const snippetRaw = item.contentSnippet || item.summary || item.description || '';
          const contentSnippet = snippetRaw.replace(/<[^>]*>/g, '').trim().slice(0, 250);

          allNews.push({
            id: generateId(title, source.name),
            title,
            link: item.link,
            source: source.name,
            sourceUrl: feed.link || source.url,
            pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
            contentSnippet,
            category: detectCategory(title, contentSnippet),
            image: getImage(item, source.name, title),
            language: source.language,
          });
        }
      } catch (e) {
        console.error('RSS çekilemedi:', source.name);
      }
    })
  );

  allNews.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

  const unique = new Map();
  for (const item of allNews) {
    const key = item.title.toLowerCase().slice(0, 80);
    if (!unique.has(key)) unique.set(key, item);
  }

  return Array.from(unique.values());
}