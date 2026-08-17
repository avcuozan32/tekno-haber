import Link from 'next/link';
import { useState } from 'react';
import { NewsItem } from '../lib/getNews';
import { CATEGORIES } from '../lib/categories';

function fallbackImage(newsId: string): string {
  const safeId =
    newsId.replace(/[^a-zA-Z0-9]/g, '').slice(0, 50) || 'teknohaber';

  return `https://picsum.photos/seed/teknohaber-${safeId}/800/450`;
}

export default function NewsCard({ item }: { item: NewsItem }) {
  const categoryName =
    CATEGORIES.find((category) => category.slug === item.category)?.name ||
    'Genel Teknoloji';

  const [imageUrl, setImageUrl] = useState<string>(
    item.image || fallbackImage(item.id)
  );

  const [isFallback, setIsFallback] = useState<boolean>(!item.image);

  const handleImageError = () => {
    // Orijinal kaynak görseli hata verirse yalnızca bir kere yedek görsele geç.
    if (!isFallback) {
      setIsFallback(true);
      setImageUrl(fallbackImage(item.id));
    }
  };

  return (
    <Link href={`/haber/${item.id}`} className="block">
      <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow h-full flex flex-col">
        <div className="aspect-video overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700">
          <img
            src={imageUrl}
            alt={item.title}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={handleImageError}
          />
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 px-2 py-1 rounded">
              {categoryName}
            </span>

            <span className="text-xs text-gray-500">
              {new Date(item.pubDate).toLocaleDateString('tr-TR')}
            </span>
          </div>

          <h2 className="text-lg font-semibold line-clamp-2 mb-2 text-gray-900 dark:text-white">
            {item.title}
          </h2>

          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 flex-grow">
            {item.contentSnippet}
          </p>

          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-gray-500">{item.source}</span>
            <span className="text-xs text-blue-600 dark:text-blue-400">
              Devamı →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}