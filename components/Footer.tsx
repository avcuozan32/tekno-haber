import { useEffect, useState } from 'react';
import { translations, detectUserLanguage, Lang } from '../lib/translations';

export default function Footer() {
  const [lang, setLang] = useState<Lang>('tr');
  useEffect(() => { setLang(detectUserLanguage()); }, []);
  const t = translations[lang];

  return (
    <footer className="bg-white dark:bg-gray-800 border-t mt-12">
      <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} {lang === 'tr' ? 'TeknoHaber. Tüm hakları saklıdır.' : 'TechNews. All rights reserved.'}</p>
        <p className="mt-2">{t.footerText}</p>
      </div>
    </footer>
  );
}