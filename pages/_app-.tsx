import { useEffect } from 'react';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // 1. Ülkeyi tespit et
    fetch('https://ipapi.co/json/')
      .then(r => r.json())
      .then(data => {
        const country = data.country_code; // Örn: US, DE, FR, TR
        const lang = data.languages?.split(',')[0] || 'en'; // Örn: en, de

        // 2. Eğer Türkiye değilse, sayfaya Google Translate ekle
        if (country && country !== 'TR') {
          // Google Translate scriptini yükle
          const script = document.createElement('script');
          script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
          script.async = true;
          document.head.appendChild(script);

          // Çeviri fonksiyonunu tanımla
          (window as any).googleTranslateElementInit = () => {
            new (window as any).google.translate.TranslateElement({
              pageLanguage: 'tr',      // Sitenin ana dili
              includedLanguages: 'en,de,fr,es,ru,ar', // Çevirilecek diller
              layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE
            }, 'google_translate_element');
          };

          // Üst kısma küçük bir çeviri kutusu ekle
          const div = document.createElement('div');
          div.id = 'google_translate_element';
          div.style.cssText = 'position:fixed;top:10px;right:10px;z-index:9999;background:white;padding:4px;border-radius:4px;box-shadow:0 2px 6px rgba(0,0,0,0.2);';
          document.body.appendChild(div);
        }
      })
      .catch(() => {
        // Eğer API çalışmazsa sessiz kal
      });
  }, []);

  // ... mevcut AdSense script kodun burada kalacak ...
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX';
    script.async = true;
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);
    return () => { document.head.removeChild(script); };
  }, []);

  return <Component {...pageProps} />;
}