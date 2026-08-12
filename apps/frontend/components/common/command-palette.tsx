'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from '@/lib/i18n';
import { useTheme } from '@/lib/context/theme-context';
import { cn } from '@/lib/utils';

// Icons
import Search from 'lucide-react/dist/esm/icons/search';
import LayoutDashboard from 'lucide-react/dist/esm/icons/layout-dashboard';
import Sparkles from 'lucide-react/dist/esm/icons/sparkles';
import FileText from 'lucide-react/dist/esm/icons/file-text';
import Wand2 from 'lucide-react/dist/esm/icons/wand-2';
import Kanban from 'lucide-react/dist/esm/icons/kanban';
import SettingsIcon from 'lucide-react/dist/esm/icons/settings';
import Sun from 'lucide-react/dist/esm/icons/sun';
import Moon from 'lucide-react/dist/esm/icons/moon';
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right';

interface CommandItem {
  id: string;
  label: string;
  category: string;
  icon: React.ElementType;
  action: () => void;
  keywords?: string[];
}

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenUpload?: () => void;
}

export function CommandPalette({ open, onOpenChange, onOpenUpload }: CommandPaletteProps) {
  const router = useRouter();
  const { t } = useTranslations();
  const { toggleTheme, resolvedTheme } = useTheme();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const items: CommandItem[] = [
    {
      id: 'dashboard',
      label: t('nav.dashboard') || 'Dashboard',
      category: 'Navigation',
      icon: LayoutDashboard,
      action: () => {
        router.push('/dashboard');
        onOpenChange(false);
      },
      keywords: ['home', 'resumes', 'overview', 'stats'],
    },
    {
      id: 'tailor',
      label: t('nav.tailor') || 'Tailor Resume',
      category: 'Features',
      icon: Sparkles,
      action: () => {
        router.push('/tailor');
        onOpenChange(false);
      },
      keywords: ['match', 'ats', 'job', 'description', 'ai', 'improve'],
    },
    {
      id: 'builder',
      label: t('nav.builder') || 'Resume Builder',
      category: 'Features',
      icon: FileText,
      action: () => {
        router.push('/builder');
        onOpenChange(false);
      },
      keywords: ['editor', 'edit', 'sections', 'skills', 'experience'],
    },
    {
      id: 'wizard',
      label: t('nav.wizard') || 'AI Resume Wizard',
      category: 'Features',
      icon: Wand2,
      action: () => {
        router.push('/resume-wizard');
        onOpenChange(false);
      },
      keywords: ['create', 'new', 'questions', 'interactive', 'ai'],
    },
    {
      id: 'tracker',
      label: t('nav.tracker') || 'Application Tracker',
      category: 'Features',
      icon: Kanban,
      action: () => {
        router.push('/tracker');
        onOpenChange(false);
      },
      keywords: ['kanban', 'jobs', 'applied', 'interview', 'status'],
    },
    {
      id: 'settings',
      label: t('nav.settings') || 'Settings & AI Config',
      category: 'Navigation',
      icon: SettingsIcon,
      action: () => {
        router.push('/settings');
        onOpenChange(false);
      },
      keywords: ['api', 'key', 'provider', 'model', 'preferences', 'openai', 'gemini'],
    },
    {
      id: 'toggle-theme',
      label: resolvedTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode',
      category: 'Appearance',
      icon: resolvedTheme === 'dark' ? Sun : Moon,
      action: () => {
        toggleTheme();
        onOpenChange(false);
      },
      keywords: ['dark', 'light', 'theme', 'color', 'mode'],
    },
  ];

  if (onOpenUpload) {
    items.unshift({
      id: 'upload',
      label: 'Upload Master Resume',
      category: 'Quick Actions',
      icon: Sparkles,
      action: () => {
        onOpenChange(false);
        onOpenUpload();
      },
      keywords: ['upload', 'pdf', 'docx', 'master', 'import'],
    });
  }

  const filteredItems = items.filter((item) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      item.label.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.keywords?.some((k) => k.toLowerCase().includes(q))
    );
  });

  // Global Keyboard listener for Cmd+K / Ctrl+K and Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpenChange(!open);
      }
      if (e.key === 'Escape' && open) {
        e.preventDefault();
        onOpenChange(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onOpenChange]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Handle arrow navigation and enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
      }
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in-0 duration-200"
        onClick={() => onOpenChange(false)}
      />

      {/* Palette Modal */}
      <div className="relative w-full max-w-xl rounded-xl border border-border bg-card shadow-2xl overflow-hidden z-10 animate-in fade-in-0 zoom-in-95 duration-150">
        {/* Search Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border bg-muted/20">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command, page, or action..."
            className="w-full bg-transparent text-sm font-mono text-foreground placeholder:text-muted-foreground outline-none"
          />
          <kbd className="hidden sm:inline-block rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground border border-border">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-xs font-mono text-muted-foreground">
              No matching commands or pages found.
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const Icon = item.icon;
              const isSelected = index === selectedIndex;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(index)}
                  type="button"
                  className={cn(
                    'flex w-full items-center justify-between px-3 py-2.5 rounded-lg text-xs font-mono transition-colors text-left group',
                    isSelected
                      ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                      : 'text-foreground hover:bg-muted/60'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={cn('h-4 w-4', isSelected ? 'text-primary-foreground' : 'text-muted-foreground')} />
                    <span>{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn('text-[10px] uppercase opacity-60', isSelected ? 'text-primary-foreground' : 'text-muted-foreground')}>
                      {item.category}
                    </span>
                    <ArrowRight className={cn('h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity', isSelected && 'opacity-100')} />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between px-4 py-2 text-[10px] font-mono text-muted-foreground bg-muted/30 border-t border-border">
          <div className="flex items-center gap-3">
            <span>Use ↑↓ to navigate</span>
            <span>↵ to select</span>
          </div>
          <span>Resume Matcher AI</span>
        </div>
      </div>
    </div>
  );
}
