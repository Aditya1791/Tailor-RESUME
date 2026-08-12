'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/common/navbar';
import { CommandPalette } from '@/components/common/command-palette';
import { ThemeProvider } from '@/lib/context/theme-context';
import { StatusCacheProvider } from '@/lib/context/status-cache';
import { LanguageProvider } from '@/lib/context/language-context';
import { ResumePreviewProvider } from '@/components/common/resume_previewer_context';
import { LocalizedErrorBoundary } from '@/components/common/error-boundary';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  return (
    <ThemeProvider>
      <StatusCacheProvider>
        <LanguageProvider>
          <ResumePreviewProvider>
            <LocalizedErrorBoundary>
              <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-200">
                <Navbar onOpenCommandPalette={() => setCommandPaletteOpen(true)} />
                <main className="flex-1 flex flex-col">{children}</main>
                <CommandPalette open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen} />
              </div>
            </LocalizedErrorBoundary>
          </ResumePreviewProvider>
        </LanguageProvider>
      </StatusCacheProvider>
    </ThemeProvider>
  );
}
