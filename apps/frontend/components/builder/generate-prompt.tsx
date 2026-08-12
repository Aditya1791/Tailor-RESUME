'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2, FileText, Mail, MessagesSquare, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslations } from '@/lib/i18n';

export interface GeneratePromptProps {
  /** Type of content to generate */
  type: 'cover-letter' | 'outreach' | 'interview-prep';
  /** Whether generation is in progress */
  isGenerating: boolean;
  /** Callback to trigger generation */
  onGenerate: () => void;
  /** Whether this is a tailored resume (has job context) */
  isTailoredResume: boolean;
  /** Additional class names */
  className?: string;
}

export function GeneratePrompt({
  type,
  isGenerating,
  onGenerate,
  isTailoredResume,
  className,
}: GeneratePromptProps) {
  const { t } = useTranslations();
  const isOutreach = type === 'outreach';
  const isInterviewPrep = type === 'interview-prep';
  const Icon = isInterviewPrep ? MessagesSquare : isOutreach ? Mail : FileText;
  const title = isInterviewPrep
    ? t('interviewPrep.title')
    : isOutreach
      ? t('outreach.title')
      : t('coverLetter.title');

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center min-h-[400px] p-12 text-center',
        className
      )}
    >
      <div className="w-16 h-16 border-2 border-primary bg-primary/10 flex items-center justify-center mb-6">
        <Icon className="w-8 h-8 text-primary" />
      </div>
      <h3 className="font-mono text-sm font-bold uppercase tracking-wider mb-3 text-foreground">
        {t('builder.generatePrompt.generateTitle', { title })}
      </h3>
      <p className="font-mono text-xs text-muted-foreground max-w-md mb-6 leading-relaxed">
        {isInterviewPrep
          ? t('builder.generatePrompt.interviewPrepDescription')
          : isOutreach
            ? t('builder.generatePrompt.outreachDescription')
            : t('builder.generatePrompt.coverLetterDescription')}
      </p>
      <Button onClick={onGenerate} disabled={isGenerating} className="gap-2">
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            {t('common.generating')}
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            {t('builder.generatePrompt.generateButton', { title })}
          </>
        )}
      </Button>
      <p className="font-mono text-xs text-muted-foreground mt-4">
        {isInterviewPrep
          ? t('builder.generatePrompt.interviewPrepFooter')
          : isOutreach
            ? t('builder.generatePrompt.outreachFooter')
            : t('builder.generatePrompt.coverLetterFooter')}
      </p>
    </div>
  );
}
