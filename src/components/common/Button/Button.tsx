import type { ButtonHTMLAttributes } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline-light'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  href?: string
}

const baseClasses =
  'inline-flex items-center justify-center gap-2 font-semibold rounded-xl whitespace-nowrap transition-all active:scale-[0.97]'

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-[18px] py-2 text-sm',
  md: 'px-7 py-2.5 text-[15px]',
  lg: 'px-8 py-2.5 text-[15px]',
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'text-white bg-gradient-to-r from-violet-600 via-purple-600 to-purple-500 shadow-md hover:shadow-lg hover:-translate-y-0.5',
  secondary:
    'text-purple-700 bg-white border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50 hover:-translate-y-0.5',
  ghost: 'text-zinc-800 bg-transparent hover:text-purple-700',
  'outline-light':
    'text-white bg-transparent border-2 border-white/35 hover:bg-white/10 hover:border-white/60 hover:-translate-y-0.5',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  href,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const classes =
    `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`.trim()

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    )
  }

  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  )
}
