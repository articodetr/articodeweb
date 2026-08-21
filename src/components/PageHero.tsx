import { BackgroundGrid, Orbs } from '@/components/Background';
import { Parallax, Reveal, SplitWords } from '@/components/motion';

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description: string;
}) {
  return (
    <section className="relative overflow-hidden pt-32 md:pt-40">
      <BackgroundGrid />
      <Parallax speed={0.2} className="absolute inset-0">
        <Orbs />
      </Parallax>

      <div className="container-x relative z-10 pb-16 md:pb-20">
        <div className="max-w-3xl">
          <Reveal className="inline-flex" y={16} blur={0} duration={0.5}>
            <span className="eyebrow">
              <span className="eyebrow-dot" aria-hidden="true" />
              {eyebrow}
            </span>
          </Reveal>

          <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.08] tracking-tightest text-ink-950 sm:text-5xl md:text-6xl">
            {typeof title === 'string' ? <SplitWords text={title} delay={0.1} /> : title}
          </h1>

          <Reveal delay={0.2} y={24}>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-600">{description}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
