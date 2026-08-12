'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from '@/lib/i18n';
import { useTheme } from '@/lib/context/theme-context';
import { useStatusCache } from '@/lib/context/status-cache';
import { useLanguage } from '@/lib/context/language-context';
import { cn } from '@/lib/utils';

// Optimized icons
import Sun from 'lucide-react/dist/esm/icons/sun';
import Moon from 'lucide-react/dist/esm/icons/moon';
import Search from 'lucide-react/dist/esm/icons/search';
import Sparkles from 'lucide-react/dist/esm/icons/sparkles';
import FileText from 'lucide-react/dist/esm/icons/file-text';
import Wand2 from 'lucide-react/dist/esm/icons/wand-2';
import Kanban from 'lucide-react/dist/esm/icons/kanban';
import SettingsIcon from 'lucide-react/dist/esm/icons/settings';
import LayoutDashboard from 'lucide-react/dist/esm/icons/layout-dashboard';
import Globe from 'lucide-react/dist/esm/icons/globe';
import CheckCircle2 from 'lucide-react/dist/esm/icons/check-circle-2';
import AlertCircle from 'lucide-react/dist/esm/icons/alert-circle';
import Menu from 'lucide-react/dist/esm/icons/menu';
import X from 'lucide-react/dist/esm/icons/x';

interface NavbarProps {
  onOpenCommandPalette?: () => void;
}

export function Navbar({ onOpenCommandPalette }: NavbarProps) {
  const pathname = usePathname();
  const { t } = useTranslations();
  const { resolvedTheme, toggleTheme } = useTheme();
  const { status, isLoading: statusLoading } = useStatusCache();
  const { currentLanguage, setLanguage, supportedLanguages } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const isLlmConfigured = !statusLoading && status?.llm_configured;

  const navLinks = [
    { href: '/dashboard', label: t('nav.dashboard') || 'Dashboard', icon: LayoutDashboard },
    { href: '/tailor', label: t('nav.tailor') || 'Tailor', icon: Sparkles },
    { href: '/builder', label: t('nav.builder') || 'Builder', icon: FileText },
    { href: '/resume-wizard', label: t('nav.wizard') || 'Wizard', icon: Wand2 },
    { href: '/tracker', label: t('nav.tracker') || 'Tracker', icon: Kanban },
    { href: '/settings', label: t('nav.settings') || 'Settings', icon: SettingsIcon },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 glass-panel">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="group flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-mono font-black text-base shadow-sm transition-transform duration-200 group-hover:scale-105">
              RM
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-sm font-black tracking-tight text-foreground uppercase">
                Resume Matcher
              </span>
              <span className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase">
                AI Career Suite
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || pathname?.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'flex items-center gap-2 px-3 py-1.5 text-xs font-mono font-bold uppercase transition-all duration-150 rounded-md',
                    isActive
                      ? 'bg-primary/10 text-primary border border-primary/20 shadow-xs'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Quick Search / Command Palette Trigger */}
          <button
            onClick={onOpenCommandPalette}
            type="button"
            className="hidden sm:flex items-center gap-2 h-8 px-3 text-xs font-mono text-muted-foreground bg-muted/50 hover:bg-muted border border-border rounded-md transition-colors"
            title="Search & Quick Actions (Cmd+K)"
          >
            <Search className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs">Quick Search...</span>
            <kbd className="ml-2 hidden lg:inline-block rounded bg-background px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground border border-border">
              ⌘K
            </kbd>
          </button>

          {/* AI Status Badge */}
          <Link
            href="/settings"
            className={cn(
              'hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold border transition-all',
              isLlmConfigured
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/20'
            )}
            title={isLlmConfigured ? 'AI Provider Ready' : 'AI Setup Required'}
          >
            {isLlmConfigured ? (
              <>
                <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                <span>AI Connected</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-3 w-3 text-amber-500 animate-pulse" />
                <span>Configure AI</span>
              </>
            )}
          </Link>

          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              title="Change Language"
              aria-label="Change Language"
            >
              <Globe className="h-4 w-4" />
            </button>

            {langMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-40 rounded-md border border-border bg-card p-1 shadow-lg z-50 animate-in fade-in-0 zoom-in-95"
                onMouseLeave={() => setLangMenuOpen(false)}
              >
                {supportedLanguages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setLangMenuOpen(false);
                    }}
                    type="button"
                    className={cn(
                      'flex w-full items-center justify-between px-2.5 py-1.5 text-xs font-mono rounded transition-colors text-left',
                      currentLanguage === lang.code
                        ? 'bg-primary text-primary-foreground font-bold'
                        : 'text-foreground hover:bg-muted'
                    )}
                  >
                    <span>{lang.nativeName}</span>
                    <span className="text-[10px] uppercase opacity-70">{lang.code}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title={`Switch to ${resolvedTheme === 'dark' ? 'Light' : 'Dark'} mode`}
            aria-label="Toggle Theme"
          >
            {resolvedTheme === 'dark' ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-blue-600" />
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            type="button"
            className="md:hidden flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background/50 hover:bg-muted text-muted-foreground"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card px-4 py-3 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 text-xs font-mono font-bold uppercase rounded-md transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
