import { GetStaticProps } from 'next';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import NewsCard from '../components/NewsCard';
import AdSlot from '../components/AdSlot';
import CategoryFilter from '../components/CategoryFilter';
import { getNews, NewsItem } from '../lib/getNews';
import { translations, detectUserLanguage, Lang } from '../lib/translations';

interface HomeProps {
  news: NewsItem[];
}

export default function Home({ news }: HomeProps) {
  const [lang, setLang] = useState<Lang>('tr');
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    const userLang = detectUserLanguage();
    setLang(userLang);
    // Kullanıcının diline göre haberleri otomatik filtrele (TR ise sadece TR, EN ise sadece EN)
    // Eğer isterseniz 'tumu' yapıp hepsini gösterebilirsiniz.
    setFilteredNews(news.filter(n => n.language === userLang));
  }, [news]);

  const t = translations[lang];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          {t.allNews}
        </h1>

        <CategoryFilter activeCategory="tumu" />

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
          <p className="text-center text-gray-500 mt-12">{t.noNews}</p>
        )}

        <AdSlot slot="1122334455" format="horizontal" className="mt-10" />
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const news = await getNews();
  return { props: { news }, revalidate: 3600 };
};