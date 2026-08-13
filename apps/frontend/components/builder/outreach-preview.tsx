'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Linkedin, Mail } from 'lucide-react';
import { useTranslations } from '@/lib/i18n';

export interface OutreachPreviewProps {
  /** Outreach message content */
  content: string;
  /** Additional class names */
  className?: string;
}

export function OutreachPreview({ content, className }: OutreachPreviewProps) {
  const { t } = useTranslations();
  return (
    <div
      className={cn(
        'bg-card text-foreground border-2 border-border',
        'shadow-sw-default',
        'overflow-hidden',
        className
      )}
    >
      {/* Preview Header */}
      <div className="p-4 border-b-2 border-border bg-secondary">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Linkedin className="w-4 h-4 text-[#0077B5]" />
            <span className="font-mono text-xs uppercase text-foreground">
              {t('outreach.preview.channels.linkedin')}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-primary" />
            <span className="font-mono text-xs uppercase text-foreground">
              {t('outreach.preview.channels.email')}
            </span>
          </div>
        </div>
      </div>

      {/* Message Preview */}
      <div className="p-6 md:p-8 bg-background">
        {content ? (
          <div className="space-y-4">
            {/* Message Bubble Style */}
            <div className="bg-card border-2 border-border p-4 shadow-sw-sm">
              <p className="font-sans text-sm leading-relaxed whitespace-pre-wrap text-foreground">{content}</p>
            </div>

            {/* Usage Tips */}
            <div className="pt-4 border-t border-border">
              <p className="font-mono text-xs text-muted-foreground uppercase mb-2">
                {t('outreach.preview.howToUseTitle')}
              </p>
              <ul className="font-mono text-xs text-muted-foreground space-y-1">
                <li>{t('outreach.preview.steps.step1')}</li>
                <li>{t('outreach.preview.steps.step2')}</li>
                <li>{t('outreach.preview.steps.step3')}</li>
                <li>{t('outreach.preview.steps.step4')}</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p className="font-mono text-sm">{t('outreach.preview.emptyTitle')}</p>
            <p className="font-mono text-xs mt-2">{t('outreach.preview.emptyDescription')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
