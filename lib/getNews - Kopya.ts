// lib/getNews.ts
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
  image?: string;
  language: 'tr' | 'en';
}

const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; TeknoHaberBot/1.0)',
  },
});

// RSS içeriğinden görsel çıkarmaya çalışır
function extractImage(item: any): string | undefined {
  // Farklı RSS formatlarında görsel olabilir
  if (item.enclosure?.url) return item.enclosure.url;
  if (item['media:content']?.url) return item['media:content'].url;
  if (item['media:thumbnail']?.url) return item['media:thumbnail'].url;
  // content içinde img etiketi ara
  const content = item['content:encoded'] || item.content || '';
  const match = content.match(/<img[^>]+src="([^">]+)"/);
  return match?.[1];
}

function generateId(title: string, source: string): string {
  return Buffer.from(`${source}-${title}`).toString('base64').replace(/[+/=]/g, '').slice(0, 24);
}

export async function getNews(): Promise<NewsItem[]> {
  const allNews: NewsItem[] = [];

  await Promise.all(
    FEED_SOURCES.map(async (source) => {
      try {
        const feed = await parser.parseURL(source.url);
        const items = feed.items || [];

        for (const item of items.slice(0, 15)) { // her kaynaktan en fazla 15 haber
          const title = item.title?.trim() || '';
          if (!title || !item.link) continue;

          const contentSnippet = (item.contentSnippet || item.summary || '')
            .replace(/<[^>]*>/g, '')
            .trim()
            .slice(0, 250);

          const detectedCategory = detectCategory(title, contentSnippet);

          allNews.push({
            id: generateId(title, source.name),
            title,
            link: item.link,
            source: source.name,
            sourceUrl: feed.link || source.url,
            pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
            contentSnippet,
            category: detectedCategory,
            image: extractImage(item) || null,
            language: source.language,
          });
        }
      } catch (error) {
        console.error(`RSS çekilemedi: ${source.name} - ${source.url}`, error);
      }
    })
  );

  // Tarihe göre sırala (en yeni önce)
  allNews.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

  // Aynı başlıklı haberleri tekilleştir
  const unique = new Map<string, NewsItem>();
  for (const item of allNews) {
    const key = item.title.toLowerCase().slice(0, 80);
    if (!unique.has(key)) unique.set(key, item);
  }

  return Array.from(unique.values());
}