import React, { useState } from 'react';
import { VerificationTier, VerificationDetails } from '../types';
import { ShieldCheck, GraduationCap, Award, CheckCircle2, Info } from 'lucide-react';

interface VerificationBadgeProps {
  tier?: VerificationTier;
  details?: VerificationDetails;
  authorName?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  interactive?: boolean;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  tier = 'none',
  details,
  authorName,
  size = 'sm',
  showLabel = false,
  interactive = true,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  if (!tier || tier === 'none') {
    return null;
  }

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const badgeConfig = {
    editorial_board: {
      label: 'Editorial Board',
      icon: Award,
      badgeClass: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60',
      title: 'The Patriot Editorial Board Fellow',
      description: 'Senior member of the editorial and reviewing council with verified editorial authority.',
    },
    verified_scholar: {
      label: 'Verified Scholar',
      icon: GraduationCap,
      badgeClass: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/60',
      title: 'Peer-Attested Academic Fellow',
      description: details?.institution
        ? `Verified faculty or researcher at ${details.institution}. Credentials and primary peer-reviewed research independently authenticated.`
        : 'Credentials, academic affiliation, and research portfolio independently verified by The Patriot Bureau.',
    },
    email_verified: {
      label: 'Verified Reader',
      icon: CheckCircle2,
      badgeClass: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/60',
      title: 'Verified Reader',
      description: 'Email identity confirmed and community guidelines compliance attested.',
    },
  }[tier];

  if (!badgeConfig) return null;

  const Icon = badgeConfig.icon;

  if (!interactive) {
    return (
      <span
        title={`${badgeConfig.title}${authorName ? ` for ${authorName}` : ''} · ${badgeConfig.description}`}
        className={`inline-flex items-center gap-1 font-sans rounded-full px-1.5 py-0.5 border select-none ${badgeConfig.badgeClass}`}
      >
        <Icon className={iconSizes[size]} aria-hidden="true" />
        {showLabel && (
          <span className="text-[10px] font-bold uppercase tracking-wider">
            {badgeConfig.label}
          </span>
        )}
      </span>
    );
  }

  return (
    <span
      className="relative inline-flex items-center"
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
        className={`inline-flex items-center gap-1 font-sans rounded-full px-1.5 py-0.5 border cursor-help transition-all ${badgeConfig.badgeClass}`}
      >
        <Icon className={iconSizes[size]} aria-hidden="true" />
        {showLabel && (
          <span className="text-[10px] font-bold uppercase tracking-wider">
            {badgeConfig.label}
          </span>
        )}
      </button>

      {/* Trust Badge Explanatory Tooltip Popover */}
      {showTooltip && (
        <span
          role="tooltip"
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-900 text-stone-200 text-xs rounded-xl shadow-2xl border border-slate-700 z-50 pointer-events-none transition-all block text-left"
        >
          <span className="flex items-center gap-1.5 font-bold text-white mb-1">
            <Icon className="w-3.5 h-3.5 text-amber-400" />
            <span>{badgeConfig.title}</span>
          </span>
          <span className="text-[11px] text-stone-300 leading-relaxed block font-normal">
            {badgeConfig.description}
          </span>
          {details?.verifiedAt && (
            <span className="text-[10px] text-stone-400 mt-1.5 pt-1.5 border-t border-slate-800 font-mono block">
              Verified: {new Date(details.verifiedAt).toLocaleDateString()}
              {details.credentialTitle && ` · ${details.credentialTitle}`}
            </span>
          )}
          {/* Tooltip caret */}
          <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900 block" />
        </span>
      )}
    </span>
  );
};
