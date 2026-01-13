import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 font-mono';
    
    const variants = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 border border-blue-500 focus-visible:ring-blue-500',
      secondary: 'bg-white/10 text-white border border-white/20 hover:bg-white/20 focus-visible:ring-white/50',
      outline: 'border border-white/20 bg-transparent text-white hover:border-blue-500 hover:bg-blue-500/10 focus-visible:ring-blue-500',
      ghost: 'text-white hover:bg-white/10 focus-visible:ring-white/50',
      danger: 'bg-red-600 text-white hover:bg-red-700 border border-red-500 focus-visible:ring-red-500',
    };

    const sizes = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-base',
      lg: 'h-12 px-6 text-lg',
    };

    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export default Button;

