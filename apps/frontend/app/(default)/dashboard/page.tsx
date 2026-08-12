'use client';

import { SwissGrid } from '@/components/home/swiss-grid';
import { ResumeUploadDialog } from '@/components/dashboard/resume-upload-dialog';
import { MasterResumeChoiceDialog } from '@/components/dashboard/master-resume-choice-dialog';
import { useState, useEffect, useCallback, useRef, type KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { useTranslations } from '@/lib/i18n';

// Optimized Imports for Performance (No Barrel Imports)
import Loader2 from 'lucide-react/dist/esm/icons/loader-2';
import AlertCircle from 'lucide-react/dist/esm/icons/alert-circle';
import RefreshCw from 'lucide-react/dist/esm/icons/refresh-cw';
import Plus from 'lucide-react/dist/esm/icons/plus';
import Settings from 'lucide-react/dist/esm/icons/settings';
import AlertTriangle from 'lucide-react/dist/esm/icons/alert-triangle';
import FileText from 'lucide-react/dist/esm/icons/file-text';
import Sparkles from 'lucide-react/dist/esm/icons/sparkles';
import Wand2 from 'lucide-react/dist/esm/icons/wand-2';
import CheckCircle2 from 'lucide-react/dist/esm/icons/check-circle-2';

import {
  fetchResume,
  fetchResumeList,
  deleteResume,
  retryProcessing,
  fetchJobDescription,
  type ResumeListItem,
} from '@/lib/api/resume';
import { useStatusCache } from '@/lib/context/status-cache';

type ProcessingStatus = 'pending' | 'processing' | 'ready' | 'failed' | 'loading';

export default function DashboardPage() {
  const { t, locale } = useTranslations();
  const [masterResumeId, setMasterResumeId] = useState<string | null>(null);
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus>('loading');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [tailoredResumes, setTailoredResumes] = useState<ResumeListItem[]>([]);
  const [isRetrying, setIsRetrying] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isMasterChoiceDialogOpen, setIsMasterChoiceDialogOpen] = useState(false);
  const router = useRouter();

  // Status cache for optimistic counter updates and LLM status check
  const {
    status: systemStatus,
    isLoading: statusLoading,
    incrementResumes,
    decrementResumes,
    setHasMasterResume,
  } = useStatusCache();

  const loadRequestIdRef = useRef(0);
  const jobSnippetCacheRef = useRef<Record<string, string>>({});

  const isLlmConfigured = !statusLoading && systemStatus?.llm_configured;

  const isTailorEnabled =
    Boolean(masterResumeId) && processingStatus === 'ready' && isLlmConfigured;

  const formatDate = (value: string) => {
    if (!value) return t('common.unknown') || 'Unknown';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return t('common.unknown') || 'Unknown';

    return date.toLocaleDateString(locale, {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
  };

  const checkResumeStatus = useCallback(async (resumeId: string) => {
    try {
      setProcessingStatus('loading');
      const data = await fetchResume(resumeId);
      const status = data.raw_resume?.processing_status || 'pending';
      setProcessingStatus(status as ProcessingStatus);
    } catch (err: unknown) {
      console.error('Failed to check resume status:', err);
      if (err instanceof Error && err.message.includes('404')) {
        localStorage.removeItem('master_resume_id');
        setMasterResumeId(null);
        return;
      }
      setProcessingStatus('failed');
    }
  }, []);

  useEffect(() => {
    const storedId = localStorage.getItem('master_resume_id');
    if (storedId) {
      setMasterResumeId(storedId);
      checkResumeStatus(storedId);
    }
  }, [checkResumeStatus]);

  const loadTailoredResumes = useCallback(async () => {
    try {
      const data = await fetchResumeList(true);
      const masterFromList = data.find((r) => r.is_master);
      const storedId = localStorage.getItem('master_resume_id');
      const resolvedMasterId = masterFromList?.resume_id || storedId;

      if (resolvedMasterId) {
        localStorage.setItem('master_resume_id', resolvedMasterId);
        setMasterResumeId(resolvedMasterId);
        checkResumeStatus(resolvedMasterId);
      } else {
        localStorage.removeItem('master_resume_id');
        setMasterResumeId(null);
      }

      const filtered = data.filter((r) => r.resume_id !== resolvedMasterId);
      setTailoredResumes(filtered);

      const tailoredWithParent = filtered.filter((r) => r.parent_id);
      const requestId = ++loadRequestIdRef.current;
      const jobSnippets: Record<string, string> = {};

      await Promise.all(
        tailoredWithParent.map(async (r) => {
          if (jobSnippetCacheRef.current[r.resume_id]) {
            jobSnippets[r.resume_id] = jobSnippetCacheRef.current[r.resume_id];
            return;
          }
          try {
            const jd = await fetchJobDescription(r.resume_id);
            const snippet = (jd?.content || '').slice(0, 80);
            jobSnippetCacheRef.current[r.resume_id] = snippet;
            jobSnippets[r.resume_id] = snippet;
          } catch {
            jobSnippetCacheRef.current[r.resume_id] = '';
            jobSnippets[r.resume_id] = '';
          }
        })
      );

      if (requestId === loadRequestIdRef.current) {
        setTailoredResumes((prev) =>
          prev.map((r) => ({ ...r, jobSnippet: jobSnippets[r.resume_id] || '' }))
        );
      }
    } catch (err) {
      console.error('Failed to load tailored resumes:', err);
    }
  }, [checkResumeStatus]);

  useEffect(() => {
    loadTailoredResumes();
  }, [loadTailoredResumes]);

  useEffect(() => {
    const handleFocus = () => {
      loadTailoredResumes();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [loadTailoredResumes, checkResumeStatus]);

  const handleUploadComplete = (resumeId: string) => {
    localStorage.setItem('master_resume_id', resumeId);
    setMasterResumeId(resumeId);
    checkResumeStatus(resumeId);
    incrementResumes();
    setHasMasterResume(true);
  };

  const handleChooseUpload = () => {
    setIsMasterChoiceDialogOpen(false);
    setIsUploadDialogOpen(true);
  };

  const handleChooseWizard = () => {
    setIsMasterChoiceDialogOpen(false);
    router.push('/resume-wizard');
  };

  const handleInitializeMasterKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsMasterChoiceDialogOpen(true);
    }
  };

  const handleRetryProcessing = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!masterResumeId) return;
    setIsRetrying(true);
    try {
      const result = await retryProcessing(masterResumeId);
      if (result.processing_status === 'ready') {
        setProcessingStatus('ready');
      } else if (
        result.processing_status === 'processing' ||
        result.processing_status === 'pending'
      ) {
        setProcessingStatus(result.processing_status);
      } else {
        setProcessingStatus('failed');
      }
    } catch (err) {
      console.error('Retry processing failed:', err);
      setProcessingStatus('failed');
    } finally {
      setIsRetrying(false);
    }
  };

  const handleDeleteAndReupload = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const confirmDeleteAndReupload = async () => {
    if (!masterResumeId) return;
    try {
      await deleteResume(masterResumeId);
      decrementResumes();
      setHasMasterResume(false);
      localStorage.removeItem('master_resume_id');
      setMasterResumeId(null);
      setProcessingStatus('loading');
      setIsUploadDialogOpen(true);
      await loadTailoredResumes();
    } catch (err) {
      console.error('Failed to delete resume:', err);
    }
  };

  const getStatusDisplay = () => {
    switch (processingStatus) {
      case 'loading':
        return {
          text: t('dashboard.status.checking') || 'Checking...',
          icon: <Loader2 className="w-3.5 h-3.5 animate-spin" />,
          color: 'text-muted-foreground',
        };
      case 'processing':
        return {
          text: t('dashboard.status.processing') || 'Parsing...',
          icon: <Loader2 className="w-3.5 h-3.5 animate-spin" />,
          color: 'text-primary',
        };
      case 'ready':
        return {
          text: t('dashboard.status.ready') || 'Ready',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />,
          color: 'text-emerald-600 dark:text-emerald-400',
        };
      case 'failed':
        return {
          text: t('dashboard.status.failed') || 'Failed',
          icon: <AlertCircle className="w-3.5 h-3.5 text-red-500" />,
          color: 'text-red-600 dark:text-red-400',
        };
      default:
        return {
          text: t('dashboard.status.pending') || 'Pending',
          icon: null,
          color: 'text-muted-foreground',
        };
    }
  };

  const getMonogram = (title: string): string => {
    const words = title.split(/\s+/).filter((w) => /^[a-zA-Z]/.test(w));
    return words
      .slice(0, 3)
      .map((w) => w.charAt(0).toUpperCase())
      .join('');
  };

  const cardPalette = [
    { bg: '#1D4ED8', fg: '#FFFFFF' },
    { bg: '#15803D', fg: '#FFFFFF' },
    { bg: '#0F172A', fg: '#FFFFFF' },
    { bg: '#B45309', fg: '#FFFFFF' },
    { bg: '#7C3AED', fg: '#FFFFFF' },
    { bg: '#0E7490', fg: '#FFFFFF' },
    { bg: '#B91C1C', fg: '#FFFFFF' },
    { bg: '#4338CA', fg: '#FFFFFF' },
  ];

  const hashTitle = (title: string): number => {
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
      hash = (hash << 5) - hash + title.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  };

  return (
    <div className="space-y-6">
      {/* Quick Metrics Bar */}
      <div className="max-w-[86rem] mx-auto px-4 md:px-8 pt-6 grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3.5 shadow-xs">
          <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-mono uppercase text-muted-foreground">Master Resume</div>
            <div className="text-sm font-mono font-bold text-foreground">
              {masterResumeId ? (processingStatus === 'ready' ? 'Active & Ready' : processingStatus) : 'Not Uploaded'}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3.5 shadow-xs">
          <div className="h-10 w-10 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-mono uppercase text-muted-foreground">Tailored Versions</div>
            <div className="text-sm font-mono font-bold text-foreground">{tailoredResumes.length} Generated</div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3.5 shadow-xs">
          <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-mono uppercase text-muted-foreground">AI Status</div>
            <div className="text-sm font-mono font-bold text-foreground">
              {isLlmConfigured ? 'Provider Ready' : 'Setup Required'}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3.5 shadow-xs">
          <div className="h-10 w-10 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
            <Wand2 className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-mono uppercase text-muted-foreground">Quick Action</div>
            <Link href="/tailor" className="text-sm font-mono font-bold text-primary hover:underline">
              Start Tailoring →
            </Link>
          </div>
        </div>
      </div>

      {/* Configuration Warning Banner */}
      {masterResumeId && !isLlmConfigured && !statusLoading && (
        <div className="max-w-[86rem] mx-auto px-4 md:px-8">
          <div className="border border-amber-500/30 bg-amber-500/10 rounded-xl p-4 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <div>
                <p className="font-mono text-sm font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                  {t('dashboard.llmNotConfiguredTitle') || 'AI Provider Not Configured'}
                </p>
                <p className="font-mono text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                  {t('dashboard.llmNotConfiguredMessage') || 'Please add your API key in settings to enable AI resume tailoring.'}
                </p>
              </div>
            </div>
            <Link href="/settings">
              <Button variant="outline" size="sm" className="border-amber-500/40 text-amber-800 dark:text-amber-300">
                <Settings className="w-4 h-4 mr-2" />
                {t('nav.settings') || 'Settings'}
              </Button>
            </Link>
          </div>
        </div>
      )}

      <SwissGrid>
        {/* 1. Master Resume Logic */}
        {!masterResumeId ? (
          !isLlmConfigured && !statusLoading ? (
            <Link href="/settings" className="block h-full">
              <Card
                variant="interactive"
                className="aspect-square h-full border-dashed border-amber-500/40 bg-amber-500/5 rounded-xl flex flex-col justify-between p-6"
              >
                <div className="w-12 h-12 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-4">
                  <AlertTriangle className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <CardTitle className="text-base uppercase text-amber-800 dark:text-amber-300 mb-2">
                    {t('dashboard.setupRequiredTitle') || 'Setup Required'}
                  </CardTitle>
                  <CardDescription className="text-amber-700 dark:text-amber-400 text-xs">
                    {t('dashboard.setupRequiredMessage') || 'Configure AI credentials in settings to start uploading and tailoring resumes.'}
                  </CardDescription>
                  <div className="flex items-center gap-2 mt-4 text-amber-800 dark:text-amber-300 font-mono text-xs font-bold uppercase">
                    <Settings className="w-4 h-4" />
                    <span>{t('nav.goToSettings') || 'Go to Settings'}</span>
                  </div>
                </div>
              </Card>
            </Link>
          ) : (
            <>
              <Card
                variant="interactive"
                className="aspect-square h-full hover:border-primary hover:bg-primary/5 rounded-xl cursor-pointer p-6 flex flex-col justify-between"
                role="button"
                tabIndex={0}
                aria-label={t('dashboard.initializeMasterResume') || 'Initialize Master Resume'}
                onClick={() => setIsMasterChoiceDialogOpen(true)}
                onKeyDown={handleInitializeMasterKeyDown}
              >
                <div className="w-12 h-12 rounded-lg border border-border bg-muted/40 flex items-center justify-center mb-4 text-primary">
                  <Plus className="w-6 h-6" />
                </div>
                <div>
                  <CardTitle className="text-base uppercase text-foreground">
                    {t('dashboard.initializeMasterResume') || 'Initialize Master Resume'}
                  </CardTitle>
                  <CardDescription className="mt-1 text-xs text-muted-foreground">
                    Upload a PDF/DOCX or build with the AI Resume Wizard.
                  </CardDescription>
                </div>
              </Card>
              <MasterResumeChoiceDialog
                open={isMasterChoiceDialogOpen}
                onOpenChange={setIsMasterChoiceDialogOpen}
                onChooseUpload={handleChooseUpload}
                onChooseWizard={handleChooseWizard}
              />
              <ResumeUploadDialog
                open={isUploadDialogOpen}
                onOpenChange={setIsUploadDialogOpen}
                onUploadComplete={handleUploadComplete}
                trigger={
                  <button type="button" className="hidden" tabIndex={-1} aria-hidden="true" />
                }
              />
            </>
          )
        ) : (
          <Card
            variant="interactive"
            className="aspect-square h-full rounded-xl p-6 flex flex-col justify-between relative group cursor-pointer"
            onClick={() => router.push(`/resumes/${masterResumeId}`)}
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-lg bg-primary text-primary-foreground font-mono font-black text-base flex items-center justify-center shadow-xs">
                  M
                </div>
                {(processingStatus === 'failed' || processingStatus === 'processing') && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-muted text-foreground"
                    onClick={handleRetryProcessing}
                    disabled={isRetrying}
                    aria-label={t('dashboard.retryProcessing') || 'Retry'}
                  >
                    {isRetrying ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4" />
                    )}
                  </Button>
                )}
              </div>

              <CardTitle className="text-base font-mono uppercase text-foreground group-hover:text-primary transition-colors">
                {t('dashboard.masterResume') || 'Master Resume'}
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1">Source base resume for tailoring.</p>
            </div>

            <div className="pt-4 border-t border-border/60">
              <div className={`text-xs font-mono flex items-center gap-1.5 uppercase ${getStatusDisplay().color}`}>
                {getStatusDisplay().icon}
                <span>{getStatusDisplay().text}</span>
              </div>
              {(processingStatus === 'failed' || processingStatus === 'processing') && (
                <div className="flex gap-2 mt-3" onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-7 rounded-md"
                    onClick={handleRetryProcessing}
                    disabled={isRetrying}
                  >
                    Retry
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-7 rounded-md border-red-500 text-red-500 hover:bg-red-500/10"
                    onClick={handleDeleteAndReupload}
                  >
                    Re-upload
                  </Button>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* 2. Tailored Resumes */}
        {tailoredResumes.map((resume) => {
          const title =
            resume.title || resume.jobSnippet || resume.filename || t('dashboard.tailoredResume') || 'Tailored Resume';
          const color = cardPalette[hashTitle(title) % cardPalette.length];
          return (
            <Card
              key={resume.resume_id}
              variant="interactive"
              className="aspect-square h-full rounded-xl p-6 flex flex-col justify-between cursor-pointer group"
              onClick={() => router.push(`/resumes/${resume.resume_id}`)}
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shadow-xs font-mono font-bold text-xs"
                    style={{ backgroundColor: color.bg, color: color.fg }}
                  >
                    {getMonogram(title)}
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground uppercase px-2 py-0.5 rounded bg-muted/60">
                    {resume.processing_status}
                  </span>
                </div>
                <CardTitle className="text-sm font-sans font-bold leading-snug line-clamp-2 text-foreground group-hover:text-primary transition-colors">
                  {title}
                </CardTitle>
              </div>
              <CardDescription className="pt-4 text-[11px] font-mono text-muted-foreground uppercase border-t border-border/60">
                {t('dashboard.edited', {
                  date: formatDate(resume.updated_at || resume.created_at),
                }) || `Updated ${formatDate(resume.updated_at || resume.created_at)}`}
              </CardDescription>
            </Card>
          );
        })}

        {/* 3. Create Tailored Resume Card */}
        <Card className="aspect-square h-full rounded-xl border-dashed border-border flex flex-col items-center justify-center p-6 text-center" variant="default">
          <Button
            onClick={() => router.push('/tailor')}
            disabled={!isTailorEnabled}
            className="w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-md hover:bg-primary/90 hover:scale-105 transition-all mb-3 flex items-center justify-center"
          >
            <Plus className="w-6 h-6" />
          </Button>
          <div className="text-xs font-mono font-bold uppercase text-foreground">
            {t('dashboard.createResume') || 'Tailor New Resume'}
          </div>
          <div className="text-[10px] text-muted-foreground mt-1">Match with job description</div>
        </Card>

        <ConfirmDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          title={t('confirmations.deleteMasterResumeTitle') || 'Delete Master Resume?'}
          description={t('confirmations.deleteMasterResumeDescription') || 'This will remove the current master resume and all associated tailoring history.'}
          confirmLabel={t('dashboard.deleteAndReupload') || 'Delete and Re-upload'}
          cancelLabel={t('confirmations.keepResumeCancelLabel') || 'Cancel'}
          onConfirm={confirmDeleteAndReupload}
          variant="danger"
        />
      </SwissGrid>
    </div>
  );
}
