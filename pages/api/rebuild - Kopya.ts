// pages/api/rebuild.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Güvenlik için basit bir doğrulama (opsiyonel)
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const response = await fetch(process.env.VERCEL_DEPLOY_HOOK_URL as string, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error(`Deploy hook başarısız: ${response.status}`);
    }

    return res.status(200).json({ message: 'Rebuild tetiklendi' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Rebuild hatası' });
  }
}