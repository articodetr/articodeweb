import { useEffect, useRef, useState, useSyncExternalStore, type PointerEvent } from 'react';
import { motion, useInView, useSpring } from 'framer-motion';
import { Braces, ChartNoAxesCombined, Cpu, Globe2, Pause, Play } from 'lucide-react';
import { useLang } from '@/i18n';
import { publicAsset } from '@/lib/publicAsset';
import './HeroVisual.css';

const labels = {
  en: {
    web: 'Web experiences',
    ai: 'Artificial intelligence',
    code: 'Built with precision',
    data: 'Connected systems',
    studio: 'DESIGN · CODE · INTELLIGENCE',
    pause: 'Pause animation',
    play: 'Play animation',
  },
  ar: {
    web: 'تجارب الويب',
    ai: 'الذكاء الاصطناعي',
    code: 'برمجة بإتقان',
    data: 'أنظمة مترابطة',
    studio: 'تصميم · برمجة · ذكاء اصطناعي',
    pause: 'إيقاف الحركة',
    play: 'تشغيل الحركة',
  },
};

const networkNodes = [
  [25, 31], [53, 17], [83, 25], [113, 14], [140, 35], [151, 66],
  [132, 94], [103, 109], [72, 99], [41, 107], [19, 83], [13, 58],
] as const;

const reducedMotionQuery = '(prefers-reduced-motion: reduce)';
const getReducedMotion = () => window.matchMedia(reducedMotionQuery).matches;
const getServerReducedMotion = () => true;

function subscribeToReducedMotion(onChange: () => void) {
  const preference = window.matchMedia(reducedMotionQuery);
  preference.addEventListener('change', onChange);
  return () => preference.removeEventListener('change', onChange);
}

function IntelligenceNetwork() {
  return (
    <svg className="hero-network" viewBox="0 0 170 125" fill="none">
      <path className="hero-network-orbit" d="M25 31 53 17 83 25 113 14 140 35 151 66 132 94 103 109 72 99 41 107 19 83 13 58Z" />
      <path className="hero-network-links" d="m25 31 45 25 13-31 19 32 38-22-18 36 29-5-29 5 10 23-32-13 3 28-21-29-10 19-7-24-24 32 3-39-25 15 25-15-31-10 31 10-19-37 19 37 26-12 12 24 20-23-2 24 22-10-20-14 11-43M53 17l17 39M70 56l32 1M65 75l17 5M44 68l21 7" />
      {networkNodes.map(([cx, cy], index) => (
        <g key={index} className="hero-network-node" style={{ animationDelay: `${index * -0.32}s` }}>
          <circle cx={cx} cy={cy} r="5.5" fill="#50dfff" fillOpacity=".13" />
          <circle cx={cx} cy={cy} r="2" fill="#aaf4ff" />
        </g>
      ))}
      <rect x="65" y="44" width="41" height="39" rx="10" fill="#075384" stroke="#91eaff" strokeWidth="1.3" />
      <path d="m76 58-5 5 5 5m19-10 5 5-5 5m-7-13-5 16" stroke="#e5fcff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M76 40v-5m10 5v-5m10 5v-5M76 92v-5m10 5v-5m10 5v-5M61 54h-5m5 10h-5m5 10h-5m59-20h-5m5 10h-5m5 10h-5" stroke="#5fe4ff" strokeLinecap="round" />
    </svg>
  );
}

