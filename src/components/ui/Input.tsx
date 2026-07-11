import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, icon, type = 'text', ...props }, ref) => {
    return (
      <div className="space-y-1.5 w-full text-left rtl:text-right">
        {label && (
          <label className="text-[13px] font-semibold text-ink/80 dark:text-canvas/80 uppercase tracking-wide block">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            type={type}
            className={`w-full h-12 pl-10 pr-4 rtl:pl-4 rtl:pr-10 bg-canvas/30 dark:bg-body/10 border border-border dark:border-border-strong/20 focus:border-primary rounded-xl text-[14px] outline-none transition-all duration-300 ${
              error ? 'border-error focus:border-error' : 'focus:border-primary'
            } ${icon ? '' : 'pl-4 pr-4 rtl:pl-4 rtl:pr-4'} ${className}`}
            {...props}
          />
          {icon && (
            <div className="absolute left-3.5 rtl:right-3.5 rtl:left-auto top-1/2 -translate-y-1/2 text-muted">
              {icon}
            </div>
          )}
        </div>
        {error && (
          <span className="text-[12px] text-error font-medium block mt-1">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
