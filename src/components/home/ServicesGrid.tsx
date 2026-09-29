import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpLeft, ArrowUpRight } from 'lucide-react';
import { SectionHeading } from '@/components/SectionHeading';
import { getServices } from '@/data/content';
import { useLang } from '@/i18n';
import { ServiceEcosystem } from './ServiceEcosystem/ServiceEcosystem';
import { ecosystemServices } from './ServiceEcosystem/services';
import './ServiceEcosystem/ServiceEcosystem.css';

export function ServicesGrid() {
  const { lang, t } = useLang();
  const services = getServices(lang);
  const [selectedId, setSelectedId] = useState('software');
  const selected = services.find((service) => service.id === selectedId) ?? services[0];
  const additional = services.filter((service) => !ecosystemServices.some((node) => node.id === service.id));
  const Arrow = lang === 'ar' ? ArrowUpLeft : ArrowUpRight;

  return (
    <section id="expertise" className="service-section relative scroll-mt-20 py-24 md:scroll-mt-24 md:py-32">
      <div className="container-x service-section__layout">
        <div className="service-section__heading">
          <SectionHeading eyebrow={t.home.servicesEyebrow} title={t.home.servicesTitle} />
          <p className="mt-6 max-w-sm text-sm leading-7 text-ink-400">
            {t.home.servicesSubtitle}
          </p>
        </div>
        <ServiceEcosystem services={services} selectedId={selectedId} onSelect={setSelectedId} />
        <div className="service-section__details">
          <div id="ecosystem-service-details" className="service-detail" aria-live="polite" aria-atomic="true">
            <AnimatePresence mode="wait">
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-accent-600">{selected.tagline}</p>
                  <span className="h-2 w-2 rounded-full bg-accent-500 animate-pulse" />
                </div>
                <h3 className="mt-2 font-display text-xl font-bold text-ink-950 sm:text-2xl">{selected.title}</h3>
                <p className="mt-3 text-sm leading-7 text-ink-600">{selected.description}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {selected.features.map((feature) => (
                    <li className="service-detail__feature" key={feature}>
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>
          <p className="mb-3 mt-6 text-xs font-semibold text-ink-400">
            {t.home.completingEcosystem}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-3">
            {additional.map((service) => (
              <button key={service.id} type="button" className="service-additional"
                aria-pressed={selectedId === service.id} aria-controls="ecosystem-service-details"
                onClick={() => setSelectedId(service.id)}>
                {service.title}<Arrow size={13} aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
