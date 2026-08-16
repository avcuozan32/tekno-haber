import Link from 'next/link';
import { useState, useEffect } from 'react';
import { translations, detectUserLanguage, Lang } from '../lib/translations';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [lang, setLang] = useState<Lang>('tr');

  useEffect(() => {
    setLang(detectUserLanguage());
  }, []);

  const t = translations[lang];

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          {lang === 'tr' ? 'Tekno' : 'Tech'}<span className="text-gray-900 dark:text-white">{lang === 'tr' ? 'Haber' : 'News'}</span>
        </Link>
        <nav className="hidden md:flex gap-6">
          <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-blue-600">{t.home}</Link>
          <Link href="/kategori/yapay-zeka" className="text-gray-600 dark:text-gray-300 hover:text-blue-600">{t.ai}</Link>
          <Link href="/kategori/donanim" className="text-gray-600 dark:text-gray-300 hover:text-blue-600">{t.hardware}</Link>
          <Link href="/kategori/yazilim" className="text-gray-600 dark:text-gray-300 hover:text-blue-600">{t.software}</Link>
          <Link href="/kategori/mobil" className="text-gray-600 dark:text-gray-300 hover:text-blue-600">{t.mobile}</Link>
        </nav>
        <button className="md:hidden text-gray-600 text-2xl" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menü">☰</button>
      </div>
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 border-t">
          <nav className="flex flex-col px-4 py-2">
            <Link href="/" className="py-2 text-gray-600 hover:text-blue-600" onClick={() => setMenuOpen(false)}>{t.home}</Link>
            <Link href="/kategori/yapay-zeka" className="py-2 text-gray-600 hover:text-blue-600" onClick={() => setMenuOpen(false)}>{t.ai}</Link>
            <Link href="/kategori/donanim" className="py-2 text-gray-600 hover:text-blue-600" onClick={() => setMenuOpen(false)}>{t.hardware}</Link>
            <Link href="/kategori/yazilim" className="py-2 text-gray-600 hover:text-blue-600" onClick={() => setMenuOpen(false)}>{t.software}</Link>
            <Link href="/kategori/mobil" className="py-2 text-gray-600 hover:text-blue-600" onClick={() => setMenuOpen(false)}>{t.mobile}</Link>
          </nav>
        </div>
      )}
    </header>
  );
}