export function HeroVisual() {
  const { lang } = useLang();
  const copy = labels[lang];
  const sceneRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sceneRef, { amount: 0.15 });
  const reducedMotion = useSyncExternalStore(subscribeToReducedMotion, getReducedMotion, getServerReducedMotion);
  const [paused, setPaused] = useState(false);
  const running = inView && !paused && !reducedMotion;
  const rotateX = useSpring(0, { stiffness: 95, damping: 24 });
  const rotateY = useSpring(0, { stiffness: 95, damping: 24 });

  useEffect(() => {
    if (!running) {
      rotateX.jump(0);
      rotateY.jump(0);
    }
  }, [running, rotateX, rotateY]);

  const followPointer = (event: PointerEvent<HTMLDivElement>) => {
    if (!running || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    rotateX.set((0.5 - (event.clientY - bounds.top) / bounds.height) * 6);
    rotateY.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 7);
  };

  const resetPointer = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <div ref={sceneRef} className="hero-visual" data-running={running}>
      <div
        className="hero-visual-stage"
        aria-hidden="true"
        dir="ltr"
        onPointerMove={followPointer}
        onPointerLeave={resetPointer}
      >
        <div className="hero-visual-aura" />
        <motion.div className="hero-visual-scene" style={{ rotateX, rotateY }}>
          <div className="hero-visual-orbit hero-visual-orbit-back" />
          <img
            className="hero-visual-core"
            src={publicAsset('hero/technology-core.webp')}
            alt=""
            width={1024}
            height={1024}
            fetchPriority="high"
            draggable={false}
          />

          <div className="hero-panel-float hero-panel-web">
            <div className="hero-panel hero-panel-light">
              <div className="hero-panel-title" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                <Globe2 /><span>{copy.web}</span><i />
              </div>
              <div className="hero-mini-browser">
                <div className="hero-mini-browser-chrome"><i /><i /><i /><span>articode.studio</span></div>
                <div className="hero-mini-browser-page">
                  <div className="hero-mini-nav"><span /><i /><i /><i /></div>
                  <div className="hero-mini-content">
                    <div className="hero-mini-copy"><b /><b /><span /><span /><i /></div>
                    <div className="hero-mini-object"><div /><div /><div /></div>
                  </div>
                  <div className="hero-mini-tiles"><i /><i /><i /></div>
                </div>
              </div>
              <div className="hero-panel-footer"><span>REACT</span><i /><span>NEXT.JS</span><i /><span>UI / UX</span></div>
            </div>
          </div>

          <div className="hero-panel-float hero-panel-ai">
            <div className="hero-panel hero-panel-light">
              <div className="hero-panel-title" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                <Cpu /><span>{copy.ai}</span><i />
              </div>
              <div className="hero-ai-screen"><IntelligenceNetwork /></div>
              <div className="hero-panel-footer"><span>AI</span><i /><span>AUTOMATION</span><i /><span>API</span></div>
            </div>
          </div>

          <div className="hero-panel-float hero-panel-code">
            <div className="hero-panel hero-panel-dark">
              <div className="hero-panel-title" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                <Braces /><span>{copy.code}</span><i />
              </div>
              <div className="hero-code-tab"><span /><span>experience.tsx</span></div>
              <div className="hero-code-editor">
                <div><em>01</em><span><b>const</b> experience = {'{'}</span></div>
                <div><em>02</em><span>  design: <i>'thoughtful'</i>,</span></div>
                <div><em>03</em><span>  code: <i>'crafted'</i>,</span></div>
                <div><em>04</em><span>  possibilities: <b>∞</b></span></div>
                <div><em>05</em><span>{'}'};<i className="hero-code-caret" /></span></div>
              </div>
              <div className="hero-code-status"><i /><span>TypeScript</span><span>{'</>'}</span></div>
            </div>
          </div>

          <div className="hero-panel-float hero-panel-data">
            <div className="hero-panel hero-panel-dark">
              <div className="hero-panel-title" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                <ChartNoAxesCombined /><span>{copy.data}</span><i />
              </div>
              <div className="hero-data-chart">
                <svg viewBox="0 0 200 80" fill="none">
                  <path d="M0 18h200M0 40h200M0 62h200M25 0v80M75 0v80M125 0v80M175 0v80" stroke="#72c6ff" strokeOpacity=".13" strokeWidth=".7" />
                  <path d="m0 62 15-8 14 4 17-21 13 11 16-18 15 8 15-16 15 10 15-23 14 10 15-9 16 2 20-15v88H0Z" fill="#20baff" fillOpacity=".1" />
                  <path className="hero-data-trace" d="m0 62 15-8 14 4 17-21 13 11 16-18 15 8 15-16 15 10 15-23 14 10 15-9 16 2 20-15" stroke="#64efff" strokeWidth="2" strokeLinejoin="round" />
                  <path className="hero-data-signal" d="m0 62 15-8 14 4 17-21 13 11 16-18 15 8 15-16 15 10 15-23 14 10 15-9 16 2 20-15" pathLength="100" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
                </svg>
              </div>
              <div className="hero-data-bottom">
                <div className="hero-data-legend"><i /><span>WEB + AI</span></div>
                <div className="hero-data-bars"><i /><i /><i /><i /><i /><i /><i /><i /></div>
              </div>
            </div>
          </div>

          <div className="hero-visual-spark hero-visual-spark-one" />
          <div className="hero-visual-spark hero-visual-spark-two" />
          <div className="hero-visual-spark hero-visual-spark-three" />
          <div className="hero-visual-signature" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <span />{copy.studio}
          </div>
        </motion.div>
      </div>
      {!reducedMotion && (
        <button
          type="button"
          className="hero-visual-toggle"
          onClick={() => setPaused((value) => !value)}
          aria-label={paused ? copy.play : copy.pause}
          title={paused ? copy.play : copy.pause}
        >
          {paused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
        </button>
      )}
    </div>
  );
}
