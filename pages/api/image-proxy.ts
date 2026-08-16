import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.query;

  if (!url || typeof url !== 'string') {
    return res.status(400).send('Geçersiz URL');
  }

  try {
    let headers: Record<string, string> = {
      'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
      'Connection': 'keep-alive',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    };

    // DonanımHaber için özel ayarlar
    if (url.includes('donanimhaber.com') || url.includes('img.donanimhaber.com')) {
      headers['Referer'] = 'https://www.donanimhaber.com/';
      headers['Origin'] = 'https://www.donanimhaber.com';
    } else {
      headers['Referer'] = 'https://www.google.com/';
    }

    const response = await fetch(url, {
      headers,
      redirect: 'follow',
    });

    if (!response.ok) {
      // DonanımHaber için alternatif URL dene
      if (url.includes('donanimhaber.com')) {
        const altUrl = url.replace('https://www.donanimhaber.com', 'https://img.donanimhaber.com');
        if (altUrl !== url) {
          try {
            const altResponse = await fetch(altUrl, {
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Referer': 'https://www.donanimhaber.com/',
                'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
              },
              redirect: 'follow',
            });

            if (altResponse.ok) {
              const contentType = altResponse.headers.get('content-type') || 'image/jpeg';
              res.setHeader('Content-Type', contentType);
              res.setHeader('Cache-Control', 'public, max-age=86400, immutable');
              const arrayBuffer = await altResponse.arrayBuffer();
              return res.send(Buffer.from(arrayBuffer));
            }
          } catch (e) {
            // Devam et
          }
        }
      }

      return res.status(response.status).send('Resim çekilemedi');
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400, immutable');
    res.setHeader('Access-Control-Allow-Origin', '*');

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    res.send(buffer);
  } catch (error) {
    console.error('Proxy hatası:', error);
    res.status(500).send('Proxy hatası');
  }
}