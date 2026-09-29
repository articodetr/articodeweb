import { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { getWhatsAppUrl } from '@/data/contact';
import { useLang } from '@/i18n';

export function WhatsAppButton() {
  const { t } = useLang();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 160);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const href = getWhatsAppUrl(t.whatsapp.quickMessage);

  return (
    <div
      className={`fixed bottom-6 end-6 z-40 transition-all duration-500 ease-out ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-6 opacity-0'
      }`}
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t.whatsapp.chatOnWhatsApp}
        className="group relative flex items-center gap-2.5 rounded-full border border-emerald-400/30 bg-white/95 py-2.5 pe-4 ps-3 shadow-[0_12px_36px_-8px_rgba(16,185,129,0.45)] backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-emerald-500 hover:bg-emerald-50/50 hover:shadow-[0_16px_40px_-6px_rgba(16,185,129,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
      >
        <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 text-white shadow-md shadow-emerald-500/30">
          <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/40" style={{ animationDuration: '2.5s' }} />
          <MessageCircle className="relative h-5 w-5 fill-current" />
        </span>

        <div className="hidden sm:block text-start">
          <div className="text-xs font-bold text-ink-950 transition-colors group-hover:text-emerald-800">
            {t.whatsapp.chatOnWhatsApp}
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-medium text-emerald-700">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {t.whatsapp.activeNow}
          </div>
        </div>
      </a>
    </div>
  );
}
