import { GetStaticPaths, GetStaticProps } from 'next';
import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import NewsCard from '../../components/NewsCard';
import AdSlot from '../../components/AdSlot';
import CategoryFilter from '../../components/CategoryFilter';
import { getNews, NewsItem } from '../../lib/getNews';
import { CATEGORIES } from '../../lib/categories';
import { translations, detectUserLanguage, Lang } from '../../lib/translations';

interface CategoryPageProps {
  categoryName: string;
  categorySlug: string;
  news: NewsItem[];
}

export default function CategoryPage({ categoryName, categorySlug, news }: CategoryPageProps) {
  const [lang, setLang] = useState<Lang>('tr');
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    const userLang = detectUserLanguage();
    setLang(userLang);
    setFilteredNews(news.filter(n => n.language === userLang));
  }, [news]);

  const t = translations[lang];

  return (
    <Layout title={`${categoryName} - TeknoHaber`}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          {categoryName}
        </h1>

        <CategoryFilter activeCategory={categorySlug} />

        <AdSlot slot="1234567890" format="horizontal" className="my-6" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filteredNews.map((item, index) => (
            <div key={item.id}>
              <NewsCard item={item} />
              {(index + 1) % 6 === 0 && (
                <AdSlot slot="0987654321" format="rectangle" className="mt-4" />
              )}
            </div>
          ))}
        </div>

        {filteredNews.length === 0 && (
          <p className="text-center text-gray-500 mt-12">{t.noCategoryNews}</p>
        )}

        <AdSlot slot="1122334455" format="horizontal" className="mt-10" />
      </div>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = CATEGORIES.filter(c => c.slug !== 'genel').map((cat) => ({
    params: { slug: cat.slug },
  }));
  return { paths, fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps<CategoryPageProps> = async ({ params }) => {
  const slug = params?.slug as string;
  const category = CATEGORIES.find(c => c.slug === slug);
  if (!category) return { notFound: true };

  const allNews = await getNews();
  const news = allNews.filter((item) => item.category === slug);

  return {
    props: {
      categoryName: category.name,
      categorySlug: slug,
      news,
    },
    revalidate: 3600,
  };
};