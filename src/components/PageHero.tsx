import { BackgroundGrid, Orbs } from '@/components/Background';

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
      <Orbs />
      <div className="container-x relative z-10 pb-16 md:pb-20">
        <div className="reveal max-w-3xl">
          <span className="eyebrow">
            <span className="h-px w-6 bg-accent-400" />
            {eyebrow}
          </span>
          <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.08] tracking-tightest text-ink-950 sm:text-5xl md:text-6xl">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-600">{description}</p>
        </div>
      </div>
    </section>
  );
}
