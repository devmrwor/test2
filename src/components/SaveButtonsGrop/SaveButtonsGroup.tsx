import { useTranslation } from 'next-i18next';
import { BaseButton } from '../Buttons/BaseButton';
import { SecondaryBaseButton } from '../Buttons/SecondaryBaseButton';

interface SaveButtonGroupProps {
  onSave: () => void;
  onCancel: () => void;
  isLoading: boolean;
  submitRef?: React.RefObject<HTMLButtonElement>;
  wrapperClassName?: string;
}

export const SaveButtonsGroup = ({
  onSave,
  onCancel,
  isLoading,
  wrapperClassName,
  submitRef,
}: SaveButtonGroupProps) => {
  const { t } = useTranslation();
  return (
    <div className={wrapperClassName || 'mt-11.5 justify-between flex w-full mx-auto gap-4'}>
      <BaseButton
        classes="w-full justify-center"
        onClick={onSave}
        type="solid"
        size="large"
        variant=""
        color="success"
        fullWidth
        disabled={isLoading}
        text={isLoading ? t('loading') : t('save')}
      ></BaseButton>

      <SecondaryBaseButton
        classes="w-full justify-center"
        type="outline"
        size="large"
        color="secondary"
        disabled={isLoading}
        onClick={onCancel}
        text={t('cancel')}
      ></SecondaryBaseButton>
      {submitRef && <button className="hidden" ref={submitRef} type="submit"></button>}
    </div>
  );
};
