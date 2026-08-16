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

const parser = new Parser({
  timeout: 8000,
  headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
  customFields: {
    item: [
      ['media:content', 'mediaContent'],
      ['media:thumbnail', 'mediaThumbnail'],
    ],
  },
});

function makeAbsoluteUrl(url: string, baseUrl: string): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('//')) return 'https:' + url;
  if (url.startsWith('/')) {
    try {
      const base = new URL(baseUrl);
      return base.origin + url;
    } catch {
      return url;
    }
  }
  try {
    const base = new URL(baseUrl);
    return new URL(url, base.origin).toString();
  } catch {
    return url;
  }
}

function extractImageFromRSS(item: any): string | null {
  // 1. enclosure
  if (item.enclosure?.url && item.enclosure.type?.startsWith('image')) {
    return item.enclosure.url;
  }
  // 2. media:content
  if (item.mediaContent?.$?.url || item.mediaContent?.url) {
    return item.mediaContent.$?.url || item.mediaContent.url;
  }
  // 3. media:thumbnail
  if (item.mediaThumbnail?.$?.url || item.mediaThumbnail?.url) {
    return item.mediaThumbnail.$?.url || item.mediaThumbnail.url;
  }
  // 4. content:encoded içindeki img (src ve data-src)
  const content = item['content:encoded'] || item.content || '';
  const dataSrcMatch = content.match(/<img[^>]+data-src=["']([^"']+)["']/i);
  if (dataSrcMatch?.[1]) return dataSrcMatch[1];
  const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (imgMatch?.[1]) return imgMatch[1];
  // 5. description içindeki img (src ve data-src)
  const desc = item.description || '';
  const descDataSrc = desc.match(/<img[^>]+data-src=["']([^"']+)["']/i);
  if (descDataSrc?.[1]) return descDataSrc[1];
  const descMatch = desc.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (descMatch?.[1]) return descMatch[1];
  
  return null;
}

function getImage(item: any, sourceName: string, sourceUrl: string, title: string): string | null {
  // Önce RSS'ten görsel çekmeye çalış
  let url = extractImageFromRSS(item);
  
  // Görseli tam URL'ye çevir
  if (url) {
    url = makeAbsoluteUrl(url, sourceUrl);
  }
  
  // Eğer görsel bulunamadıysa VE site DonanımHaber ise → rastgele görsel üret
  if (!url && sourceName === 'DonanımHaber') {
    const seed = (sourceName + '-' + title).replace(/[^a-z0-9]/gi, '').slice(0, 20);
    url = `https://picsum.photos/seed/${seed}/800/450`;
  }
  
  // Diğer sitelerde görsel yoksa null döndür
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
        const items = (feed.items || []).slice(0, 6);
        
        for (const item of items) {
          const title = item.title?.trim() || '';
          if (!title || !item.link) continue;

          const snippet = (item.contentSnippet || item.summary || item.description || '')
            .replace(/<[^>]*>/g, '').trim().slice(0, 200);

          allNews.push({
            id: generateId(title, source.name),
            title,
            link: item.link,
            source: source.name,
            sourceUrl: feed.link || source.url,
            pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
            contentSnippet: snippet,
            category: detectCategory(title, snippet),
            image: getImage(item, source.name, source.url, title),
            language: source.language,
          });
        }
      } catch (e) {
        console.error('RSS hata:', source.name, e);
      }
    })
  );

  allNews.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

  const seen = new Map();
  for (const n of allNews) {
    const k = n.title.toLowerCase().slice(0, 60);
    if (!seen.has(k)) seen.set(k, n);
  }

  return Array.from(seen.values());
}