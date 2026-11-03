import React, { useState } from 'react';
import { ShieldCheck, Award, Sparkles } from 'lucide-react';

interface AuthorVerifiedBadgeProps {
  authorName?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  interactive?: boolean;
  tier?: 'verified_author' | 'editorial_board' | 'fellow';
  className?: string;
}

export const AuthorVerifiedBadge: React.FC<AuthorVerifiedBadgeProps> = ({
  authorName,
  size = 'sm',
  showLabel = true,
  interactive = true,
  tier = 'verified_author',
  className = '',
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const textSizes = {
    xs: 'text-[9px]',
    sm: 'text-[10px]',
    md: 'text-xs',
    lg: 'text-sm',
  };

  const badgeConfig = {
    verified_author: {
      label: 'Verified Author',
      icon: ShieldCheck,
      badgeClass:
        'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 dark:border-amber-400/40 hover:border-amber-500 shadow-xs',
      title: 'The Patriot Verified Author',
      description:
        'Official contributing scholar/author authorized and credential-verified by Master Administrator Wahab Ali Khiva.',
    },
    editorial_board: {
      label: 'Editorial Board',
      icon: Award,
      badgeClass:
        'bg-slate-900/10 text-slate-800 dark:text-amber-300 border border-amber-600/40 hover:border-amber-400 shadow-xs',
      title: 'Editorial Board Fellow',
      description:
        'Senior governing editor and peer reviewer appointed to The Patriot Sovereign Editorial Council.',
    },
    fellow: {
      label: 'Senior Fellow',
      icon: Sparkles,
      badgeClass:
        'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30 hover:border-blue-400 shadow-xs',
      title: 'Distinguished Fellow',
      description:
        'Distinguished academic fellow contributing primary research and strategic statecraft analyses.',
    },
  }[tier] || {
    label: 'Verified Author',
    icon: ShieldCheck,
    badgeClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30',
    title: 'The Patriot Verified Author',
    description: 'Official contributing author authorized by Master Administrator Wahab Ali Khiva.',
  };

  const Icon = badgeConfig.icon;

  if (!interactive) {
    return (
      <span
        title={`${badgeConfig.title}${authorName ? ` for ${authorName}` : ''} — ${badgeConfig.description}`}
        className={`inline-flex items-center gap-1 font-sans rounded-full px-1.5 py-0.5 select-none ${textSizes[size]} font-semibold tracking-wide ${badgeConfig.badgeClass} ${className}`}
      >
        <Icon className={iconSizes[size]} aria-hidden="true" />
        {showLabel && <span>{badgeConfig.label}</span>}
      </span>
    );
  }

  return (
    <span
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onFocus={() => setShowTooltip(true)}
      onBlur={() => setShowTooltip(false)}
    >
      <button
        type="button"
        aria-label={`${badgeConfig.title}${authorName ? ` for ${authorName}` : ''}`}
        onClick={e => {
          e.stopPropagation();
          setShowTooltip(!showTooltip);
        }}
        className={`inline-flex items-center gap-1 font-sans rounded-full px-1.5 py-0.5 cursor-pointer transition-all ${textSizes[size]} font-semibold tracking-wide ${badgeConfig.badgeClass}`}
      >
        <Icon className={iconSizes[size]} aria-hidden="true" />
        {showLabel && <span>{badgeConfig.label}</span>}
      </button>

      {/* Tooltip popover */}
      {showTooltip && (
        <span
          role="tooltip"
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-950 text-stone-200 text-xs rounded-xl shadow-2xl border border-amber-500/40 z-50 pointer-events-none block text-left animate-in fade-in zoom-in-95 duration-150"
        >
          <span className="flex items-center gap-1.5 font-bold text-amber-400 mb-1">
            <Icon className="w-3.5 h-3.5 text-amber-400" />
            <span>{badgeConfig.title}</span>
          </span>
          <span className="text-[11px] text-stone-300 leading-relaxed block font-normal">
            {badgeConfig.description}
          </span>
          {authorName && (
            <span className="text-[10px] text-amber-500/80 mt-1.5 pt-1.5 border-t border-slate-800 font-mono block">
              Accredited Contributor: {authorName}
            </span>
          )}
          <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-950 block" />
        </span>
      )}
    </span>
  );
};

export default AuthorVerifiedBadge;
