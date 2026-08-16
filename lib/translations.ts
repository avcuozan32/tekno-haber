export type Lang = 'tr' | 'en';

export const translations = {
  tr: {
    siteTitle: 'TeknoHaber',
    home: 'Ana Sayfa',
    ai: 'Yapay Zeka',
    hardware: 'Donanım',
    software: 'Yazılım',
    mobile: 'Mobil',
    allNews: 'Tüm Haberler',
    allCategory: 'Tümü',
    readMore: 'Devamı →',
    goToSource: 'Kaynağa Git',
    sourceNote: 'Haberin tamamını okumak için lütfen kaynak siteyi ziyaret edin.',
    noNews: 'Haber bulunamadı.',
    noCategoryNews: 'Bu kategoride haber bulunamadı.',
    footerText: 'Bu sitede yer alan haberler RSS kaynaklarından otomatik olarak toplanmaktadır.',
    adLabel: 'Reklam',
    newsFrom: 'Kaynak:',
  },
  en: {
    siteTitle: 'TeknoNews',
    home: 'Home',
    ai: 'Artificial Intelligence',
    hardware: 'Hardware',
    software: 'Software',
    mobile: 'Mobile',
    allNews: 'All News',
    allCategory: 'All',
    readMore: 'Read More →',
    goToSource: 'Go to Source',
    sourceNote: 'Please visit the source website to read the full article.',
    noNews: 'No news found.',
    noCategoryNews: 'No news found in this category.',
    footerText: 'News on this site are automatically collected from RSS sources.',
    adLabel: 'Ad',
    newsFrom: 'Source:',
  }
};

// Tarayıcı dilini algılayan fonksiyon
export function detectUserLanguage(): Lang {
  if (typeof window === 'undefined') return 'tr'; // Sunucu tarafında varsayılan TR
  const browserLang = navigator.language || 'tr';
  return browserLang.startsWith('tr') ? 'tr' : 'en';
}