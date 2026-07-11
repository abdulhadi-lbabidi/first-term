import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'destructive' | 'success';
}

export default function Badge({ className = '', variant = 'default', ...props }: BadgeProps) {
  const baseStyles = 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 select-none';
  
  const variants = {
    default: 'border-transparent bg-primary text-white hover:bg-primary-hover shadow-sm',
    secondary: 'border-transparent bg-canvas dark:bg-body/20 text-ink dark:text-canvas hover:bg-border/50 dark:hover:bg-body/30',
    outline: 'border-border dark:border-border-strong/20 text-muted/80',
    destructive: 'border-transparent bg-error text-white hover:bg-error/95',
    success: 'border-transparent bg-success text-white',
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`} {...props} />
  );
}
