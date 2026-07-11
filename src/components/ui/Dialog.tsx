import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
        onClick={onClose}
      />

      {/* Content */}
      <div className="bg-white dark:bg-ink border border-border dark:border-border-strong/20 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative z-10 animate-scale-up text-left rtl:text-right">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/40 dark:border-border-strong/10">
          {title ? (
            <h3 className="font-serif-display text-xl font-semibold text-ink dark:text-canvas">
              {title}
            </h3>
          ) : (
            <div />
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-full text-muted hover:text-ink dark:hover:text-canvas hover:bg-canvas/50 dark:hover:bg-body/20 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="text-[14px] text-body dark:text-canvas/90">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Dialog;
