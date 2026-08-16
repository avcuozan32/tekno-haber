// pages/index.tsx
import { GetStaticProps } from 'next';
import Layout from '../components/Layout';
import NewsCard from '../components/NewsCard';
import AdSlot from '../components/AdSlot';
import CategoryFilter from '../components/CategoryFilter';
import { getNews, NewsItem } from '../lib/getNews';
import { useRouter } from 'next/router';

interface HomeProps {
  news: NewsItem[];
  totalCount: number;
}

export default function Home({ news, totalCount }: HomeProps) {
  const router = useRouter();
  const { kategori } = router.query;

  const filteredNews = kategori && kategori !== 'tumu'
    ? news.filter((n) => n.category === kategori)
    : news;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Teknoloji Haberleri
        </h1>

        <CategoryFilter activeCategory={(kategori as string) || 'tumu'} />

        {/* Üst reklam alanı */}
        <AdSlot slot="1234567890" format="horizontal" className="my-6" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filteredNews.map((item, index) => (
            <div key={item.id}>
              <NewsCard item={item} />
              {/* Her 6 haberden sonra reklam */}
              {(index + 1) % 6 === 0 && (
                <AdSlot slot="0987654321" format="rectangle" className="mt-4" />
              )}
            </div>
          ))}
        </div>

        {filteredNews.length === 0 && (
          <p className="text-center text-gray-500 mt-12">Haber bulunamadı.</p>
        )}

        {/* Alt reklam alanı */}
        <AdSlot slot="1122334455" format="horizontal" className="mt-10" />
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const news = await getNews();
  return {
    props: {
      news,
      totalCount: news.length,
    },
    revalidate: 3600, // 1 saatte bir yeniden doğrula (opsiyonel)
  };
};