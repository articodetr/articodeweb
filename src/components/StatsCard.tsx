import { ChartNoAxesColumnIncreasing } from 'lucide-react';
import { CountUp } from '@/components/motion';

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
    <div className="card-surface flex h-full flex-col overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 sm:px-6">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-50 text-accent-700 ring-1 ring-accent-100">
          <ChartNoAxesColumnIncreasing className="h-5 w-5" aria-hidden="true" />
        </span>
        <h3 className="font-display text-lg font-bold text-ink-950 md:text-xl">{title}</h3>
        <span
          className="h-px flex-1 bg-gradient-to-l from-ink-100 to-transparent rtl:bg-gradient-to-r"
          aria-hidden="true"
        />
      </div>

      <dl className="grid flex-1 grid-cols-2 grid-rows-4 gap-px border-t border-ink-100 bg-ink-100">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex min-w-0 flex-col justify-center bg-white px-5 py-3.5 transition-colors duration-300 hover:bg-accent-50/60 sm:px-6 sm:py-4"
          >
            <dt className="order-2 mt-2 text-sm leading-5 text-ink-600">{stat.label}</dt>
            <dd className="order-1">
              <CountUp
                value={stat.value}
                className="font-display text-3xl font-bold tracking-tight text-accent-700 sm:text-[2rem]"
              />
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
