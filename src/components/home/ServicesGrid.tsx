import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { SectionHeading } from '@/components/SectionHeading';
import { Reveal } from '@/components/motion';
import { EASE } from '@/lib/motionTokens';
import { getServices, type Service } from '@/data/content';
import { useLang } from '@/i18n';

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Nine services in nine identical cards reads as wallpaper. A disclosure list
 * keeps the section short, puts one service in focus at a time, and stays
 * visually distinct from the journey section's station cards.
 */
export function ServicesGrid() {
  const { lang, t } = useLang();
  const services = getServices(lang);
  const [open, setOpen] = useState(0);

  return (
    <section id="expertise" className="relative scroll-mt-20 py-24 md:scroll-mt-24 md:py-32">
      <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <SectionHeading eyebrow={t.home.servicesEyebrow} title={t.home.servicesTitle} />
          </div>
        </div>

        <Reveal className="lg:col-span-7" y={40} amount={0.1}>
          <ul className="card-surface divide-y divide-ink-100 overflow-hidden">
            {services.map((service, i) => (
              <ServiceRow
                key={service.id}
                service={service}
                index={i}
                open={open === i}
                onToggle={() => setOpen((prev) => (prev === i ? -1 : i))}
              />
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

function ServiceRow({
  service,
  index,
  open,
  onToggle,
}: {
  service: Service;
  index: number;
  open: boolean;
  onToggle: () => void;
}) {
  const Icon = service.icon;
  const reduced = !!useReducedMotion();
  const panelId = `service-panel-${service.id}`;
  const buttonId = `service-trigger-${service.id}`;

  return (
    <li className={`relative transition-colors duration-400 ${open ? 'bg-accent-50/40' : ''}`}>
      {/* Active rail — grows down the edge of the open row. */}
      <motion.span
        aria-hidden="true"
        className="absolute inset-y-0 start-0 w-[3px] origin-top bg-accent-600"
        initial={false}
        animate={{ scaleY: open ? 1 : 0 }}
        transition={{ duration: reduced ? 0 : 0.45, ease: EASE }}
      />

      <h3>
        <button
          id={buttonId}
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={panelId}
          className="group flex w-full items-center gap-4 px-6 py-6 text-start transition-colors duration-300 hover:bg-accent-50/30 md:gap-5 md:px-8"
        >
          <span
            dir="ltr"
            className={`w-8 shrink-0 font-display text-sm font-black tabular-nums transition-colors duration-300 ${
              open ? 'text-accent-600' : 'text-ink-300 group-hover:text-accent-400'
            }`}
          >
            {pad(index + 1)}
          </span>

          <span className="min-w-0 flex-1">
            <span className="block font-display text-xl font-bold text-ink-950 md:text-2xl">
              {service.title}
            </span>
            <span className="mt-1 block text-xs font-semibold text-accent-700/80">
              {service.tagline}
            </span>
          </span>

          <span
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-all duration-400 ${
              open
                ? 'bg-accent-600 text-white shadow-[0_12px_26px_rgba(41,57,199,0.3)]'
                : 'border border-accent-100 bg-accent-50 text-accent-700 group-hover:border-accent-300 group-hover:bg-white'
            }`}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>

          <ChevronDown
            aria-hidden="true"
            className={`h-4 w-4 shrink-0 text-ink-400 transition-transform duration-400 ${
              open ? 'rotate-180 text-accent-600' : ''
            }`}
          />
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            key="panel"
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduced ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.45, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="ps-[3.5rem] pb-7 pe-6 md:ps-[4.25rem] md:pe-8">
              <p className="max-w-2xl text-sm leading-relaxed text-ink-600 md:text-[15px]">
                {service.description}
              </p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {service.features.map((f, fi) => (
                  <motion.li
                    key={f}
                    initial={reduced ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.1 + fi * 0.05, ease: EASE }}
                    className="rounded-full border border-accent-100 bg-white px-3 py-1 text-[0.7rem] font-medium text-accent-700"
                  >
                    {f}
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}
