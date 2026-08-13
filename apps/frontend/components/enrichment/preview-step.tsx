'use client';

import { Button } from '@/components/ui/button';
import { Check, X, Briefcase, FolderKanban } from 'lucide-react';
import type { EnhancedDescription } from '@/lib/api/enrichment';
import { useTranslations } from '@/lib/i18n';

interface PreviewStepProps {
  enhancements: EnhancedDescription[];
  onApply: () => void;
  onCancel: () => void;
}

export function PreviewStep({ enhancements, onApply, onCancel }: PreviewStepProps) {
  const { t } = useTranslations();
  return (
    <div className="flex flex-col h-full text-foreground">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2 text-foreground">{t('enrichment.preview.title')}</h2>
        <p className="text-muted-foreground font-mono text-sm">{t('enrichment.preview.description')}</p>
      </div>

      {/* Enhancements list */}
      <div className="flex-1 overflow-y-auto space-y-6 pr-2">
        {enhancements.map((enhancement) => (
          <EnhancementCard key={enhancement.item_id} enhancement={enhancement} />
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-6 border-t border-border mt-6">
        <Button variant="outline" onClick={onCancel} className="gap-2 border-border">
          <X className="w-4 h-4" />
          {t('common.cancel')}
        </Button>
        <Button onClick={onApply} className="gap-2">
          <Check className="w-4 h-4" />
          {t('enrichment.preview.applyButton')}
        </Button>
      </div>
    </div>
  );
}

interface EnhancementCardProps {
  enhancement: EnhancedDescription;
}

function EnhancementCard({ enhancement }: EnhancementCardProps) {
  const { t } = useTranslations();
  const itemTypeLabel =
    enhancement.item_type === 'experience'
      ? t('enrichment.itemType.experience')
      : t('enrichment.itemType.project');

  return (
    <div className="border-2 border-border bg-card text-foreground shadow-sw-default">
      {/* Card header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-secondary">
        {enhancement.item_type === 'experience' ? (
          <Briefcase className="w-4 h-4 text-primary" />
        ) : (
          <FolderKanban className="w-4 h-4 text-primary" />
        )}
        <span className="font-mono text-sm font-bold uppercase text-foreground">{itemTypeLabel}</span>
        <span className="text-muted-foreground">|</span>
        <span className="font-semibold text-foreground">{enhancement.title}</span>
      </div>

      {/* Content preview */}
      <div className="p-4">
        <div className="space-y-4">
          {/* Existing bullets - keeping */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono font-bold uppercase text-muted-foreground">
                {t('enrichment.preview.keepingLabel')}
              </span>
              <span className="text-xs text-muted-foreground">
                {t('enrichment.preview.existingCount', {
                  count: enhancement.original_description.length,
                })}
              </span>
            </div>
            <ul className="space-y-2">
              {enhancement.original_description.map((bullet, i) => (
                <li key={i} className="text-sm text-foreground pl-4">
                  {bullet}
                </li>
              ))}
              {enhancement.original_description.length === 0 && (
                <li className="text-sm text-muted-foreground italic">
                  {t('enrichment.preview.noExistingDescription')}
                </li>
              )}
            </ul>
          </div>

          {/* New bullets - adding */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono font-bold uppercase text-emerald-600 dark:text-emerald-400">
                {t('enrichment.preview.addingLabel')}
              </span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400">
                {t('enrichment.preview.newCount', {
                  count: enhancement.enhanced_description.length,
                })}
              </span>
            </div>
            <ul className="space-y-2">
              {enhancement.enhanced_description.map((bullet, i) => (
                <li
                  key={i}
                  className="text-sm text-foreground pl-4 bg-emerald-500/10 py-1 pr-2 border border-emerald-500/30"
                >
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
