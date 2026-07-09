interface SectionHeaderProps {
  title: string
  subtitle?: string
  align?: 'center' | 'start'
  light?: boolean
  aos?: string
  aosDelay?: number
}

export default function SectionHeader({
  title,
  subtitle,
  align = 'center',
  light = false,
  aos,
  aosDelay,
}: SectionHeaderProps) {
  return (
    <div
      data-aos={aos}
      data-aos-delay={aosDelay}
      className={`mb-12 max-md:mb-8 ${align === 'center' ? 'text-center' : 'text-start'}`}
    >
      <h2
        className={`mb-3 text-[clamp(28px,4vw,40px)] font-bold tracking-tight ${
          light ? 'text-white' : 'text-[#1e1033]'
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`max-w-[560px] text-[17px] ${
            light ? 'text-purple-200' : 'text-[#5b4d6d]'
          } ${align === 'center' ? 'mx-auto' : ''}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}
