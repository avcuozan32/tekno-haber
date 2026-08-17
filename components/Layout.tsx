// components/Layout.tsx
import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export default function Layout({
  children,
  title = 'TeknoHaber - Güncel Teknoloji Haberleri',
  description = 'Yapay zeka, donanım, yazılım, mobil ve daha fazlası. En güncel teknoloji haberleri otomatik olarak toplanır.',
}: LayoutProps) {
  return (
    <>
      <Head>
	<meta name="google-site-verification" content="ELayId19pP48Eff8xf23sOiBIravgIxCx5AmajY6A9A" >
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        {/* Open Graph */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="TeknoHaber" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
      </Head>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
    </>
  );
}