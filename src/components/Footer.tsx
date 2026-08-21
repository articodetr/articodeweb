import { ArrowUpRight, Mail, Phone } from 'lucide-react';
import type { Route } from '@/hooks/useRouter';
import { useLang } from '@/i18n';
import {
  CONTACT_EMAIL,
  CONTACT_EMAIL_HREF,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_HREF,
} from '@/data/contact';

export function Footer({ navigate }: { navigate: (r: Route) => void }) {
  const year = new Date().getFullYear();
  const { t } = useLang();

  return (
    <footer className="relative border-t border-ink-100 bg-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px glow-line" />
      <div className="container-x py-16">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-2.5">
              <img src="/logo_1.png" alt="ArtiCode" className="h-9 w-9 rounded-lg object-cover" />
              <span className="font-display text-lg font-semibold tracking-tight text-ink-950" dir="ltr">
                Arti<span className="text-gradient-accent">Code</span>
              </span>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-ink-600">{t.footer.blurb}</p>
            <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap">
              {[
                { icon: Mail, label: t.contact.emailLabel, value: CONTACT_EMAIL, href: CONTACT_EMAIL_HREF },
                {
                  icon: Phone,
                  label: t.contact.phoneLabel,
                  value: CONTACT_PHONE_DISPLAY,
                  href: CONTACT_PHONE_HREF,
                },
              ].map(({ icon: Icon, label, value, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={`${label}: ${value}`}
                  className="inline-flex min-h-11 max-w-full items-center gap-3 rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 text-ink-600 transition-all duration-300 hover:border-accent-300 hover:bg-accent-50 hover:text-accent-700"
                >
                  <Icon className="h-4.5 w-4.5 shrink-0" />
                  <bdi dir="ltr" className="text-sm font-medium">
                    {value}
                  </bdi>
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-500">{t.footer.navigate}</h4>
            <ul className="mt-4 space-y-3 text-sm">
              {([
                { id: 'home', label: t.nav.home },
                { id: 'expertise', label: t.nav.expertise },
                { id: 'projects', label: t.nav.projects },
                { id: 'about', label: t.nav.about },
                { id: 'contact', label: t.nav.contact },
              ] as { id: Route; label: string }[]).map((l) => (
                <li key={l.id}>
                  <a
                    href={`#${l.id}`}
                    onClick={(event) => {
                      event.preventDefault();
                      navigate(l.id);
                    }}
                    className="text-ink-600 transition-colors hover:text-accent-700"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-500">{t.footer.startProject}</h4>
            <p className="mt-4 text-sm text-ink-600">{t.footer.startBlurb}</p>
            <a
              href="#contact"
              onClick={(event) => {
                event.preventDefault();
                navigate('contact');
              }}
              className="btn-primary mt-5 !py-2.5"
            >
              {t.footer.getInTouch}
              <ArrowUpRight className="h-4 w-4 rtl:-scale-x-100" />
            </a>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-ink-100 pt-8 text-xs text-ink-500 sm:flex-row">
          <p>© {year} {t.footer.copyright}</p>
          <p className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-accent-400 animate-pulse" />
            {t.footer.available}
          </p>
        </div>
      </div>
    </footer>
  );
}
