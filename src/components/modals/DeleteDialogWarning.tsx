import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { XmarkXs } from '../Icons/Icons';

interface DeleteDialogProps {
  open: boolean;
  onClose?: () => void;
  onSave: () => void;
  customText: string;
  buttonText?: string;
}

export function DeleteDialog({ open, onClose = () => {}, onSave, customText, buttonText = 'Save' }: DeleteDialogProps) {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={onClose}>
      <div className="width-full bg-primary-100 flex justify-between px-4 py-2 items-center">
        <h3 className="text-white">{t('confirmation')}</h3>
        <button onClick={onClose} aria-label="close">
          <XmarkXs fill="white" />
        </button>
      </div>
      <DialogContent>
        <p>{customText}</p>
      </DialogContent>
      <div className="flex gap-2 p-4">
        <Button fullWidth onClick={onSave} color="info" variant="contained">
          {buttonText}
        </Button>
        {/* @ts-ignore */}
        <Button fullWidth onClick={onClose} color="disabled" variant="outlined">
          {t('no')}
        </Button>
        {/* @ts-ignore */}
        <Button fullWidth onClick={onClose} color="disabled" variant="outlined">
          {t('cancel')}
        </Button>
      </div>
    </Dialog>
  );
}
