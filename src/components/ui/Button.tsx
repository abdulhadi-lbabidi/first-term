import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', isLoading, fullWidth, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';
    
    const variants = {
      primary: 'bg-primary hover:bg-primary-hover text-white shadow-sm',
      secondary: 'bg-canvas dark:bg-body/20 hover:bg-border/50 dark:hover:bg-body/40 text-ink dark:text-canvas border border-border/40 dark:border-border-strong/10',
      outline: 'bg-transparent border border-border dark:border-border-strong/30 text-ink dark:text-canvas hover:bg-canvas dark:hover:bg-ink/50',
      ghost: 'bg-transparent text-ink dark:text-canvas hover:bg-canvas dark:hover:bg-ink/50 shadow-none',
      danger: 'bg-error hover:bg-error/95 text-white',
    };

    const sizes = {
      sm: 'px-4 py-2 text-[12px]',
      md: 'px-6 py-2.5 text-[14px]',
      lg: 'px-8 py-3.5 text-[16px]',
    };

    const widthStyle = fullWidth ? 'w-full' : '';

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className}`}
        {...props}
      >
        {isLoading ? (
          <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2 rtl:ml-2" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
