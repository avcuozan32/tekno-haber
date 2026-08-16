import Link from 'next/link';
import { NewsItem } from '../lib/getNews';
import { CATEGORIES } from '../lib/categories';

const DefaultImage = () => (
  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  </div>
);

export default function NewsCard({ item }: { item: NewsItem }) {
  const categoryName = CATEGORIES.find((c) => c.slug === item.category)?.name || 'Genel';

  return (
    <Link href={`/haber/${item.id}`} className="block">
      <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow h-full flex flex-col">
        <div className="aspect-video overflow-hidden bg-gray-200">
          {item.image ? (
            <img
              src={item.image.startsWith('http') ? `/api/image-proxy?url=${encodeURIComponent(item.image)}` : item.image}
              alt={item.title}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => { 
                e.currentTarget.style.display = 'none'; 
                const next = e.currentTarget.nextElementSibling as HTMLElement;
                if (next) next.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className={`w-full h-full ${item.image ? 'hidden' : ''}`}>
            <DefaultImage />
          </div>
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
            <span className="text-xs text-blue-600 dark:text-blue-400">Devamı →</span>
          </div>
        </div>
      </article>
    </Link>
  );
}