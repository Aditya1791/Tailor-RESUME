'use client';

import React from 'react';
import Link from 'next/link';
import LayoutGrid from 'lucide-react/dist/esm/icons/layout-grid';
import SettingsIcon from 'lucide-react/dist/esm/icons/settings';
import { useTranslations } from '@/lib/i18n';

export const SwissGrid = ({ children }: { children: React.ReactNode }) => {
  const { t } = useTranslations();

  return (
    <div className="min-h-[calc(100vh-4rem)] w-full flex justify-center items-start py-8 px-4 md:px-8 bg-background">
      {/* Main Container */}
      <div className="w-full max-w-[86rem] border border-border bg-card shadow-xl rounded-xl flex flex-col overflow-hidden">
        {/* Header Section */}
        <div className="border-b border-border p-6 md:p-10 shrink-0 bg-card/60 backdrop-blur-xs relative z-30 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-mono text-3xl md:text-5xl font-black text-foreground tracking-tight uppercase">
              {t('nav.dashboard')}
            </h1>
            <p className="mt-2 text-xs md:text-sm font-mono text-primary uppercase tracking-wide font-bold">
              {'// '}
              {t('dashboard.selectModule')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/tailor"
              className="inline-flex items-center justify-center gap-1.5 bg-primary text-primary-foreground text-xs font-mono font-bold px-4 py-2 rounded-lg uppercase tracking-wide shadow-sm hover:bg-primary/90 transition-all"
            >
              Tailor Resume
            </Link>
            <Link
              href="/resume-wizard"
              className="inline-flex items-center justify-center gap-1.5 bg-muted text-foreground border border-border text-xs font-mono font-bold px-4 py-2 rounded-lg uppercase tracking-wide hover:bg-muted/80 transition-all"
            >
              AI Wizard
            </Link>
          </div>
        </div>

        {/* Content Grid */}
        <div className="@container flex-1 p-4 md:p-6 relative z-10">
          <div className="grid grid-cols-1 @2xl:grid-cols-2 @3xl:grid-cols-3 @5xl:grid-cols-5 gap-4">
            {children}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-muted/40 flex justify-between items-center font-mono text-xs text-muted-foreground border-t border-border shrink-0 relative z-30">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="uppercase font-bold text-foreground">Resume Matcher AI</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/tracker"
              className="inline-flex items-center justify-center gap-1.5 bg-background text-foreground border border-border px-4 py-1.5 rounded-md text-xs uppercase font-bold tracking-wide hover:bg-muted transition-all"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              {t('nav.applicationTracker')}
            </Link>
            <Link
              href="/settings"
              className="inline-flex items-center justify-center gap-1.5 bg-background text-foreground border border-border px-4 py-1.5 rounded-md text-xs uppercase font-bold tracking-wide hover:bg-muted transition-all"
            >
              <SettingsIcon className="w-3.5 h-3.5" />
              {t('nav.settings')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
