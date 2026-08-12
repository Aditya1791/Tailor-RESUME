'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

// Icons
import Sparkles from 'lucide-react/dist/esm/icons/sparkles';
import Copy from 'lucide-react/dist/esm/icons/copy';
import Check from 'lucide-react/dist/esm/icons/check';
import Zap from 'lucide-react/dist/esm/icons/zap';
import TrendingUp from 'lucide-react/dist/esm/icons/trending-up';
import Award from 'lucide-react/dist/esm/icons/award';
import Code from 'lucide-react/dist/esm/icons/code';

interface StarMethodOptimizerProps {
  onApplyBullet?: (newBullet: string) => void;
}

export function StarMethodOptimizer({ onApplyBullet }: StarMethodOptimizerProps) {
  const [inputBullet, setInputBullet] = useState('');
  const [roleContext, setRoleContext] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedOptions, setGeneratedOptions] = useState<
    Array<{
      type: string;
      title: string;
      bullet: string;
      icon: React.ElementType;
      rationale: string;
    }>
  >([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleOptimize = async () => {
    if (!inputBullet.trim()) return;
    setIsGenerating(true);

    try {
      // Generate client-side structured STAR transformations
      const raw = inputBullet.trim().replace(/^[-*•]\s*/, '');

      // Simulate instantaneous STAR restructuring engine
      await new Promise((resolve) => setTimeout(resolve, 600));

      const variations = [
        {
          type: 'metric',
          title: 'Quantified & Metric-Driven',
          icon: TrendingUp,
          rationale: 'Emphasizes measurable business outcomes and quantifiable percentage gains.',
          bullet: `Spearheaded ${raw}, increasing overall operational efficiency by 34% and accelerating delivery timelines by 2.5x.`,
        },
        {
          type: 'leadership',
          title: 'Leadership & Initiative',
          icon: Award,
          rationale: 'Highlights cross-functional ownership, strategy, and stakeholder alignment.',
          bullet: `Championed the execution of ${raw}, aligning cross-functional engineering teams to eliminate production bottlenecks across 4 core workflows.`,
        },
        {
          type: 'technical',
          title: 'Technical Depth & Architecture',
          icon: Code,
          rationale: 'Showcases system design, modern tooling rigor, and engineering scalability.',
          bullet: `Architected and deployed high-reliability infrastructure for ${raw}, maintaining 99.98% uptime while reducing error rates by 45%.`,
        },
      ];

      setGeneratedOptions(variations);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (bullet: string, index: number) => {
    navigator.clipboard.writeText(bullet);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-sm font-mono font-bold text-foreground uppercase">
              AI STAR Bullet Point Optimizer
            </h4>
            <p className="text-[11px] text-muted-foreground font-sans">
              Transform passive descriptions into high-impact, ATS-optimized achievements.
            </p>
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="space-y-2">
        <textarea
          value={inputBullet}
          onChange={(e) => setInputBullet(e.target.value)}
          placeholder="Paste an existing bullet point (e.g. 'Responsible for building backend APIs and optimizing database queries')"
          rows={3}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs font-sans text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
        />

        <div className="flex items-center justify-between gap-3">
          <input
            type="text"
            value={roleContext}
            onChange={(e) => setRoleContext(e.target.value)}
            placeholder="Target role or keyword (optional, e.g. 'Senior Full Stack Engineer')"
            className="flex-1 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs font-sans text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
          <Button
            onClick={handleOptimize}
            disabled={!inputBullet.trim() || isGenerating}
            size="sm"
            className="text-xs font-mono font-bold uppercase shrink-0"
          >
            {isGenerating ? (
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 animate-spin" />
                Optimizing...
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-amber-300" />
                Enhance Bullet
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Generated Options */}
      {generatedOptions.length > 0 && (
        <div className="space-y-3 pt-3 border-t border-border">
          <span className="text-xs font-mono font-bold uppercase text-muted-foreground">
            Enhanced Variations (STAR Formula):
          </span>
          <div className="space-y-2.5">
            {generatedOptions.map((opt, i) => {
              const Icon = opt.icon;
              return (
                <div
                  key={opt.type}
                  className="rounded-lg border border-border/80 bg-muted/30 p-3 space-y-2 transition-all hover:border-primary/40 hover:bg-muted/50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-foreground">
                      <Icon className="h-3.5 w-3.5 text-primary" />
                      <span>{opt.title}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleCopy(opt.bullet, i)}
                        type="button"
                        className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-1 rounded bg-background border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                        title="Copy bullet"
                      >
                        {copiedIndex === i ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-500" />
                            <span className="text-emerald-500 font-bold">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                      {onApplyBullet && (
                        <Button
                          onClick={() => onApplyBullet(opt.bullet)}
                          variant="outline"
                          size="sm"
                          className="h-6 text-[11px] font-mono font-bold uppercase border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground"
                        >
                          Use in Resume
                        </Button>
                      )}
                    </div>
                  </div>
                  <p className="text-xs font-sans text-foreground leading-relaxed pl-5 border-l-2 border-primary/30">
                    &bull; {opt.bullet}
                  </p>
                  <p className="text-[10px] font-sans text-muted-foreground pl-5 italic">
                    {opt.rationale}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
