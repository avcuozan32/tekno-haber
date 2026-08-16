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
  url = url.trim();
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('//')) return 'https:' + url;
  if (url.startsWith('/')) {
    try {
      const base = new URL(baseUrl);
      return base.origin + url;
    } catch { return url; }
  }
  try {
    const base = new URL(baseUrl);
    return new URL(url, base.origin).toString();
  } catch { return url; }
}

function extractImageFromRSS(item: any): string | null {
  if (item.enclosure?.url && item.enclosure.type?.startsWith('image')) return item.enclosure.url;
  if (item.mediaContent?.$?.url) return item.mediaContent.$.url;
  if (item.mediaContent?.url) return item.mediaContent.url;
  if (item.mediaThumbnail?.$?.url) return item.mediaThumbnail.$.url;
  if (item.mediaThumbnail?.url) return item.mediaThumbnail.url;
  
  const content = item['content:encoded'] || item.content || '';
  const dataSrcMatch = content.match(/<img[^>]+data-src=["']([^"']+)["']/i);
  if (dataSrcMatch?.[1]) return dataSrcMatch[1];
  const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (imgMatch?.[1]) return imgMatch[1];
  
  const desc = item.description || '';
  const descDataSrc = desc.match(/<img[^>]+data-src=["']([^"']+)["']/i);
  if (descDataSrc?.[1]) return descDataSrc[1];
  const descMatch = desc.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (descMatch?.[1]) return descMatch[1];
  
  return null;
}

// ShiftDelete için haber sayfasından og:image çek
async function fetchShiftDeleteImage(newsUrl: string): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    
    const response = await fetch(newsUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html',
      },
      signal: controller.signal,
    });
    
    clearTimeout(timeout);
    if (!response.ok) return null;
    
    const html = await response.text();
    const ogMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i);
    if (ogMatch?.[1]) return ogMatch[1];
    
    const ogMatch2 = html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
    if (ogMatch2?.[1]) return ogMatch2[1];
    
    return null;
  } catch {
    return null;
  }
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

          let imageUrl = extractImageFromRSS(item);
          if (imageUrl) {
            imageUrl = makeAbsoluteUrl(imageUrl, source.url);
          }

          allNews.push({
            id: generateId(title, source.name),
            title,
            link: item.link,
            source: source.name,
            sourceUrl: feed.link || source.url,
            pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
            contentSnippet: snippet,
            category: detectCategory(title, snippet),
            image: imageUrl,
            language: source.language,
          });
        }
      } catch (e) {
        console.error('RSS hata:', source.name);
      }
    })
  );

  // ShiftDelete için görsel yoksa og:image çek
  const shiftDeleteNews = allNews.filter(n => n.source === 'ShiftDelete' && !n.image);
  if (shiftDeleteNews.length > 0) {
    await Promise.all(
      shiftDeleteNews.map(async (newsItem) => {
        const ogImage = await fetchShiftDeleteImage(newsItem.link);
        if (ogImage) {
          newsItem.image = makeAbsoluteUrl(ogImage, 'https://shiftdelete.net');
        }
      })
    );
  }

  // DonanımHaber için görsel yoksa rastgele görsel üret
  for (const n of allNews) {
    if (n.source === 'DonanımHaber' && !n.image) {
      const seed = (n.source + '-' + n.title).replace(/[^a-z0-9]/gi, '').slice(0, 20);
      n.image = `https://picsum.photos/seed/${seed}/800/450`;
    }
  }

  allNews.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

  const seen = new Map();
  for (const n of allNews) {
    const k = n.title.toLowerCase().slice(0, 60);
    if (!seen.has(k)) seen.set(k, n);
  }

  return Array.from(seen.values());
}