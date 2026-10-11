import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'online' | 'offline' | 'blue' | 'purple' | 'orange' | 'gray' | 'warning';
  dot?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'gray',
  dot = false,
  size = 'md',
  className = '',
}) => {
  const styles = {
    online: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    offline: 'bg-rose-50 text-rose-700 border-rose-200/60',
    blue: 'bg-blue-50 text-blue-700 border-blue-200/60',
    purple: 'bg-purple-50 text-purple-700 border-purple-200/60',
    orange: 'bg-amber-50 text-amber-700 border-amber-200/60',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200/60',
    gray: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const dotColors = {
    online: 'bg-emerald-500',
    offline: 'bg-rose-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    orange: 'bg-amber-500',
    warning: 'bg-yellow-500',
    gray: 'bg-slate-400',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-medium',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${styles[variant]} ${sizes[size]} ${className}`}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />
      )}
      {children}
    </span>
  );
};
