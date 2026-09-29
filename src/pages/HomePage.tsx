import { useReveal } from '@/hooks/useReveal';
import type { Route } from '@/hooks/useRouter';
import { Hero } from '@/components/home/Hero';
import { ServicesGrid } from '@/components/home/ServicesGrid';
import { FeaturedProjects } from '@/components/home/FeaturedProjects';
import { ProcessMarquee } from '@/components/home/ProcessMarquee';
import { InfographicCycle } from '@/components/home/InfographicCycle';
import { Strengths } from '@/components/home/Strengths';
import { AboutSection } from '@/components/home/AboutSection';
import { ContactPage } from '@/pages/ContactPage';

export function HomePage({ navigate }: { navigate: (r: Route) => void }) {
  useReveal();

  return (
    <>
      <Hero navigate={navigate} />
      <FeaturedProjects />
      <ServicesGrid />
      <ProcessMarquee />
      <InfographicCycle />
      <AboutSection />
      <Strengths />
      <ContactPage />
    </>
  );
}
