// lib/categories.ts
export interface Category {
  slug: string;
  name: string;
  keywords: string[];
}

export const CATEGORIES: Category[] = [
  { slug: 'yapay-zeka', name: 'Yapay Zeka', keywords: ['ai', 'yapay zeka', 'artificial intelligence', 'machine learning', 'openai', 'chatgpt', 'deep learning', 'neural'] },
  { slug: 'donanim', name: 'Donanım', keywords: ['işlemci', 'ekran kartı', 'ram', 'ssd', 'laptop', 'bilgisayar', 'hardware', 'cpu', 'gpu', 'intel', 'amd', 'nvidia', 'pc'] },
  { slug: 'yazilim', name: 'Yazılım', keywords: ['software', 'yazılım', 'uygulama', 'app', 'code', 'programming', 'developer', 'web', 'tarayıcı', 'browser', 'güncelleme', 'update'] },
  { slug: 'mobil', name: 'Mobil', keywords: ['telefon', 'phone', 'iphone', 'android', 'samsung', 'xiaomi', 'ios', 'ipad', 'tablet', 'mobil'] },
  { slug: 'guvenlik', name: 'Siber Güvenlik', keywords: ['security', 'güvenlik', 'siber', 'hack', 'veri sızıntısı', 'malware', 'zararlı', 'ransomware', 'phishing'] },
  { slug: 'oyun', name: 'Oyun', keywords: ['oyun', 'game', 'gaming', 'playstation', 'xbox', 'nintendo', 'steam', 'epic games', 'e-spor'] },
  { slug: 'bilim', name: 'Bilim & Uzay', keywords: ['nasa', 'spacex', 'uzay', 'bilim', 'science', 'mars', 'roket', 'teleskop', 'astronomi'] },
  { slug: 'startup', name: 'Startup & Girişim', keywords: ['startup', 'girişim', 'yatırım', 'investment', 'unicorn', 'fintech', 'e-ticaret'] },
  { slug: 'genel', name: 'Genel Teknoloji', keywords: [] }, // varsayılan
];

export function detectCategory(title: string, description: string = ''): string {
  const text = (title + ' ' + description).toLowerCase();
  for (const cat of CATEGORIES) {
    if (cat.slug === 'genel') continue;
    for (const kw of cat.keywords) {
      if (text.includes(kw)) return cat.slug;
    }
  }
  return 'genel';
}