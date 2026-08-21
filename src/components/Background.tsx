export function BackgroundGrid({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 bg-grid-faint bg-grid-md animate-grid-pulse [mask-image:radial-gradient(ellipse_70%_60%_at_50%_30%,black,transparent)]" />
    </div>
  );
}

export function Orbs({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <div className="absolute -start-20 top-10 h-72 w-72 rounded-full bg-accent-500/15 blur-3xl animate-float-slow" />
      <div className="absolute end-0 top-1/3 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl animate-float" />
      <div className="absolute bottom-0 start-1/3 h-64 w-64 rounded-full bg-accent-400/12 blur-3xl animate-float-slow" />
    </div>
  );
}
