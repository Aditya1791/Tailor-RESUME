'use client';

import React, { useState } from 'react';
import type { ATSScore } from '@/components/common/resume_previewer_context';
import { cn } from '@/lib/utils';

// Icons
import CheckCircle2 from 'lucide-react/dist/esm/icons/check-circle-2';
import AlertCircle from 'lucide-react/dist/esm/icons/alert-circle';
import Sparkles from 'lucide-react/dist/esm/icons/sparkles';
import Copy from 'lucide-react/dist/esm/icons/copy';
import Check from 'lucide-react/dist/esm/icons/check';
import TrendingUp from 'lucide-react/dist/esm/icons/trending-up';

interface ATSScoreCardProps {
  atsScore: ATSScore;
}

const SUB_SCORE_LABELS: Record<string, string> = {
  keyword_match: 'Keyword Match',
  skills_coverage: 'Skills Coverage',
  section_completeness: 'Section Completeness',
  experience_relevance: 'Experience Relevance',
  formatting_quality: 'Formatting & Readability',
};

export function ATSScoreCard({ atsScore }: ATSScoreCardProps) {
  const [activeTab, setActiveTab] = useState<'breakdown' | 'skills' | 'recommendations'>('breakdown');
  const [copiedKeyword, setCopiedKeyword] = useState<string | null>(null);

  const { overall_score, sub_scores, missing_keywords, injectable_keywords, recommendations } =
    atsScore;

  const score = Number.isFinite(overall_score) ? overall_score : 0;

  const getScoreTheme = (val: number) => {
    if (val >= 80) {
      return {
        text: 'text-emerald-600 dark:text-emerald-400',
        stroke: '#10b981',
        bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400',
        bar: 'bg-emerald-500',
        badge: 'High Match',
      };
    }
    if (val >= 60) {
      return {
        text: 'text-amber-600 dark:text-amber-400',
        stroke: '#f59e0b',
        bg: 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400',
        bar: 'bg-amber-500',
        badge: 'Moderate Match',
      };
    }
    return {
      text: 'text-red-600 dark:text-red-400',
      stroke: '#ef4444',
      bg: 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400',
      bar: 'bg-red-500',
      badge: 'Action Needed',
    };
  };

  const currentTheme = getScoreTheme(score);

  // Circle progress calculation (circumference = 2 * PI * r = 2 * 3.14159 * 42 ≈ 264)
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;

  const handleCopy = (kw: string) => {
    navigator.clipboard.writeText(kw);
    setCopiedKeyword(kw);
    setTimeout(() => setCopiedKeyword(null), 2000);
  };

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm p-5 space-y-5">
      {/* Header with Circular Score Gauge */}
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
            ATS Compatibility Score
          </span>
          <h3 className="text-lg font-mono font-bold text-foreground">
            Resume Match Analysis
          </h3>
          <div className={cn('inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold border', currentTheme.bg)}>
            <TrendingUp className="h-3 w-3" />
            <span>{currentTheme.badge}</span>
          </div>
        </div>

        {/* Circular Gauge */}
        <div className="relative flex items-center justify-center h-24 w-24 shrink-0">
          <svg className="h-24 w-24 -rotate-90 transform" viewBox="0 0 100 100">
            {/* Background Track */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              className="stroke-muted"
              strokeWidth="8"
              fill="transparent"
            />
            {/* Progress Stroke */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke={currentTheme.stroke}
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className={cn('text-2xl font-black font-mono leading-none', currentTheme.text)}>
              {score.toFixed(0)}%
            </span>
            <span className="text-[9px] font-mono uppercase text-muted-foreground tracking-tighter">
              Overall
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border text-xs font-mono">
        <button
          onClick={() => setActiveTab('breakdown')}
          type="button"
          className={cn(
            'px-3 py-2 border-b-2 font-bold transition-colors cursor-pointer',
            activeTab === 'breakdown'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          )}
        >
          Sub-scores
        </button>
        <button
          onClick={() => setActiveTab('skills')}
          type="button"
          className={cn(
            'px-3 py-2 border-b-2 font-bold transition-colors cursor-pointer flex items-center gap-1.5',
            activeTab === 'skills'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          )}
        >
          <span>Keywords</span>
          {missing_keywords?.length > 0 && (
            <span className="h-4 px-1 rounded-full bg-red-500/10 text-red-500 text-[10px] font-bold">
              {missing_keywords.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('recommendations')}
          type="button"
          className={cn(
            'px-3 py-2 border-b-2 font-bold transition-colors cursor-pointer',
            activeTab === 'recommendations'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          )}
        >
          AI Tips
        </button>
      </div>

      {/* Tab 1: Sub-scores */}
      {activeTab === 'breakdown' && (
        <div className="space-y-3 pt-1">
          {Object.entries(sub_scores).map(([key, value]) => {
            const numVal = Number.isFinite(value) ? value : 0;
            const theme = getScoreTheme(numVal);
            return (
              <div key={key} className="space-y-1">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-foreground">{SUB_SCORE_LABELS[key] ?? key}</span>
                  <span className={cn('font-bold tabular-nums', theme.text)}>
                    {numVal.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                  <div
                    className={cn('h-1.5 rounded-full transition-all duration-500', theme.bar)}
                    style={{ width: `${Math.min(100, Math.max(0, numVal))}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Keywords & Missing Skills */}
      {activeTab === 'skills' && (
        <div className="space-y-4 pt-1">
          {/* Missing Keywords */}
          {missing_keywords && missing_keywords.length > 0 ? (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-red-500 uppercase">
                <AlertCircle className="h-3.5 w-3.5" />
                <span>Missing Key Requirements ({missing_keywords.length})</span>
              </div>
              <p className="text-[11px] text-muted-foreground font-sans">
                Click any keyword to copy and include it in your experience bullet points:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {missing_keywords.map((kw, i) => (
                  <button
                    key={`missing-${i}-${kw}`}
                    onClick={() => handleCopy(kw)}
                    type="button"
                    className="group inline-flex items-center gap-1 text-xs font-mono bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-md px-2 py-1 hover:bg-red-500/20 transition-all cursor-pointer"
                    title="Click to copy keyword"
                  >
                    <span>{kw}</span>
                    {copiedKeyword === kw ? (
                      <Check className="h-3 w-3 text-emerald-500" />
                    ) : (
                      <Copy className="h-2.5 w-2.5 opacity-60 group-hover:opacity-100" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-mono">
              <CheckCircle2 className="h-4 w-4" />
              <span>All critical target keywords are present in your resume!</span>
            </div>
          )}

          {/* Injectable / Suggested Keywords */}
          {injectable_keywords && injectable_keywords.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-border">
              <span className="text-xs font-mono font-bold text-muted-foreground uppercase flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-primary" />
                <span>Suggested Action Keywords</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {injectable_keywords.map((kw, i) => (
                  <button
                    key={`inj-${i}-${kw}`}
                    onClick={() => handleCopy(kw)}
                    type="button"
                    className="inline-flex items-center gap-1 text-xs font-mono bg-primary/10 border border-primary/20 text-primary rounded-md px-2 py-1 hover:bg-primary/20 transition-all cursor-pointer"
                  >
                    <span>{kw}</span>
                    {copiedKeyword === kw ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-2.5 w-2.5 opacity-60" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Recommendations */}
      {activeTab === 'recommendations' && (
        <div className="space-y-2 pt-1">
          {recommendations && recommendations.length > 0 ? (
            recommendations.map((rec, i) => (
              <div
                key={`rec-${i}`}
                className="flex items-start gap-2.5 p-2.5 rounded-lg bg-muted/40 border border-border/60 text-xs font-sans text-foreground leading-relaxed"
              >
                <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>{rec}</span>
              </div>
            ))
          ) : (
            <p className="text-xs font-mono text-muted-foreground py-4 text-center">
              Your resume format aligns strongly with ATS best practices.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
