import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

interface InputProps extends React.ComponentProps<"input"> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

function Input({ className, type, label, error, icon, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-ink dark:text-canvas">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none rtl:left-auto rtl:right-3">
            {icon}
          </span>
        )}
        <InputPrimitive
          type={type}
          data-slot="input"
          aria-invalid={!!error}
          className={cn(
            "h-10 w-full min-w-0 rounded-xl border border-input bg-transparent py-2 text-base transition-colors outline-none",
            "file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
            "placeholder:text-muted-foreground",
            "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
            "disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50",
            "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
            "dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
            icon ? "pl-9 pr-3 rtl:pl-3 rtl:pr-9" : "px-3",
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="text-[12px] text-destructive font-medium">{error}</p>
      )}
    </div>
  )
}

export { Input }
export type { InputProps }
