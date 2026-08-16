import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CATEGORIES } from '../lib/categories';
import { translations, detectUserLanguage, Lang } from '../lib/translations';

interface CategoryFilterProps {
  activeCategory: string;
}

// Kategori slug'larını çeviri anahtarlarına eşleştiren harita
const categoryTranslationMap: Record<string, keyof typeof translations.tr> = {
  'yapay-zeka': 'ai',
  'donanim': 'hardware',
  'yazilim': 'software',
  'mobil': 'mobile',
  'guvenlik': 'hardware',
  'oyun': 'software',
  'bilim': 'ai',
  'startup': 'software',
};

export default function CategoryFilter({ activeCategory }: CategoryFilterProps) {
  const [lang, setLang] = useState<Lang>('tr');
  useEffect(() => { setLang(detectUserLanguage()); }, []);

  const t = translations[lang];

  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href="/"
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          activeCategory === 'tumu'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300'
        }`}
      >
        {t.allCategory}
      </Link>
      {CATEGORIES.filter(c => c.slug !== 'genel').map((cat) => {
        const translationKey = categoryTranslationMap[cat.slug] || 'ai';
        const displayName = t[translationKey] || cat.name;

        return (
          <Link
            key={cat.slug}
            href={`/kategori/${cat.slug}`}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === cat.slug
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            {displayName}
          </Link>
        );
      })}
    </div>
  );
}