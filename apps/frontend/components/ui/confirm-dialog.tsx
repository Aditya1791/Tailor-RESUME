'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './dialog';
import { Button } from './button';
import { useTranslations } from '@/lib/i18n';

/**
 * Swiss International Style Confirm Dialog Component
 *
 * A modal dialog for confirming user actions with semantic variants:
 * - danger: Destructive actions (delete, remove)
 * - warning: Caution actions (reset, overwrite)
 * - success: Positive confirmations
 * - default: Neutral confirmations
 */

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  errorMessage?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmDisabled?: boolean;
  variant?: 'danger' | 'warning' | 'success' | 'default';
  closeOnConfirm?: boolean;
  onConfirm: () => void;
  onCancel?: () => void;
  showCancelButton?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  errorMessage,
  confirmLabel,
  cancelLabel,
  confirmDisabled = false,
  variant = 'default',
  closeOnConfirm = true,
  onConfirm,
  onCancel,
  showCancelButton = true,
}) => {
  const { t } = useTranslations();
  const finalConfirmLabel = confirmLabel ?? t('common.confirm');
  const finalCancelLabel = cancelLabel ?? t('common.cancel');

  const handleConfirm = () => {
    if (confirmDisabled) return;
    onConfirm();
    if (closeOnConfirm) {
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  const variantStyles = {
    danger: {
      icon: (
        <div className="w-12 h-12 border-2 border-destructive bg-destructive/10 flex items-center justify-center">
          <span className="text-destructive text-2xl font-bold">!</span>
        </div>
      ),
      buttonVariant: 'destructive' as const,
    },
    warning: {
      icon: (
        <div className="w-12 h-12 border-2 border-amber-600 bg-amber-500/10 flex items-center justify-center">
          <span className="text-amber-600 dark:text-amber-400 text-2xl font-bold">!</span>
        </div>
      ),
      buttonVariant: 'warning' as const,
    },
    success: {
      icon: (
        <div className="w-12 h-12 border-2 border-emerald-600 bg-emerald-500/10 flex items-center justify-center">
          <span className="text-emerald-600 dark:text-emerald-400 text-2xl font-bold">&#10003;</span>
        </div>
      ),
      buttonVariant: 'success' as const,
    },
    default: {
      icon: (
        <div className="w-12 h-12 border-2 border-primary bg-primary/10 flex items-center justify-center">
          <span className="text-primary text-2xl font-bold">?</span>
        </div>
      ),
      buttonVariant: 'default' as const,
    },
  };

  const { icon, buttonVariant } = variantStyles[variant];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] p-0 gap-0 border border-border bg-card text-foreground">
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-start gap-4">
            {icon}
            <div className="min-w-0 flex-1">
              <DialogTitle className="font-serif text-xl font-bold uppercase tracking-tight text-foreground">
                {title}
              </DialogTitle>
              <DialogDescription className="font-mono text-xs text-muted-foreground mt-2 max-h-60 overflow-y-auto whitespace-pre-wrap [overflow-wrap:anywhere]">
                {description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        {errorMessage && (
          <div className="px-6 pb-4">
            <div className="border-2 border-destructive bg-destructive/10 p-3 font-mono text-xs text-destructive max-h-60 overflow-y-auto whitespace-pre-wrap [overflow-wrap:anywhere]">
              {errorMessage}
            </div>
          </div>
        )}
        <DialogFooter className="p-4 bg-secondary border-t border-border flex-row justify-end gap-3">
          {showCancelButton && (
            <Button variant="outline" onClick={handleCancel} className="rounded-none border-border">
              {finalCancelLabel}
            </Button>
          )}
          <Button
            variant={buttonVariant}
            onClick={handleConfirm}
            className="rounded-none"
            disabled={confirmDisabled}
          >
            {finalConfirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
