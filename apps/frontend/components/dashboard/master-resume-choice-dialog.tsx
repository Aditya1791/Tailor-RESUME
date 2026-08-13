'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useTranslations } from '@/lib/i18n';
import Upload from 'lucide-react/dist/esm/icons/upload';
import Bot from 'lucide-react/dist/esm/icons/bot';

interface MasterResumeChoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChooseUpload: () => void;
  onChooseWizard: () => void;
}

export function MasterResumeChoiceDialog({
  open,
  onOpenChange,
  onChooseUpload,
  onChooseWizard,
}: MasterResumeChoiceDialogProps) {
  const { t } = useTranslations();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-card text-foreground border-2 border-border shadow-sw-lg p-0 gap-0 rounded-none">
        <DialogHeader className="border-b-2 border-border bg-card p-6 text-left">
          <p className="font-mono text-xs font-bold uppercase tracking-wider text-primary">
            {t('resumeWizard.entry.kicker')}
          </p>
          <DialogTitle className="font-serif text-3xl font-bold uppercase tracking-normal text-foreground">
            {t('resumeWizard.entry.title')}
          </DialogTitle>
          <DialogDescription className="font-sans text-sm text-muted-foreground">
            {t('resumeWizard.entry.description')}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 bg-background p-6 md:grid-cols-2">
          <section className="flex min-h-64 flex-col border-2 border-border bg-card p-5 text-foreground">
            <div className="mb-6 flex h-12 w-12 items-center justify-center border-2 border-border bg-muted">
              <Upload className="h-6 w-6 text-foreground" aria-hidden="true" />
            </div>
            <p className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {t('resumeWizard.entry.upload.kicker')}
            </p>
            <h3 className="mt-2 font-serif text-2xl font-bold leading-tight text-foreground">
              {t('resumeWizard.entry.upload.title')}
            </h3>
            <p className="mt-3 font-sans text-sm text-muted-foreground">
              {t('resumeWizard.entry.upload.description')}
            </p>
            <Button variant="outline" className="mt-auto w-full" onClick={onChooseUpload}>
              {t('resumeWizard.entry.upload.action')}
            </Button>
          </section>

          <section className="flex min-h-64 flex-col border-2 border-border bg-card p-5 shadow-sw-sm text-foreground">
            <div className="mb-6 flex h-12 w-12 items-center justify-center border-2 border-border bg-primary text-primary-foreground">
              <Bot className="h-6 w-6" aria-hidden="true" />
            </div>
            <p className="font-mono text-xs font-bold uppercase tracking-wider text-primary">
              {t('resumeWizard.entry.wizard.kicker')}
            </p>
            <h3 className="mt-2 font-serif text-2xl font-bold leading-tight text-foreground">
              {t('resumeWizard.entry.wizard.title')}
            </h3>
            <p className="mt-3 font-sans text-sm text-muted-foreground">
              {t('resumeWizard.entry.wizard.description')}
            </p>
            <Button className="mt-auto w-full" onClick={onChooseWizard}>
              {t('resumeWizard.entry.wizard.action')}
            </Button>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
