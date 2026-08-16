// components/AdSlot.tsx
import { useEffect } from 'react';

interface AdSlotProps {
  slot: string;        // AdSense reklam birimi ID'si
  format?: 'auto' | 'horizontal' | 'vertical' | 'rectangle';
  className?: string;
  style?: React.CSSProperties;
}

export default function AdSlot({ slot, format = 'auto', className = '', style }: AdSlotProps) {
  useEffect(() => {
    try {
      // AdSense script'ini dinamik olarak yükle
      if ((window as any).adsbygoogle) {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error('AdSense hatası:', error);
    }
  }, []);

  return (
    <div className={`ad-container ${className}`} style={style}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"  // Kullanıcı kendi ID'sini girmeli
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
      <p className="text-xs text-gray-400 text-center mt-1">Reklam</p>
    </div>
  );
}