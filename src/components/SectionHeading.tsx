import type { ReactNode } from 'react';
import { Reveal, SplitWords } from '@/components/motion';

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  tone = 'light',
}: {
  eyebrow: string;
  /** A plain string gets the word-by-word reveal; nodes render as-is. */
  title: ReactNode;
  description?: string;
  align?: 'left' | 'center';
  tone?: 'light' | 'dark';
}) {
  const alignment =
    align === 'center' ? 'items-center text-center mx-auto' : 'items-start text-start';
  const dark = tone === 'dark';

  return (
    <div className={`flex max-w-2xl flex-col gap-4 ${alignment}`}>
      <Reveal className="inline-flex" y={16} blur={0} duration={0.5}>
        <span className={`eyebrow ${dark ? 'text-cyan-300' : ''}`}>
          <span className={`eyebrow-dot ${dark ? 'bg-cyan-400' : ''}`} aria-hidden="true" />
          {eyebrow}
        </span>
      </Reveal>

      <h2
        className={`text-balance font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl md:text-[2.75rem] ${
          dark ? 'text-white' : 'text-ink-950'
        }`}
      >
        {typeof title === 'string' ? <SplitWords text={title} /> : <Reveal as="span" className="inline-block">{title}</Reveal>}
      </h2>

      {description && (
        <Reveal delay={0.12} y={22} duration={0.7}>
          <p
            className={`text-base leading-relaxed sm:text-lg ${
              dark ? 'text-white/70' : 'text-ink-600'
            }`}
          >
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}
