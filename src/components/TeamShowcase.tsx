import type { PointerEvent as ReactPointerEvent } from 'react';
import type { TeamMember } from '@/data/content';
import { getWhatsAppUrl } from '@/data/contact';
import { useLang } from '@/i18n';

type TeamShowcaseProps = {
  members: TeamMember[];
};

function moveSpotlight(event: ReactPointerEvent<HTMLElement>) {
  const card = event.currentTarget;
  const bounds = card.getBoundingClientRect();

  card.style.setProperty('--spotlight-x', `${event.clientX - bounds.left}px`);
  card.style.setProperty('--spotlight-y', `${event.clientY - bounds.top}px`);
}

function resetSpotlight(event: ReactPointerEvent<HTMLElement>) {
  event.currentTarget.style.setProperty('--spotlight-x', '50%');
  event.currentTarget.style.setProperty('--spotlight-y', '50%');
}

export function TeamShowcase({ members }: TeamShowcaseProps) {
  const { lang } = useLang();

  return (
    <div className="team-grid mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" role="list">
      {members.map((member, index) => (
        <div
          key={member.initials}
          role="listitem"
          className={`reveal reveal-delay-${(index % 4) + 1} min-w-0`}
        >
          <a
            href={getWhatsAppUrl(
              lang === 'ar'
                ? `مرحباً، أود التواصل مع ${member.name}.`
                : `Hello, I'd like to contact ${member.name}.`,
            )}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={lang === 'ar' ? `تواصل مع ${member.name} عبر واتساب` : `Contact ${member.name} on WhatsApp`}
            className="team-card card-surface group relative isolate block aspect-[4/5] h-full cursor-pointer overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-4"
            onPointerMove={moveSpotlight}
            onPointerLeave={resetSpotlight}
          >
            <div className="team-card-visual absolute inset-0 overflow-hidden bg-gradient-to-br from-accent-100 via-accent-50 to-cyan-100">
              {member.image ? (
                <img
                  src={member.image}
                  alt=""
                  width={1000}
                  height={1000}
                  loading="lazy"
                  decoding="async"
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="team-card-image h-full w-full object-cover object-center"
                />
              ) : (
                <div className="team-card-image relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-accent-700 via-accent-500 to-cyan-500">
                  <div className="absolute -end-16 -top-16 h-56 w-56 rounded-full border border-white/20" />
                  <div className="absolute -bottom-20 -start-12 h-64 w-64 rounded-full border border-white/15" />
                  <span className="relative font-display text-6xl font-semibold text-white/95">
                    {member.initials}
                  </span>
                </div>
              )}

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/10 to-transparent" />
              <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
            </div>

            <div className="team-card-spotlight pointer-events-none absolute inset-0 z-10" aria-hidden="true" />

            <div className="relative z-20 flex h-full items-end p-4 sm:p-5">
              <div className="team-card-caption w-full rounded-xl border border-white/15 bg-ink-950/55 p-4 text-white shadow-xl backdrop-blur-md">
                <div className="team-card-accent mb-3 h-px w-9 bg-gradient-to-r from-accent-300 to-cyan-300 rtl:bg-gradient-to-l" />
                <h3 className="font-display text-base font-semibold text-white">{member.name}</h3>
                <p className="mt-1 text-sm text-white/70">{member.role}</p>
              </div>
            </div>
          </a>
        </div>
      ))}
    </div>
  );
}
