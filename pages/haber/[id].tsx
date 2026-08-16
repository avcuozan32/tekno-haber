import { GetStaticPaths, GetStaticProps } from 'next';
import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import AdSlot from '../../components/AdSlot';
import { getNews, NewsItem } from '../../lib/getNews';
import { CATEGORIES } from '../../lib/categories';
import { translations, detectUserLanguage, Lang } from '../../lib/translations';

interface NewsDetailProps {
  item: NewsItem;
}

export default function NewsDetail({ item }: NewsDetailProps) {
  const [lang, setLang] = useState<Lang>('tr');
  useEffect(() => { setLang(detectUserLanguage()); }, []);
  
  const t = translations[lang];
  const categoryName = CATEGORIES.find(c => c.slug === item.category)?.name || 'Genel';

  return (
    <Layout title={`${item.title}`}>
           {/* GOOGLE SCHMEA MARKUP (SEO İÇİN ÇOK ÖNEMLİ) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'NewsArticle',
            headline: item.title,
            image: item.image ? [item.image] : [],
            datePublished: item.pubDate,
            dateModified: item.pubDate,
            author: {
              '@type': 'Organization',
              name: item.source,
            },
            publisher: {
              '@type': 'Organization',
              name: 'TeknoHaber',
              logo: {
                '@type': 'ImageObject',
                url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/logo.png`,
              },
            },
            description: item.contentSnippet,
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/haber/${item.id}`,
            },
          }),
        }}
      />
      <article className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <span className="text-sm font-medium text-blue-600">{categoryName}</span>
          <h1 className="text-3xl md:text-4xl font-bold mt-2 mb-4 text-gray-900 dark:text-white">
            {item.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>{t.newsFrom} {item.source}</span>
            <span>•</span>
            <span>{new Date(item.pubDate).toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US')}</span>
          </div>
        </div>

        {item.image && (
  <div className="rounded-lg overflow-hidden mb-6">
    <img 
      src={item.image.startsWith('http') ? `/api/image-proxy?url=${encodeURIComponent(item.image)}` : item.image}
      alt={item.title} 
      className="w-full h-auto"
      onError={(e) => { 
        e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MDAiIGhlaWdodD0iNDAwIiB2aWV3Qm94PSIwIDAgODAwIDQwMCI+PHJlY3Qgd2lkdGg9IjgwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiMxZjI5MzciLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjI0IiBmaWxsPSIjOWNhM2FmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+R8O2cnNlbCBCdWx1bmFtYWRhxL8vdGV4dD48L3N2Zz4=';
      }}
    />
  </div>
)}

        <AdSlot slot="1234567890" format="horizontal" className="mb-6" />

        <div className="prose dark:prose-invert max-w-none mb-8">
          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            {item.contentSnippet}
          </p>
          <p className="text-sm text-gray-500 mt-4 italic">
            {t.sourceNote}
          </p>
        </div>

        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
        >
          {t.goToSource}: {item.source} →
        </a>

        <AdSlot slot="0987654321" format="rectangle" className="mt-10" />
      </article>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const news = await getNews();
  const paths = news.slice(0, 50).map((item) => ({ params: { id: item.id } }));
  return { paths, fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps<NewsDetailProps> = async ({ params }) => {
  const id = params?.id as string;
  const news = await getNews();
  const item = news.find((n) => n.id === id);
  if (!item) return { notFound: true };
  return { props: { item }, revalidate: 3600 };
};