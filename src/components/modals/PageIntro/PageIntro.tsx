interface PageIntroProps {
  isLeaving: boolean
}

const particles = [
  { top: '18%', left: '12%', size: 4, delay: '0s' },
  { top: '72%', left: '22%', size: 3, delay: '0.4s' },
  { top: '28%', left: '78%', size: 5, delay: '0.8s' },
  { top: '65%', left: '85%', size: 3, delay: '1.1s' },
  { top: '42%', left: '8%', size: 2, delay: '1.4s' },
  { top: '55%', left: '92%', size: 4, delay: '0.6s' },
  { top: '82%', left: '48%', size: 2, delay: '1.2s' },
  { top: '14%', left: '55%', size: 3, delay: '0.2s' },
]

export default function PageIntro({ isLeaving }: PageIntroProps) {
  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#07000d] via-[#25003f] to-[#4b0078] transition-all ease-out ${
        isLeaving
          ? 'pointer-events-none -translate-y-3 opacity-0 duration-500'
          : 'translate-y-0 opacity-100 duration-300'
      }`}
      aria-hidden="true"
    >
      <div
        className="pointer-events-none absolute -start-24 top-16 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl animate-glow-drift"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -end-20 bottom-12 h-96 w-96 rounded-full bg-purple-600/25 blur-3xl animate-glow-drift-reverse [animation-delay:1.5s]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute start-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-purple-400/15 blur-3xl"
        aria-hidden="true"
      />

      <span
        className="pointer-events-none absolute inset-0 flex items-center justify-center select-none text-[clamp(120px,28vw,320px)] font-black uppercase tracking-[0.2em] text-white/[0.035]"
        aria-hidden="true"
      >
        TREND
      </span>

      {particles.map((particle, index) => (
        <span
          key={index}
          className="pointer-events-none absolute rounded-full bg-fuchsia-300/40 animate-intro-particle"
          style={{
            top: particle.top,
            left: particle.left,
            width: particle.size,
            height: particle.size,
            animationDelay: particle.delay,
          }}
          aria-hidden="true"
        />
      ))}

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <div
          className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-2xl font-black text-white shadow-[0_8px_32px_rgba(168,85,247,0.35)] backdrop-blur-sm animate-intro-logo-in sm:h-16 sm:w-16 sm:text-3xl"
          aria-hidden="true"
        >
          T
        </div>

        <div className="relative overflow-hidden">
          <h1 className="text-[clamp(36px,8vw,52px)] font-extrabold tracking-tight text-white animate-intro-fade-up [animation-delay:200ms]">
            Trend
          </h1>
          <div
            className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-12deg] bg-gradient-to-r from-transparent via-white/30 to-transparent animate-intro-shine"
            aria-hidden="true"
          />
        </div>

        <p className="mt-3 text-[clamp(15px,3.5vw,18px)] font-medium tracking-wide text-purple-100/90 animate-intro-fade-up [animation-delay:450ms]">
          إطلالتك تبدأ من هنا
        </p>

        <div
          className="mt-8 h-px w-48 origin-center overflow-hidden rounded-full bg-white/10 sm:w-56"
          aria-hidden="true"
        >
          <div className="h-full w-full origin-center bg-gradient-to-r from-purple-500 via-fuchsia-400 to-purple-500 animate-intro-line-expand" />
        </div>
      </div>
    </div>
  )
}
