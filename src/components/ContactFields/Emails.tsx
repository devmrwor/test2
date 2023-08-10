import { useState, useDeferredValue, useEffect, ChangeEvent, useMemo } from 'react';
import { AddCircleIconBig, Bin } from '../Icons/Icons';
import { TextField } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { SuccessSolid } from '../Buttons';
import { useClientContext } from '@/contexts/clientContext';
import { IsRequiredInput } from '../primitives/IsRequiredInput';
import { IconButtonWrap } from '../Buttons/IconButtonWrap';
import { Email } from '../../../common/types/individual';
import { BaseButton } from '@/components/Buttons/BaseButton';

interface IEmailProps {
  values: Email[];
  onChange: (values: Email[]) => void;
  classes?: string;
  multipleEmails?: boolean;
  required?: boolean;
  isVerified?: boolean;
}

const handleEmailValidation = (email: string) => {
  const regEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return regEmail.test(email);
};

export const Emails = ({
  values,
  onChange,
  classes,
  multipleEmails = false,
  required = false,
  isVerified = false,
}: IEmailProps) => {
  const { t } = useTranslation();
  const { setIsEmailVerificationOpen, isEmailVerified, userData, serverUserData, setEmailToVerify } =
    useClientContext();
  const defaultValue = values.length === 0 ? [{ id: 0, value: '' }] : values;
  const [nextId, setNextId] = useState(defaultValue[defaultValue.length - 1].id);
  const [emails, setEmails] = useState(defaultValue);

  const initialValidation = useMemo(() => {
    return validateEmails();
  }, [emails]);
  const [isValidEmail, setIsValidEmail] = useState(initialValidation);
  const deferredEmails = useDeferredValue(emails);

  const handleConfirmEmail = () => {
    setIsEmailVerificationOpen(true);
    setEmailToVerify(emails[0].value);
  };

  function validateEmails() {
    return emails.map((el) => ({ id: el.id, value: handleEmailValidation(el.value) }));
  }

  const handleAddEmail = () => {
    setEmails((prevEmails) => {
      const newId = nextId + 1;
      setNextId(newId);
      const newEmail = { id: newId, value: '' };
      return [...prevEmails, newEmail];
    });
  };

  const handleDeleteEmail = (id: number) => {
    setEmails((prevEmails) => prevEmails.filter((email) => email.id !== id));
    setIsValidEmail((prevEmails) => prevEmails.filter((email) => email.id !== id));
  };

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>, id: number) => {
    const { value } = event.target;
    setEmails((prevEmails) => prevEmails.map((email) => (email.id === id ? { ...email, value: value } : email)));
    // setIsValidEmail((prevEmails) => prevEmails.map((email) => (email.id === id ? { ...email, value: false } : email)));
    setIsValidEmail((prevEmails) =>
      prevEmails.map((email) => (email.id === id ? { ...email, value: handleEmailValidation(value) } : email))
    );
  };

  useEffect(() => {
    onChange(deferredEmails);
    setIsValidEmail(validateEmails());
  }, [deferredEmails]);

  const isMainEmailVerified = isVerified || (isEmailVerified && userData?.email === serverUserData?.email);

  return (
    <div className={classes}>
      <div className="flex justify-between items-center">
        <div className="flex gap-1 items-center">
          <IsRequiredInput text="email" filled={isMainEmailVerified} required={required} />
          {/* <IsRequiredInput text="email" filled={isValidEmail.some((el) => el.value)} /> */}
          {/*<CircleCheck fill={isValidEmail[emails[0].id] && isValidEmail[0].value ? '#55bc7d' : '#f3f3f3'} size="sm" />*/}
        </div>
        {multipleEmails && <BaseButton Icon={AddCircleIconBig} onClick={handleAddEmail} />}
      </div>
      {emails.map((el, i) => (
        <div key={i} className="mb-5.75 mt-1">
          <div className="flex items-center">
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="example@gmail.com"
              value={el.value}
              onChange={(event: ChangeEvent<HTMLInputElement>) => handleEmailChange(event, el.id)}
              sx={{
                '& .MuiInputBase-input': {
                  paddingTop: '6px',
                  paddingBottom: '6px',
                },
              }}
            />
            {i > 0 && (
              <IconButtonWrap icon={<Bin />} classes="ml-4.5 text-[18px]" onClick={() => handleDeleteEmail(el.id)} />
            )}
          </div>
          {/* {isValidEmail[el.id] && isValidEmail[el.id].value && !isEmailVerified && (
            <div className="mt-1.75 -mb-4">
              <SuccessSolid
                text={t('confirm')}
                color="primary"
                size="small"
                style={{ fontSize: '18px' }}
                onClick={handleConfirmEmail}
              />
            </div>
          )} */}

          {!isMainEmailVerified && (
            <div className="mt-1.75 -mb-4">
              <SuccessSolid
                text={t('confirm')}
                color="primary"
                size="small"
                style={{ fontSize: '18px' }}
                onClick={handleConfirmEmail}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
