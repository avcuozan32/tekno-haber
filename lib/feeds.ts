// lib/feeds.ts
export interface FeedSource {
  name: string;
  url: string;
  category: string; // ana kategori
  language: 'tr' | 'en';
}

export const FEED_SOURCES: FeedSource[] = [
  // Türkçe kaynaklar
  { name: 'Webrazzi', url: 'https://webrazzi.com/feed/', category: 'startup', language: 'tr' },
  { name: 'ShiftDelete', url: 'https://shiftdelete.net/feed', category: 'genel', language: 'tr' },
  { name: 'DonanımHaber', url: 'https://www.donanimhaber.com/rss/tum/', category: 'donanim', language: 'tr' },
  { name: 'Technopat', url: 'https://www.technopat.net/feed/', category: 'genel', language: 'tr' },

  // İngilizce kaynaklar
  { name: 'TechCrunch', url: 'https://techcrunch.com/feed/', category: 'startup', language: 'en' },
  { name: 'The Verge', url: 'https://www.theverge.com/rss/index.xml', category: 'genel', language: 'en' },
  { name: 'Wired', url: 'https://www.wired.com/feed/rss', category: 'bilim', language: 'en' },
  { name: 'Ars Technica', url: 'https://feeds.arstechnica.com/arstechnica/index', category: 'donanim', language: 'en' },
  { name: 'Engadget', url: 'https://www.engadget.com/rss.xml', category: 'mobil', language: 'en' },
  { name: 'CNET', url: 'https://www.cnet.com/rss/news/', category: 'genel', language: 'en' },
  { name: 'VentureBeat', url: 'https://venturebeat.com/feed/', category: 'ai', language: 'en' },
  { name: '9to5Mac', url: 'https://9to5mac.com/feed/', category: 'mobil', language: 'en' },
  { name: 'Tom’s Hardware', url: 'https://www.tomshardware.com/feeds/all', category: 'donanim', language: 'en' },
  { name: 'Hacker News', url: 'https://news.ycombinator.com/rss', category: 'yazilim', language: 'en' },
];