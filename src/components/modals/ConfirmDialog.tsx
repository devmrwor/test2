import React from 'react';
import Dialog from '@mui/material/Dialog';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { XmarkXs } from '../Icons/Icons';
import { SecondaryBaseButton } from '../Buttons/SecondaryBaseButton';
import { BaseButton } from '../Buttons/BaseButton';

interface ConfirmDialogProps {
  open: boolean;
  onClose?: () => void;
  onSave: () => void;
  customText: string;
  buttonText?: string;
  warningCaption?: string;
  headerText?: string;
  onBack?: () => void;
}

export function ConfirmDialog({
  open,
  onClose = () => {},
  onSave,
  customText,
  buttonText = 'save',
  headerText,
  warningCaption,
  onBack,
}: ConfirmDialogProps) {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={onClose}>
      <div className="rounded-md">
        <div className="width-full bg-primary-100 flex justify-between px-4 py-3 items-center">
          <h3 className="text-white text-lg">{headerText || t('confirmation')}</h3>
          <button onClick={onClose} aria-label="close">
            <XmarkXs fill="white" />
          </button>
        </div>
        <div className="px-4 py-8.5">
          <p className="text-lg text-text-primary">{customText}</p>
          {warningCaption && <p className="text-lg text-red-100 ">{warningCaption}</p>}
        </div>
        <div className="flex gap-2 p-4">
          <BaseButton
            classes="w-full justify-center"
            onClick={onSave}
            type="solid"
            size="large"
            variant=""
            color="success"
            fullWidth
            text={t(buttonText)}
          ></BaseButton>

          <SecondaryBaseButton
            classes="w-full justify-center"
            type="outline"
            size="large"
            color="secondary"
            onClick={onBack || (() => router.back())}
            text={t('no')}
          ></SecondaryBaseButton>

          <SecondaryBaseButton
            classes="w-full justify-center"
            type="outline"
            size="large"
            color="secondary"
            onClick={onClose}
            text={t('cancel')}
          ></SecondaryBaseButton>
        </div>
      </div>
    </Dialog>
  );
}
