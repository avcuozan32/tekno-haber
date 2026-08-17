import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Google AdSense reklam scripti
    const adScript = document.createElement('script');
    adScript.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6220773194970527';
    adScript.async = true;
    adScript.crossOrigin = 'anonymous';
    document.head.appendChild(adScript);

    // Ülkeye göre otomatik çeviri
    fetch('https://ipapi.co/json/')
      .then((r) => r.json())
      .then((data) => {
        const country = data.country_code;
        if (country && country !== 'TR') {
          const gtScript = document.createElement('script');
          gtScript.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
          gtScript.async = true;
          document.head.appendChild(gtScript);

          (window as any).googleTranslateElementInit = () => {
            new (window as any).google.translate.TranslateElement(
              {
                pageLanguage: 'tr',
                includedLanguages: 'en,de,fr,es,ru,ar',
                layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
              },
              'google_translate_element'
            );
          };

          const div = document.createElement('div');
          div.id = 'google_translate_element';
          div.style.cssText =
            'position:fixed;top:10px;right:10px;z-index:9999;background:white;padding:4px;border-radius:4px;box-shadow:0 2px 6px rgba(0,0,0,0.2);';
          document.body.appendChild(div);
        }
      })
      .catch(() => {});
  }, []);

  return <Component {...pageProps} />;
}