import type { GetStaticPaths, GetStaticProps } from 'next';
import Layout from '../../components/Layout';
import AdSlot from '../../components/AdSlot';
import { getNews, NewsItem } from '../../lib/getNews';
import { CATEGORIES } from '../../lib/categories';

type Props = {
  item: NewsItem;
};

export default function NewsDetail({ item }: Props) {
  const categoryName =
    CATEGORIES.find((category) => category.slug === item.category)?.name ||
    'Genel Teknoloji';

  return (
    <Layout
      title={`${item.title} | TeknoHaber`}
      description={item.contentSnippet || item.title}
    >
      <article className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <span className="text-sm font-medium text-blue-600">
            {categoryName}
          </span>

          <h1 className="text-3xl md:text-4xl font-bold mt-2 mb-4 text-gray-900 dark:text-white">
            {item.title}
          </h1>

          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span>{item.source}</span>
            <span>•</span>
            <span>
              {new Date(item.pubDate).toLocaleDateString('tr-TR')}
            </span>
          </div>
        </div>

        {item.image ? (
          <div className="w-full aspect-video overflow-hidden rounded-lg bg-gradient-to-br from-blue-600 to-indigo-800 mb-6">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover"
              onError={(event) => {
                event.currentTarget.style.display = 'none';
              }}
            />
          </div>
        ) : (
          <div className="w-full aspect-video rounded-lg bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center mb-6">
            <span className="text-6xl">📰</span>
          </div>
        )}

        <AdSlot
          slot="1234567890"
          format="horizontal"
          className="mb-6"
        />

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            {item.contentSnippet || 'Bu haber için kısa özet bulunamadı.'}
          </p>

          <p className="text-sm text-gray-500 mt-5">
            Haberin tamamını okumak için kaynak siteyi ziyaret edebilirsiniz.
          </p>

          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="inline-block mt-5 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Kaynağa Git: {item.source} →
          </a>
        </div>

        <AdSlot
          slot="0987654321"
          format="rectangle"
          className="mt-10"
        />
      </article>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const news = await getNews();

  return {
    paths: news.map((item) => ({
      params: {
        id: item.id,
      },
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const id = params?.id as string;
  const news = await getNews();

  const item = news.find((newsItem) => newsItem.id === id);

  if (!item) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      item,
    },
  };
};