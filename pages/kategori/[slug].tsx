import { GetStaticPaths, GetStaticProps } from 'next';
import Layout from '../../components/Layout';
import NewsCard from '../../components/NewsCard';
import AdSlot from '../../components/AdSlot';
import CategoryFilter from '../../components/CategoryFilter';
import { getNews, NewsItem } from '../../lib/getNews';
import { CATEGORIES } from '../../lib/categories';

interface CategoryPageProps {
  categoryName: string;
  categorySlug: string;
  news: NewsItem[];
}

export default function CategoryPage({
  categoryName,
  categorySlug,
  news,
}: CategoryPageProps) {
  return (
    <Layout
      title={`${categoryName} Haberleri | TeknoHaber`}
      description={`${categoryName} kategorisindeki en güncel teknoloji haberleri.`}
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          {categoryName} Haberleri
        </h1>

        <CategoryFilter activeCategory={categorySlug} />

        <AdSlot
          slot="1234567890"
          format="horizontal"
          className="my-6"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {news.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>

        {news.length === 0 && (
          <p className="text-center text-gray-500 mt-12">
            Bu kategoride henüz haber bulunamadı.
          </p>
        )}
      </div>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = CATEGORIES
    .filter((category) => category.slug !== 'genel')
    .map((category) => ({
      params: {
        slug: category.slug,
      },
    }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<CategoryPageProps> = async ({
  params,
}) => {
  const slug = params?.slug as string;

  const category = CATEGORIES.find(
    (categoryItem) => categoryItem.slug === slug
  );

  if (!category) {
    return {
      notFound: true,
    };
  }

  const allNews = await getNews();

  const news = allNews.filter(
    (item) => item.category === slug
  );

  return {
    props: {
      categoryName: category.name,
      categorySlug: slug,
      news,
    },
    revalidate: 3600,
  };
};