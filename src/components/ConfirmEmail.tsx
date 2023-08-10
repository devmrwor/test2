import { BackHeader } from './primitives/BackHeader/BackHeader';
import { useTranslation } from 'next-i18next';
import { useClientContext } from '@/contexts/clientContext';
import { useState } from 'react';
import { TextField } from '@mui/material';
import { CustomCheckbox } from './Checkbox/Checkbox';
import { uniteApiRoutes } from '@/utils/uniteRoute';
import { ApiEmailSubRoutes, ApiRoutes } from '../../common/enums/api-routes';
import { DoneIcon } from './Icons/Icons';
import { useRouter } from 'next/router';
import { ClientRoutes } from '../../common/enums/api-routes';
import { uniteRoutes } from '@/utils/uniteRoute';
import { secondary } from '@/themes/colors';

interface ConfirmEmailProps {
  email?: string;
  onClose: () => void;
}

export const ConfirmEmail = ({ email: emailProp, onClose }: ConfirmEmailProps) => {
  const { t, i18n } = useTranslation();
  const { refetchUserData } = useClientContext();
  const [email, setEmail] = useState(emailProp || '');
  const [confirmTerms, setConfirmTerms] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailResponse, setEmailResponse] = useState(false);
  const router = useRouter();

  const handleBack = async () => {
    !emailProp ? await refetchUserData() : router.replace(uniteRoutes([ClientRoutes.CLIENT, ClientRoutes.LOGIN]));
    onClose();
  };

  const handleEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleConfirmTerms = () => {
    setConfirmTerms(!confirmTerms);
  };

  const handleSendEmail = async () => {
    setEmailSent(true);
    try {
      const response = await fetch(
        uniteApiRoutes([ApiRoutes.EMAIL, ApiEmailSubRoutes.GENERATE_TOKEN, ApiEmailSubRoutes.USER], {
          lang: i18n.language,
          client: emailProp ? 'true' : 'false',
        }),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        }
      );
      if (response.ok) {
        console.log(await response.json());
        setEmailSent(false);
        setEmailResponse(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleProceedVerification = () => {
    handleSendEmail();
  };

  return (
    <div>
      <BackHeader heading={t('email_confirmation')} onClick={handleBack} />
      <div className="mt-2.5 mb-4.75 -mx-4.5 border-background-decorative border-b"></div>
      {emailResponse ? (
        <div className="text-text-tertiary text-center">
          <div className="w-29.25 h-29.25 bg-background mt-[43.27px] mb-[29.7px] rounded-full mx-auto flex items-center justify-center">
            {<DoneIcon />}
          </div>
          <p>{t('check_your_email')}</p>
          <div className="text-center mt-5.75 mb-7.5">
            <p>{t('check_email_text')}</p>
            <p className="text-primary-100">{email}</p>
            <p>{t('email_instructions')}</p>
          </div>
          <button
            onClick={handleProceedVerification}
            className="w-full border border-primary-100 text-primary-100 pt-2 pb-1.75 rounded"
          >
            {t('resend')}
          </button>
        </div>
      ) : (
        <>
          <p className="text-text-tertiary mb-[12.3px]">
            {t(emailProp ? 'click_submit_button' : 'email_confirmation_instruction')}
          </p>

          <TextField
            disabled={!!emailProp}
            fullWidth
            variant="outlined"
            size="small"
            placeholder="example@gmail.com"
            value={emailProp}
            onChange={handleEmail}
            sx={{
              backgroundColor: '#f3f3f3',
              '& .MuiInputBase-colorPrimary': {
                color: secondary.value,
              },
            }}
          />
          <div className="flex -ml-[10px] mt-1.5 items-start">
            <CustomCheckbox checked={confirmTerms} onChange={handleConfirmTerms} />
            <p className="mt-1.25 max-w-[310px] text-text-tertiary">{t('email_confirmation_text')}</p>
          </div>
          <button
            onClick={handleSendEmail}
            disabled={emailSent || !confirmTerms}
            className={`w-full mt-8 mb-[21.9px] pt-2 pb-1.75 rounded border  ${emailSent && 'bg-background'} ${
              confirmTerms
                ? `text-white ${
                    emailSent ? 'bg-darken-background border-darken-background' : 'bg-primary-100 border-primary-100'
                  }`
                : 'text-text-disabled bg-white darken-background'
            } `}
          >
            {t('send')}
          </button>
          <p className="text-text-tertiary pr-4">{t('email_confirmation_warning')}</p>
        </>
      )}{' '}
    </div>
  );
};
