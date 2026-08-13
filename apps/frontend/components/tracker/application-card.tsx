'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import GripVertical from 'lucide-react/dist/esm/icons/grip-vertical';
import Layers from 'lucide-react/dist/esm/icons/layers';
import { Card } from '@/components/ui/card';
import { useTranslations } from '@/lib/i18n';
import type { Application } from '@/lib/api/tracker';

interface ApplicationCardProps {
  application: Application;
  selected: boolean;
  sharedResume: boolean;
  onToggleSelect: (id: string) => void;
  onOpen: (id: string) => void;
}

export function ApplicationCard({
  application,
  selected,
  sharedResume,
  onToggleSelect,
  onOpen,
}: ApplicationCardProps) {
  const { t } = useTranslations();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: application.application_id,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const company = application.company?.trim();
  const role = application.role?.trim();

  return (
    <div ref={setNodeRef} style={style}>
      <Card
        variant="interactive"
        noPadding
        className={`p-3 ${selected ? 'ring-2 ring-primary' : ''}`}
      >
        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            checked={selected}
            onChange={() => onToggleSelect(application.application_id)}
            onClick={(e) => e.stopPropagation()}
            aria-label={t('tracker.card.selectAria')}
            className="mt-1 h-4 w-4 shrink-0 rounded-none border-border accent-primary"
          />

          <button
            type="button"
            onClick={() => onOpen(application.application_id)}
            className="min-w-0 flex-1 text-left"
          >
            <p className="truncate text-sm font-semibold text-foreground">
              {company || t('tracker.card.companyUnknown')}
            </p>
            <p className="truncate font-mono text-xs text-muted-foreground">
              {role || t('tracker.card.roleUnknown')}
            </p>
            {application.applied_at && (
              <p className="mt-1 font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
                {new Date(application.applied_at).toLocaleDateString()}
              </p>
            )}
            {sharedResume && (
              <span className="mt-1 inline-flex items-center gap-1 border border-border bg-muted/60 px-1 font-mono text-[10px] uppercase text-muted-foreground">
                <Layers className="h-3 w-3 text-primary" />
                {t('tracker.card.sharedResume')}
              </span>
            )}
          </button>

          <button
            type="button"
            className="mt-0.5 shrink-0 cursor-grab text-muted-foreground hover:text-foreground active:cursor-grabbing"
            aria-label={t('tracker.card.dragAria')}
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-4 w-4" />
          </button>
        </div>
      </Card>
    </div>
  );
}
