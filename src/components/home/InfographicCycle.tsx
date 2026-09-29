import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Compass, Code2, ShieldCheck, Sparkles, Play, Pause } from 'lucide-react';
import { SectionHeading } from '@/components/SectionHeading';
import { useLang } from '@/i18n';

const STEP_ICONS = [Compass, Code2, ShieldCheck, Sparkles];

/*
  SVG Canvas: 500 × 500
  Center: (250, 250)

  The infographic is a "square ring" with 4 colored bands:
  - Outer octagon boundary with rounded outer corners
  - Inner square hole at center

  Geometry:
  ─────────────────────────────
  Inner hole:  x: 165–335, y: 165–335  (170×170 square)
  Outer bound: x: 55–445, y: 55–445   (390×390 square)
  Corner arc radius (outer): 60

  The 4 bands (TOP, RIGHT, BOTTOM, LEFT) each fill one side:

  TOP band path (unrotated):
  ┌────────────────────────┐
  │ rounded left corner    │  outer top boundary
  │   (55, 115) arc →      │
  │   (115, 55)            │
  └────────────────────────┘
  Connecting down to inner hole top edge (y=165).

  Exact path for TOP (rotation=0):
    M 165 165              ← inner top-left corner
    L 55 165               ← go left to outer left boundary
    L 55 115               ← go up along outer left side
    A 60 60 0 0 1 115 55   ← outer top-left rounded corner
    L 385 55               ← outer top edge
    A 60 60 0 0 1 445 115  ← outer top-right rounded corner
    L 445 165              ← go down to inner right
    L 335 165              ← inner top-right corner
    Z                      ← close (straight line across inner top)

  This creates the correct ribbon shape matching the reference image.
  ─────────────────────────────

  Interlocking weave:
  TOP(0) overlaps RIGHT(1) at TOP-RIGHT zone [335,55]→[445,165]
  BOTTOM(2) overlaps LEFT(3) at BOTTOM-LEFT zone [55,335]→[165,445]
  (alternating pattern from reference image)

  Z-order (back to front):
  1. RIGHT(1) — base
  2. LEFT(3) — base
  3. BOTTOM(2) — base
  4. TOP(0) — base
  5. TOP(0) redrawn in clip-tr zone (over RIGHT)
  6. BOTTOM(2) redrawn in clip-bl zone (over LEFT)
*/

const SEGS = [
  { idx: 0, gradId: 'g0', start: '#e05535', stop: '#f4834b', accent: '#ff9966', label: 'TOP' },
  { idx: 1, gradId: 'g1', start: '#3b5768', stop: '#5a7d92', accent: '#7daabb', label: 'RIGHT' },
  { idx: 2, gradId: 'g2', start: '#c03848', stop: '#e8526a', accent: '#f47a90', label: 'BOTTOM' },
  { idx: 3, gradId: 'g3', start: '#2a3d47', stop: '#415e6e', accent: '#6490a2', label: 'LEFT' },
];

// Band path for TOP (rotation=0). All others derive from rotate(N*90 250 250)
const BAND = 'M 165 165 L 55 165 L 55 115 A 60 60 0 0 1 115 55 L 385 55 A 60 60 0 0 1 445 115 L 445 165 L 335 165 Z';

// Clip rect for TOP-RIGHT corner overlap zone
// (where TOP arm covers RIGHT arm)
const CLIP_TR = { x: 335, y: 55, w: 110, h: 110 };
// Clip rect for BOTTOM-LEFT corner overlap zone
// (where BOTTOM arm covers LEFT arm)
const CLIP_BL = { x: 55, y: 335, w: 110, h: 110 };

