'use client';

import React from 'react';
import Link from 'next/link';
// Icons
import Sparkles from 'lucide-react/dist/esm/icons/sparkles';
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right';
import CheckCircle2 from 'lucide-react/dist/esm/icons/check-circle-2';
import Zap from 'lucide-react/dist/esm/icons/zap';
import ShieldCheck from 'lucide-react/dist/esm/icons/shield-check';
import Cpu from 'lucide-react/dist/esm/icons/cpu';
import FileCheck from 'lucide-react/dist/esm/icons/file-check';
import Wand2 from 'lucide-react/dist/esm/icons/wand-2';
import Kanban from 'lucide-react/dist/esm/icons/kanban';

export default function Hero() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full overflow-hidden bg-background flex flex-col justify-between">
      {/* Background Glow Mesh */}
      <div className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-25">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute top-1/3 -right-40 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 h-96 w-96 rounded-full bg-emerald-500/15 blur-3xl" />
      </div>

      {/* Grid Background Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30 dark:opacity-15"
        style={{
          backgroundImage:
            'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          color: 'var(--border)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-12 pb-16 sm:px-6 lg:px-8 flex-1 flex flex-col justify-center">
        {/* Top Feature Pill */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-mono font-semibold text-primary shadow-xs">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Next-Gen AI Resume & Career Suite</span>
          </div>
        </div>

        {/* Main Heading */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-foreground font-mono uppercase">
            Tailor Resumes <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 dark:from-blue-400 dark:via-indigo-400 dark:to-cyan-300">
              Win More Interviews
            </span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto font-sans leading-relaxed">
            Harness precision ATS keyword matching, AI STAR-method bullet enhancements, and
            automated interview prep designed to get your resume past applicant tracking systems.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-lg bg-primary px-6 py-3.5 text-sm font-mono font-bold uppercase text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Launch Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/tailor"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-6 py-3.5 text-sm font-mono font-bold uppercase text-foreground shadow-xs transition-all hover:bg-muted/70 hover:border-foreground/30"
            >
              <Zap className="h-4 w-4 text-amber-500" />
              <span>Quick Tailor</span>
            </Link>

            <Link
              href="/resume-wizard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-6 py-3.5 text-sm font-mono font-bold uppercase text-foreground shadow-xs transition-all hover:bg-muted/70 hover:border-foreground/30"
            >
              <Wand2 className="h-4 w-4 text-indigo-500" />
              <span>AI Wizard</span>
            </Link>
          </div>
        </div>

        {/* Interactive Feature Demo Card */}
        <div className="mt-14 max-w-5xl mx-auto w-full">
          <div className="rounded-2xl border border-border/80 bg-card/80 p-6 sm:p-8 shadow-xl backdrop-blur-md">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* ATS Score Showcase */}
              <div className="flex flex-col items-center justify-center p-5 rounded-xl bg-background/60 border border-border/60 text-center">
                <div className="relative flex items-center justify-center h-28 w-28 rounded-full border-4 border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400">
                  <div className="flex flex-col items-center">
                    <span className="text-3xl font-black font-mono">94%</span>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                      ATS Match
                    </span>
                  </div>
                </div>
                <div className="mt-3 font-mono text-xs font-bold text-foreground uppercase flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>High Recruiter Alignment</span>
                </div>
              </div>

              {/* Skills Radar Preview */}
              <div className="flex flex-col p-5 rounded-xl bg-background/60 border border-border/60 space-y-3">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
                  Identified Key Skills
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'TypeScript',
                    'React 19',
                    'Next.js',
                    'FastAPI',
                    'System Architecture',
                    'CI/CD',
                    'SQL',
                  ].map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold bg-primary/10 text-primary border border-primary/20"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <span className="text-[11px] text-muted-foreground font-sans pt-1">
                  12/12 crucial job keywords seamlessly woven into your resume.
                </span>
              </div>

              {/* STAR Optimizer Transformation */}
              <div className="flex flex-col p-5 rounded-xl bg-background/60 border border-border/60 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-mono font-bold uppercase">
                  <span className="text-muted-foreground">AI STAR Enhancement</span>
                  <span className="text-emerald-500 text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Optimized
                  </span>
                </div>
                <p className="text-xs font-sans text-foreground/90 bg-muted/30 p-2.5 rounded-md border border-border/40 italic">
                  &ldquo;Orchestrated high-throughput microservices using FastAPI and SQLite,
                  reducing latency by 42% and increasing tailoring throughput 5x.&rdquo;
                </p>
                <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-mono font-semibold">
                  <Sparkles className="h-3 w-3" />
                  <span>Quantified business impact added</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Grid Bar */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto w-full text-center">
          <div className="p-3 rounded-lg border border-border/60 bg-card/40">
            <Cpu className="h-5 w-5 mx-auto text-primary mb-1" />
            <div className="text-xs font-mono font-bold text-foreground uppercase">Multi-LLM</div>
            <div className="text-[10px] text-muted-foreground font-sans">
              OpenAI, Claude, Gemini, Groq
            </div>
          </div>
          <div className="p-3 rounded-lg border border-border/60 bg-card/40">
            <FileCheck className="h-5 w-5 mx-auto text-emerald-500 mb-1" />
            <div className="text-xs font-mono font-bold text-foreground uppercase">
              Precision ATS
            </div>
            <div className="text-[10px] text-muted-foreground font-sans">
              Keyword & Sub-score Radar
            </div>
          </div>
          <div className="p-3 rounded-lg border border-border/60 bg-card/40">
            <Kanban className="h-5 w-5 mx-auto text-amber-500 mb-1" />
            <div className="text-xs font-mono font-bold text-foreground uppercase">
              Kanban Tracker
            </div>
            <div className="text-[10px] text-muted-foreground font-sans">
              Pipeline & Salary Tracking
            </div>
          </div>
          <div className="p-3 rounded-lg border border-border/60 bg-card/40">
            <ShieldCheck className="h-5 w-5 mx-auto text-indigo-500 mb-1" />
            <div className="text-xs font-mono font-bold text-foreground uppercase">
              100% Private
            </div>
            <div className="text-[10px] text-muted-foreground font-sans">
              Local & Encrypted Storage
            </div>
          </div>
        </div>
      </div>

      {/* Footer copyright */}
      <div className="border-t border-border/40 py-4 px-4 text-center text-xs font-mono text-muted-foreground">
        <span>Resume Matcher • Open-source AI Career Intelligence Suite</span>
      </div>
    </div>
  );
}
