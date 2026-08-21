export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  align?: 'left' | 'center';
}) {
  const alignment = align === 'center' ? 'items-center text-center mx-auto' : 'items-start text-start';
  return (
    <div className={`reveal flex max-w-2xl flex-col gap-4 ${alignment}`}>
      <span className="eyebrow">
        <span className="h-px w-6 bg-accent-400" />
        {eyebrow}
      </span>
      <h2 className="font-display text-3xl font-semibold leading-[1.1] tracking-tight text-ink-950 sm:text-4xl md:text-[2.75rem]">
        {title}
      </h2>
      {description && (
        <p className="text-base leading-relaxed text-ink-600 sm:text-lg">{description}</p>
      )}
    </div>
  );
}
