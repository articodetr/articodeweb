import { useId, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Code2, Globe2, Pause, Play } from 'lucide-react';
import type { Service } from '@/data/content';
import { useLang } from '@/i18n';
import { publicAsset } from '@/lib/publicAsset';
import { ecosystemServices } from './services';

gsap.registerPlugin(ScrollTrigger);

function Illustration({ name, alt, hub = false }: { name: string; alt: string; hub?: boolean }) {
  return (
    <picture>
      <source type="image/webp" srcSet={`${publicAsset(`services/${name}-384.webp`)} 384w, ${publicAsset(`services/${name}-768.webp`)} 768w`}
        sizes={hub ? '(max-width: 639px) 55vw, 330px' : '(max-width: 639px) 40vw, 180px'} />
      <img src={publicAsset(`services/${name}.png`)} alt={alt} width="1254" height="1254"
        loading="lazy" decoding="async" draggable={false} />
    </picture>
  );
}

export function ServiceEcosystem({ services, selectedId, onSelect }: {
  services: Service[]; selectedId: string; onSelect: (id: string) => void;
}) {
  const { lang, t } = useLang();
  const root = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [focused, setFocused] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);
  const active = hovered ?? focused;
  const playback = useRef<(() => void) | null>(null);
  const isPaused = useRef(false);
  const enteredOnce = useRef(false);
  const pulseTweens = useRef<Map<string, gsap.core.Tween[]>>(new Map());
  const filterId = `ecosystem-glow-${useId().replace(/:/g, '')}`;

  useLayoutEffect(() => {
    const element = root.current;
    if (!element) return;
    const media = gsap.matchMedia();
    media.add({ motion: '(prefers-reduced-motion: no-preference)', mobile: '(max-width: 639px)' }, (context) => {
      if (!context.conditions?.motion) return;
      const small = context.conditions.mobile;
      const select = gsap.utils.selector(element);
      const paths = select(small ? '.ecosystem-wires--mobile .ecosystem-wire__draw' : '.ecosystem-wires--desktop .ecosystem-wire__draw');
      const pulses = Array.from(element.querySelectorAll<SVGPathElement>(small ? '.ecosystem-wires--mobile .ecosystem-wire__pulse' : '.ecosystem-wires--desktop .ecosystem-wire__pulse'));
      const loops: gsap.core.Tween[] = [];
      let entered = false;
      let visible = false;
      const sync = () => {
        const running = entered && visible && !document.hidden && !isPaused.current;
        loops.forEach((loop) => running ? loop.play() : loop.pause());
      };
      playback.current = sync;
      gsap.set(paths, { strokeDasharray: '100 100', strokeDashoffset: 100 });
      gsap.set(pulses, { opacity: 0, strokeDasharray: '3 110', strokeDashoffset: 8 });
      const entrance = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' }, onComplete: () => {
        entered = true;
        enteredOnce.current = true;
        sync();
      } });
      entrance.from(select('.ecosystem-hub__entrance'), { opacity: 0, scale: 0.75, y: 50, rotation: -3, duration: 0.85 }, 0);
      ecosystemServices.forEach((service, index) => {
        entrance.from(select(`[data-service="${service.id}"] .ecosystem-node__entrance`), {
          opacity: 0, x: service.enter[0], y: service.enter[1], scale: 0.88,
          rotation: index % 2 ? 2 : -2, duration: 0.7,
        }, 0.65 + index * 0.16);
        loops.push(gsap.to(select(`[data-service="${service.id}"] .ecosystem-node__float`), {
          y: index % 2 ? 4 : -5, rotation: index % 2 ? 0.65 : -0.65,
          duration: service.duration, ease: 'sine.inOut', repeat: -1, yoyo: true, paused: true,
        }));
      });
      entrance.to(paths, { strokeDashoffset: 0, duration: 0.75, stagger: 0.055, ease: 'power2.inOut' }, 2);
      entrance.to(pulses, { opacity: 1, duration: 0.2 }, 3.55);
      pulses.forEach((pulse: SVGPathElement, index: number) => {
        const tween = gsap.to(pulse, { strokeDashoffset: -100, duration: 2.6 + index * 0.3,
          delay: index * 0.32, repeat: -1, repeatDelay: 0.3, ease: 'none', paused: true });
        pulseTweens.current.set(pulse.dataset.connection!, [tween]);
        loops.push(tween);
      });
      loops.push(gsap.to(select('.ecosystem-hub__float'), { y: -3, scale: 1.01, duration: 4.8, repeat: -1, yoyo: true, ease: 'sine.inOut', paused: true }));
      loops.push(gsap.to(select('.ecosystem-aura'), { opacity: 0.55, duration: 3.7, repeat: -1, yoyo: true, ease: 'sine.inOut', paused: true }));
      if (enteredOnce.current) entrance.progress(1);
      ScrollTrigger.create({ trigger: element, start: 'top 85%', end: 'bottom top',
        onToggle: (self) => {
          visible = self.isActive;
          if (visible && !entered) entrance.play();
          else if (!visible && !entered) entrance.pause();
          sync();
        },
      });
      // Keyboard users can reach controls before the scroll reveal completes.
      const revealOnFocus = () => { entrance.progress(1); };
      element.addEventListener('focusin', revealOnFocus);
      document.addEventListener('visibilitychange', sync);
      return () => {
        document.removeEventListener('visibilitychange', sync);
        element.removeEventListener('focusin', revealOnFocus);
        playback.current = null;
        pulseTweens.current.clear();
      };
    }, element);
    return () => media.revert();
  }, []);

  useLayoutEffect(() => {
    pulseTweens.current.forEach((tweens, id) => tweens.forEach((tween) => tween.timeScale(active === id ? 1.8 : 1)));
  }, [active]);

  function toggleMotion() {
    isPaused.current = !isPaused.current;
    setPaused(isPaused.current);
    playback.current?.();
  }

  return (
    <div ref={root} className="ecosystem" data-active={active ?? undefined}>
      <div className="ecosystem-toolbar">
        <span className="ecosystem-caption"><span aria-hidden="true" />{t.ecosystem.caption}</span>
        <button type="button" className="ecosystem-motion" onClick={toggleMotion} aria-pressed={paused}
          aria-label={paused ? t.ecosystem.playAnimation : t.ecosystem.pauseAnimation}>
          {paused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
        </button>
      </div>
      <div className="ecosystem-stage" dir="ltr">
        <div className="ecosystem-aura" aria-hidden="true" />
        <div className="ecosystem-orbit" aria-hidden="true" />
        {(['desktop', 'mobile'] as const).map((layout) => (
          <svg key={layout} className={`ecosystem-wires ecosystem-wires--${layout}`}
            viewBox={layout === 'desktop' ? '0 0 720 650' : '0 0 600 1240'} fill="none" aria-hidden="true">
            <defs><filter id={`${filterId}-${layout}`} x="-50%" y="-50%" width="200%" height="200%" colorInterpolationFilters="sRGB">
              <feGaussianBlur stdDeviation="3" />
            </filter></defs>
            {ecosystemServices.map((service) => {
              const d = layout === 'desktop' ? service.path : service.mobilePath;
              return <g key={service.id} className={`ecosystem-wire ${active === service.id ? 'is-active' : ''}`}>
                <path d={d} pathLength="100" className="ecosystem-wire__draw ecosystem-wire__base" />
                <path d={d} pathLength="100" className="ecosystem-wire__draw ecosystem-wire__glow" filter={`url(#${filterId}-${layout})`} />
                <path d={d} pathLength="100" className="ecosystem-wire__draw ecosystem-wire__core" />
                <path d={d} pathLength="100" className="ecosystem-wire__pulse" data-connection={service.id} />
              </g>;
            })}
          </svg>
        ))}
        <div className="ecosystem-hub">
          <div className="ecosystem-hub__entrance"><div className="ecosystem-hub__float">
            <Illustration name="center-hub" alt={t.ecosystem.hubAlt} hub />
          </div>
            <span className="ecosystem-hub__label" dir={lang === 'ar' ? 'rtl' : 'ltr'}>{t.ecosystem.hubLabel}</span>
          </div>
        </div>
        {ecosystemServices.map((node) => {
          const service = services.find((entry) => entry.id === node.id)!;
          const style = { '--desktop-x': `${node.desktop[0] / 720 * 100}%`, '--desktop-y': `${node.desktop[1] / 650 * 100}%`,
            '--mobile-x': `${node.mobile[0] / 600 * 100}%`, '--mobile-y': `${node.mobile[1] / 1240 * 100}%` } as CSSProperties;
          return (
            <div key={node.id} className={`ecosystem-node ${active && active !== node.id ? 'is-muted' : ''}`} style={style} data-service={node.id}>
              <div className="ecosystem-node__entrance"><div className="ecosystem-node__float">
                <button type="button" className="ecosystem-node__button" dir={lang === 'ar' ? 'rtl' : 'ltr'}
                  aria-pressed={selectedId === node.id} aria-controls="ecosystem-service-details"
                  onClick={() => onSelect(node.id)}
                  onPointerEnter={(event) => { if (event.pointerType === 'mouse') setHovered(node.id); }}
                  onPointerLeave={() => setHovered(null)}
                  onFocus={(event) => { if (event.currentTarget.matches(':focus-visible')) setFocused(node.id); }}
                  onBlur={() => setFocused(null)}>
                  <span className="ecosystem-node__art">
                    {node.image ? <Illustration name={node.image} alt={service.title} /> : (
                      <span className="ecosystem-web" aria-hidden="true">
                        <span className="ecosystem-web__window"><span className="ecosystem-web__chrome"><i /><i /><i /></span>
                          <Globe2 className="ecosystem-web__globe" strokeWidth={1} /><Code2 className="ecosystem-web__code" />
                          <span className="ecosystem-web__lines" />
                        </span><span className="ecosystem-web__base" />
                      </span>
                    )}
                  </span>
                  <span className="ecosystem-node__label">{service.title}<span aria-hidden="true">↗</span></span>
                </button>
              </div></div>
            </div>
          );
        })}
      </div>
      <p className="ecosystem-hint">{t.ecosystem.hint}</p>
    </div>
  );
}