export function InfographicCycle() {
  const { lang, t } = useLang();
  const [active, setActive] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const isHovered = useRef(false);
  const reduced = !!useReducedMotion();

  const steps = t.cycle.steps;
  const CurrentIcon = STEP_ICONS[active] ?? Compass;

  useEffect(() => {
    if (!isPlaying || reduced) return;
    const id = setInterval(() => {
      if (!isHovered.current) setActive((p) => (p + 1) % 4);
    }, 4000);
    return () => clearInterval(id);
  }, [isPlaying, reduced]);

  // Rotation angles for each segment index
  const ROTATIONS = [0, 90, 180, 270];
  // Z-order rendering (back to front): right, left, bottom, top
  const Z_ORDER = [1, 3, 2, 0];

  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 50% 50%, rgba(224,85,53,0.04) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="container-x">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <SectionHeading
            eyebrow={t.cycle.eyebrow}
            title={t.cycle.title}
            description={t.cycle.description}
            align="center"
          />
        </div>

        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-10">
          {/* ── SVG Infographic ── */}
          <div
            className="flex flex-col items-center justify-center lg:col-span-6"
            onPointerEnter={() => { isHovered.current = true; }}
            onPointerLeave={() => { isHovered.current = false; }}
          >
            <div className="relative w-full max-w-[440px] aspect-square">
              <svg
                viewBox="0 0 500 500"
                className="w-full h-full select-none"
                style={{ overflow: 'visible' }}
                aria-label="دورة العمل الرباعية / 4-step process cycle"
              >
                <defs>
                  {SEGS.map((s) => (
                    <linearGradient key={s.gradId} id={s.gradId} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={s.start} />
                      <stop offset="100%" stopColor={s.stop} />
                    </linearGradient>
                  ))}

                  {/* Global drop shadow for depth */}
                  <filter id="band-shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="rgba(0,0,0,0.18)" />
                  </filter>

                  {/* Active glow */}
                  <filter id="active-glow" x="-10%" y="-10%" width="120%" height="120%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>

                  {/* Center card shadow */}
                  <filter id="center-shadow" x="-5%" y="-5%" width="110%" height="110%">
                    <feDropShadow dx="0" dy="2" stdDeviation="5" floodColor="rgba(0,0,0,0.08)" />
                  </filter>

                  {/* Clip paths for interlocking weave */}
                  <clipPath id="clip-tr">
                    <rect x={CLIP_TR.x} y={CLIP_TR.y} width={CLIP_TR.w} height={CLIP_TR.h} />
                  </clipPath>
                  <clipPath id="clip-bl">
                    <rect x={CLIP_BL.x} y={CLIP_BL.y} width={CLIP_BL.w} height={CLIP_BL.h} />
                  </clipPath>
                </defs>

                {/* ── LAYER 1: Bands in z-order (back to front) ── */}
                <g filter="url(#band-shadow)">
                  {Z_ORDER.map((idx) => {
                    const seg = SEGS[idx];
                    const isActive = active === idx;
                    return (
                      <g key={seg.gradId} transform={`rotate(${ROTATIONS[idx]} 250 250)`}>
                        <path
                          d={BAND}
                          fill={`url(#${seg.gradId})`}
                          opacity={isActive ? 1 : 0.9}
                          filter={isActive ? 'url(#active-glow)' : undefined}
                          style={{ cursor: 'pointer', transition: 'opacity 0.35s' }}
                          onClick={() => setActive(idx)}
                        />
                        {/* Glossy inner highlight on outer curved edge */}
                        <path
                          d="M 57 113 A 58 58 0 0 1 113 57 L 387 57 A 58 58 0 0 1 443 113"
                          fill="none"
                          stroke="rgba(255,255,255,0.3)"
                          strokeWidth="2.5"
                          pointerEvents="none"
                        />
                        {/* Seam shadow at inner edge */}
                        <path
                          d="M 165 165 L 335 165"
                          stroke="rgba(0,0,0,0.15)"
                          strokeWidth="3"
                          fill="none"
                          pointerEvents="none"
                        />
                      </g>
                    );
                  })}
                </g>

                {/* ── LAYER 2: Interlocking overlap corners ── */}
                {/* TOP arm re-drawn ON TOP of RIGHT arm at top-right corner */}
                <g clipPath="url(#clip-tr)">
                  <g transform="rotate(0 250 250)">
                    <path d={BAND} fill={`url(#${SEGS[0].gradId})`} opacity={active === 0 ? 1 : 0.9} />
                    {/* seam line at right overlap edge */}
                    <line x1="335" y1="55" x2="335" y2="165" stroke="rgba(0,0,0,0.2)" strokeWidth="3" />
                  </g>
                </g>

                {/* BOTTOM arm re-drawn ON TOP of LEFT arm at bottom-left corner */}
                <g clipPath="url(#clip-bl)">
                  <g transform="rotate(180 250 250)">
                    <path d={BAND} fill={`url(#${SEGS[2].gradId})`} opacity={active === 2 ? 1 : 0.9} />
                    {/* seam line at left overlap edge */}
                    <line x1="165" y1="335" x2="165" y2="445" stroke="rgba(0,0,0,0.2)" strokeWidth="3" />
                  </g>
                </g>

                {/* ── LAYER 3: Step labels – placed at absolute pre-computed positions ── */}
                {/*
                  Band visual centers for each direction (500×500 canvas):
                  TOP    (idx=0): num≈(195, 98),  tag≈(195,126), icon≈(313,110)
                  RIGHT  (idx=1): num≈(403, 195),  tag≈(375,195), icon≈(390,313)
                  BOTTOM (idx=2): num≈(306, 403),  tag≈(306,375), icon≈(188,390)
                  LEFT   (idx=3): num≈(98, 306),   tag≈(126,306), icon≈(110,188)
                */}
                {([
                  // [idx, numX, numY, tagX, tagY, icX, icY]
                  [0, 195, 98,  195, 126, 313, 110],
                  [1, 403, 195, 375, 195, 390, 313],
                  [2, 306, 403, 306, 375, 188, 390],
                  [3, 98,  306, 126, 306, 110, 188],
                ] as Array<[number,number,number,number,number,number,number]>).map(
                  ([idx, numX, numY, tagX, tagY, icX, icY]) => {
                    const Icon = STEP_ICONS[idx] ?? Compass;
                    const isActive = active === idx;
                    const step = steps[idx];
                    if (!step) return null;
                    return (
                      <g key={`label-${idx}`} onClick={() => setActive(idx)} style={{ cursor: 'pointer' }}>
                        {/* Step number */}
                        <text
                          x={numX}
                          y={numY}
                          fill="#ffffff"
                          fontSize="28"
                          fontWeight="900"
                          fontFamily="system-ui, -apple-system, sans-serif"
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          {step.num}
                        </text>
                        {/* Tag */}
                        <text
                          x={tagX}
                          y={tagY}
                          fill="rgba(255,255,255,0.78)"
                          fontSize="9"
                          fontWeight="700"
                          fontFamily="system-ui, -apple-system, sans-serif"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          letterSpacing="1.5"
                        >
                          {step.tag.toUpperCase()}
                        </text>
                        {/* Icon circle */}
                        <circle
                          cx={icX}
                          cy={icY}
                          r="24"
                          fill="rgba(0,0,0,0.22)"
                          stroke={isActive ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.28)'}
                          strokeWidth={isActive ? 2 : 1}
                        />
                        <foreignObject x={icX - 14} y={icY - 14} width="28" height="28" pointerEvents="none">
                          <div
                            style={{
                              width: '100%',
                              height: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Icon style={{ width: 15, height: 15, color: 'white', strokeWidth: 2.5 }} />
                          </div>
                        </foreignObject>
                      </g>
                    );
                  }
                )}


                {/* ── LAYER 4: Center white card ── */}
                <g filter="url(#center-shadow)">
                  <rect x="167" y="167" width="166" height="166" rx="12" fill="white" />
                </g>

                {/* Center animated content */}
                <foreignObject x="168" y="168" width="164" height="164">
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '8px',
                      textAlign: 'center',
                    }}
                    dir={lang === 'ar' ? 'rtl' : 'ltr'}
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={active}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.22 }}
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
                      >
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 10,
                            background: `linear-gradient(135deg, ${SEGS[active].start}, ${SEGS[active].stop})`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                          }}
                        >
                          <CurrentIcon style={{ width: 18, height: 18 }} />
                        </div>
                        <span
                          style={{
                            fontFamily: 'monospace',
                            fontSize: 11,
                            fontWeight: 900,
                            letterSpacing: '0.12em',
                            color: SEGS[active].start,
                          }}
                        >
                          {steps[active]?.num}
                        </span>
                        <p
                          style={{
                            fontSize: 9.5,
                            fontWeight: 700,
                            color: '#374151',
                            lineHeight: 1.35,
                            maxWidth: 120,
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                          }}
                        >
                          {steps[active]?.title}
                        </p>
                        <span
                          style={{
                            fontWeight: 900,
                            fontSize: 14,
                            color: SEGS[active].start,
                          }}
                        >
                          {steps[active]?.stat}
                        </span>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </foreignObject>
              </svg>
            </div>

            {/* Play/pause + dots */}
            <div className="mt-5 flex items-center gap-4">
              <button
                type="button"
                onClick={() => setIsPlaying((p) => !p)}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm backdrop-blur-sm transition hover:border-orange-400 hover:text-orange-700"
                aria-pressed={isPlaying}
              >
                {isPlaying ? (
                  <><Pause className="h-3.5 w-3.5" /><span>{t.cycle.autoCycle}</span></>
                ) : (
                  <><Play className="h-3.5 w-3.5" /><span>{t.cycle.autoCycle}</span></>
                )}
              </button>
              <div className="flex items-center gap-1.5">
                {SEGS.map((s, i) => (
                  <button
                    key={s.gradId}
                    type="button"
                    onClick={() => setActive(i)}
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: active === i ? 28 : 10,
                      height: 10,
                      backgroundColor: active === i ? s.start : '#cbd5e1',
                    }}
                    aria-label={steps[i]?.title}
                    aria-current={active === i ? 'true' : undefined}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ── Details cards panel ── */}
          <div className="space-y-3 lg:col-span-6">
            {steps.map((step, idx) => {
              const isCurrent = active === idx;
              const Icon = STEP_ICONS[idx] ?? Compass;
              const seg = SEGS[idx];

              return (
                <div
                  key={step.num}
                  onClick={() => setActive(idx)}
                  className={`group relative cursor-pointer overflow-hidden rounded-2xl border p-5 transition-all duration-300 ${
                    isCurrent
                      ? 'border-slate-300/60 bg-white shadow-lg -translate-y-px'
                      : 'border-slate-100 bg-white/60 hover:bg-white/90 hover:border-slate-200'
                  }`}
                >
                  {/* Active color bar */}
                  {isCurrent && (
                    <motion.div
                      layoutId="active-bar"
                      className="absolute inset-y-0 start-0 w-1"
                      style={{ background: `linear-gradient(to bottom, ${seg.start}, ${seg.stop})` }}
                    />
                  )}

                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-sm transition-transform duration-300 group-hover:scale-105"
                        style={{ background: `linear-gradient(135deg, ${seg.start}, ${seg.stop})` }}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            dir="ltr"
                            className="font-mono text-xs font-black tracking-widest"
                            style={{ color: seg.start }}
                          >
                            {step.num}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            {step.tag}
                          </span>
                        </div>
                        <h4 className="font-display text-sm font-bold text-slate-900 sm:text-base">
                          {step.title}
                        </h4>
                      </div>
                    </div>
                    <span
                      dir="ltr"
                      className="shrink-0 font-display text-base font-black text-slate-800"
                    >
                      {step.stat}
                    </span>
                  </div>

                  <p className="mt-2 text-xs leading-relaxed text-slate-500 sm:text-sm">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
