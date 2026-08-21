import { ChartNoAxesColumnIncreasing } from 'lucide-react';

type Stat = {
  value: string;
  label: string;
};

type StatsCardProps = {
  title: string;
  stats: Stat[];
};

export function StatsCard({ title, stats }: StatsCardProps) {
  return (
    <div className="card-surface overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-5 sm:px-6">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-50 text-accent-700 ring-1 ring-accent-100">
          <ChartNoAxesColumnIncreasing className="h-5 w-5" aria-hidden="true" />
        </span>
        <h3 className="font-display text-xl font-semibold text-ink-950">{title}</h3>
        <span className="h-px flex-1 bg-gradient-to-l from-ink-100 to-transparent rtl:bg-gradient-to-r" aria-hidden="true" />
      </div>

      <dl className="grid grid-cols-2 gap-px border-t border-ink-100 bg-ink-100">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="group flex min-h-28 min-w-0 flex-col justify-center bg-white/95 px-5 py-5 transition-colors duration-300 hover:bg-accent-50/60 sm:px-6 sm:py-6"
          >
            <dt className="order-2 mt-2 text-sm leading-5 text-ink-600">{stat.label}</dt>
            <dd className="order-1 font-display text-3xl font-semibold tracking-tight text-accent-700 sm:text-4xl">
              <bdi dir="ltr" className="tabular-nums">
                {stat.value}
              </bdi>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
