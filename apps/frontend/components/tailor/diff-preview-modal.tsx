'use client';

import { useState, useEffect, useRef } from 'react';
import { AlertTriangle, CheckCircle, X, ChevronDown, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTranslations } from '@/lib/i18n';
import type {
  ResumeDiffSummary,
  ResumeFieldDiff,
} from '@/components/common/resume_previewer_context';

interface DiffPreviewModalProps {
  isOpen: boolean;
  isConfirming?: boolean;
  onClose: () => void;
  onReject: () => void;
  onConfirm: () => void;
  diffSummary?: ResumeDiffSummary;
  detailedChanges?: ResumeFieldDiff[];
  errorMessage?: string;
}

export function DiffPreviewModal({
  isOpen,
  isConfirming = false,
  onClose,
  onReject,
  onConfirm,
  diffSummary,
  detailedChanges,
  errorMessage,
}: DiffPreviewModalProps) {
  const { t } = useTranslations();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['summary', 'skills', 'descriptions', 'experience'])
  );

  // Elapsed timer while confirming
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isConfirming) {
      setElapsed(0);
      intervalRef.current = setInterval(() => setElapsed((s) => s + 1), 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setElapsed(0);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isConfirming]);

  if (!diffSummary || !detailedChanges) {
    return (
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          if (!open && !isConfirming) {
            onClose();
          }
        }}
      >
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col p-6 bg-card text-foreground border-2 border-border shadow-sw-lg">
          <DialogHeader className="border-b-2 border-border pb-4 bg-card -mx-6 -mt-6 px-6 pt-6">
            <DialogTitle className="font-serif text-2xl font-bold uppercase tracking-tight text-foreground">
              {t('tailor.missingDiffDialog.title')}
            </DialogTitle>
          </DialogHeader>

          <div className="mt-6 border-2 border-border bg-muted/30 p-4 font-mono text-xs text-foreground">
            {t('tailor.missingDiffDialog.description')}
          </div>
          <div className="mt-3 flex items-center gap-2 font-mono text-xs text-warning">
            <AlertTriangle className="w-4 h-4" />
            <span>{t('tailor.missingDiffDialog.confirmLabel')}</span>
          </div>

          <div className="flex justify-end items-center gap-3 pt-4 border-t-2 border-border bg-secondary -mx-6 -mb-6 px-6 py-4">
            <Button variant="outline" onClick={onClose} disabled={isConfirming} className="gap-2">
              {t('common.cancel')}
            </Button>
            <Button variant="warning" onClick={onConfirm} disabled={isConfirming} className="gap-2">
              {isConfirming ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t('common.saving')}
                </>
              ) : (
                t('tailor.missingDiffDialog.confirmLabel')
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  // Group changes by type
  const summaryChanges = detailedChanges.filter((c) => c.field_type === 'summary');
  const skillChanges = detailedChanges.filter((c) => c.field_type === 'skill');
  const descChanges = detailedChanges.filter((c) => c.field_type === 'description');
  const certChanges = detailedChanges.filter((c) => c.field_type === 'certification');
  const experienceChanges = detailedChanges.filter((c) => c.field_type === 'experience');
  const educationChanges = detailedChanges.filter((c) => c.field_type === 'education');
  const projectChanges = detailedChanges.filter((c) => c.field_type === 'project');
  const languageChanges = detailedChanges.filter((c) => c.field_type === 'language');
  const awardChanges = detailedChanges.filter((c) => c.field_type === 'award');

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !isConfirming) {
          onClose();
        }
      }}
    >
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col p-6 bg-card text-foreground border-2 border-border shadow-sw-lg">
        <DialogHeader className="border-b-2 border-border pb-4 bg-card -mx-6 -mt-6 px-6 pt-6">
          <DialogTitle className="font-serif text-2xl font-bold uppercase tracking-tight text-foreground">
            {t('tailor.diffModal.title')}
          </DialogTitle>
          <p className="font-mono text-xs text-muted-foreground mt-2">
            {'// '}
            {t('tailor.diffModal.subtitle')}
          </p>
        </DialogHeader>

        {/* Summary cards */}
        <div className="border-2 border-border bg-card p-4 mt-4 text-foreground">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 bg-primary"></div>
            <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-foreground">
              {t('tailor.diffModal.summary')}
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <StatCard
              label={t('tailor.diffModal.skillsAdded')}
              value={diffSummary.skills_added}
              variant="success"
            />
            <StatCard
              label={t('tailor.diffModal.skillsRemoved')}
              value={diffSummary.skills_removed}
              variant="warning"
            />
            <StatCard
              label={t('tailor.diffModal.certificationsAdded')}
              value={diffSummary.certifications_added}
              variant="info"
            />
            <StatCard
              label={t('tailor.diffModal.descriptionsModified')}
              value={diffSummary.descriptions_modified}
              variant="info"
            />
            <StatCard
              label={t('tailor.diffModal.highRiskChanges')}
              value={diffSummary.high_risk_changes}
              variant={diffSummary.high_risk_changes > 0 ? 'danger' : 'success'}
            />
          </div>

          {diffSummary.high_risk_changes > 0 && (
            <div className="mt-4 border-2 border-warning bg-amber-500/10 p-3 flex items-start gap-3 text-foreground">
              <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
              <div>
                <p className="font-mono text-xs font-bold uppercase text-amber-600 dark:text-amber-400">
                  {t('tailor.diffModal.warningTitle', {
                    count: diffSummary.high_risk_changes,
                  })}
                </p>
                <p className="font-mono text-xs text-muted-foreground mt-1">
                  {t('tailor.diffModal.warningMessage')}
                </p>
              </div>
            </div>
          )}
        </div>

        {errorMessage && (
          <div className="mt-4 border-2 border-destructive bg-destructive/10 p-3 font-mono text-xs text-destructive">
            {errorMessage}
          </div>
        )}

        {/* Changes list */}
        <div className="flex-1 overflow-y-auto mt-4 space-y-4 pr-1">
          {summaryChanges.length > 0 && (
            <ChangeSection
              title={t('tailor.diffModal.summaryChanges')}
              count={summaryChanges.length}
              isExpanded={expandedSections.has('summary')}
              onToggle={() => toggleSection('summary')}
            >
              {summaryChanges.map((change, idx) => (
                <ChangeItem key={idx} change={change} />
              ))}
            </ChangeSection>
          )}

          {skillChanges.length > 0 && (
            <ChangeSection
              title={t('tailor.diffModal.skillChanges')}
              count={skillChanges.length}
              isExpanded={expandedSections.has('skills')}
              onToggle={() => toggleSection('skills')}
            >
              {skillChanges.map((change, idx) => (
                <ChangeItem key={idx} change={change} />
              ))}
            </ChangeSection>
          )}

          {experienceChanges.length > 0 && (
            <ChangeSection
              title={t('tailor.diffModal.experienceChanges')}
              count={experienceChanges.length}
              isExpanded={expandedSections.has('experience')}
              onToggle={() => toggleSection('experience')}
            >
              {experienceChanges.map((change, idx) => (
                <ChangeItem key={idx} change={change} />
              ))}
            </ChangeSection>
          )}

          {descChanges.length > 0 && (
            <ChangeSection
              title={t('tailor.diffModal.descriptionChanges')}
              count={descChanges.length}
              isExpanded={expandedSections.has('descriptions')}
              onToggle={() => toggleSection('descriptions')}
            >
              {descChanges.map((change, idx) => (
                <ChangeItem key={idx} change={change} />
              ))}
            </ChangeSection>
          )}

          {educationChanges.length > 0 && (
            <ChangeSection
              title={t('tailor.diffModal.educationChanges')}
              count={educationChanges.length}
              isExpanded={expandedSections.has('education')}
              onToggle={() => toggleSection('education')}
            >
              {educationChanges.map((change, idx) => (
                <ChangeItem key={idx} change={change} />
              ))}
            </ChangeSection>
          )}

          {projectChanges.length > 0 && (
            <ChangeSection
              title={t('tailor.diffModal.projectChanges')}
              count={projectChanges.length}
              isExpanded={expandedSections.has('projects')}
              onToggle={() => toggleSection('projects')}
            >
              {projectChanges.map((change, idx) => (
                <ChangeItem key={idx} change={change} />
              ))}
            </ChangeSection>
          )}

          {certChanges.length > 0 && (
            <ChangeSection
              title={t('tailor.diffModal.certificationChanges')}
              count={certChanges.length}
              isExpanded={expandedSections.has('certifications')}
              onToggle={() => toggleSection('certifications')}
            >
              {certChanges.map((change, idx) => (
                <ChangeItem key={idx} change={change} />
              ))}
            </ChangeSection>
          )}

          {languageChanges.length > 0 && (
            <ChangeSection
              title={t('tailor.diffModal.languageChanges')}
              count={languageChanges.length}
              isExpanded={expandedSections.has('languages')}
              onToggle={() => toggleSection('languages')}
            >
              {languageChanges.map((change, idx) => (
                <ChangeItem key={idx} change={change} />
              ))}
            </ChangeSection>
          )}

          {awardChanges.length > 0 && (
            <ChangeSection
              title={t('tailor.diffModal.awardChanges')}
              count={awardChanges.length}
              isExpanded={expandedSections.has('awards')}
              onToggle={() => toggleSection('awards')}
            >
              {awardChanges.map((change, idx) => (
                <ChangeItem key={idx} change={change} />
              ))}
            </ChangeSection>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex justify-between items-center pt-4 border-t-2 border-border bg-secondary -mx-6 -mb-6 px-6 py-4">
          <Button variant="outline" onClick={onReject} disabled={isConfirming} className="gap-2 border-border">
            <X className="w-4 h-4" />
            {t('tailor.diffModal.rejectButton')}
          </Button>
          <div className="flex items-center gap-3">
            {isConfirming && elapsed > 0 && (
              <span className="font-mono text-xs text-muted-foreground">{elapsed}s</span>
            )}
            <Button
              onClick={onConfirm}
              disabled={isConfirming}
              className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isConfirming ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t('common.saving')}
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  {t('tailor.diffModal.confirmButton')}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Helper component: stat card
interface StatCardProps {
  label: string;
  value: number;
  variant: 'success' | 'warning' | 'danger' | 'info';
}

function StatCard({ label, value, variant }: StatCardProps) {
  const colors = {
    success: 'border-emerald-600/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    warning: 'border-amber-600/30 bg-amber-500/10 text-amber-600 dark:text-amber-400',
    danger: 'border-destructive/30 bg-destructive/10 text-destructive',
    info: 'border-primary/30 bg-primary/10 text-primary',
  };

  return (
    <div className={`border-2 p-3 ${colors[variant]}`}>
      <div className="font-mono text-2xl font-bold">{value}</div>
      <div className="font-mono text-xs uppercase tracking-wider mt-1">{label}</div>
    </div>
  );
}

// Helper component: collapsible change section
interface ChangeSectionProps {
  title: string;
  count: number;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function ChangeSection({ title, count, isExpanded, onToggle, children }: ChangeSectionProps) {
  return (
    <div className="border-2 border-border bg-card text-foreground">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-3 hover:bg-muted text-foreground transition-colors"
      >
        <div className="flex items-center gap-2">
          {isExpanded ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
          <span className="font-mono text-sm font-bold uppercase tracking-wider text-foreground">
            {title} ({count})
          </span>
        </div>
      </button>

      {isExpanded && <div className="border-t-2 border-border p-4 space-y-3 bg-muted/10">{children}</div>}
    </div>
  );
}

// Helper component: change item
interface ChangeItemProps {
  change: ResumeFieldDiff;
}

function ChangeItem({ change }: ChangeItemProps) {
  // Background tint + leading glyph instead of left-stripe borders.
  // Side-stripe borders are an impeccable absolute_ban (BAN 1) — the most
  // overused dashboard "design touch". The leading +/-/~ glyph carries the
  // semantic load and the bg tint reinforces it.
  const typeBackgrounds = {
    added: 'bg-emerald-500/10 border-emerald-500/30',
    removed: 'bg-destructive/10 border-destructive/30',
    modified: 'bg-primary/10 border-primary/30',
  };

  const typeGlyphColors = {
    added: 'text-emerald-600 dark:text-emerald-400',
    removed: 'text-destructive',
    modified: 'text-primary',
  };

  const typeLabels = {
    added: '+',
    removed: '-',
    modified: '~',
  };

  return (
    <div className={`p-3 border ${typeBackgrounds[change.change_type]}`}>
      <div className="flex items-start gap-2">
        <span
          className={`font-mono text-base font-bold uppercase tracking-wider ${typeGlyphColors[change.change_type]}`}
          aria-hidden="true"
        >
          {typeLabels[change.change_type]}
        </span>
        <div className="flex-1">
          {change.original_value && (
            <div className="line-through text-destructive font-mono text-sm mb-1">
              {change.original_value}
            </div>
          )}
          {change.new_value && (
            <div className="text-foreground font-mono text-sm">{change.new_value}</div>
          )}
        </div>
        {change.change_type === 'added' && change.confidence === 'high' && (
          <AlertTriangle className="w-4 h-4 text-warning shrink-0" />
        )}
      </div>
    </div>
  );
}
