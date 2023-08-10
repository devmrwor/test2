import { useState } from 'react';
import { Dialog, DialogContent, InputAdornment, IconButton, Button, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { v4 as uuidv4 } from 'uuid';
import { CopyIcon, VisibilityOff, VisibilityOn } from '../Icons/Icons';
import { Label } from '../primitives/Label/Label';
import { useTranslation } from 'next-i18next';
import { useLayout } from '@/contexts/layoutContext';

interface PasswordGeneratorProps {
  onGenerate: (password: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const PasswordGenerator = ({ onGenerate, open, setOpen }: PasswordGeneratorProps) => {
  const { t } = useTranslation();
  const { addNotification } = useLayout();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState('');

  const generatePassword = () => {
    const length = 10;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_&%*!@#$%^&*()<>?.,';
    let generatedPassword = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      generatedPassword += charset.charAt(randomIndex);
    }
    return generatedPassword;
  };

  const handleGenerate = () => {
    const generatedPassword = generatePassword();
    onGenerate(generatedPassword);
    setShowPasswordDialog(true);
    setGeneratedPassword(generatedPassword);
  };

  const handleClose = () => {
    setOpen(false);
    setPassword('');
    setConfirmPassword('');
    setShowPasswordDialog(false);
    setGeneratedPassword('');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPassword);
    setShowPasswordDialog(false);
  };

  const handleClosePasswordGenerating = () => {
    setShowPasswordDialog(false);
  };

  const handleConfirm = () => {
    if (!password || password === ' ') {
      addNotification({
        type: 'error',
        text: t('no_password_entered'),
      });
      return;
    }
    if (password !== confirmPassword) {
      addNotification({
        type: 'error',
        text: t('passwords_do_not_match'),
      });
      return;
    }
    onGenerate(password);
    handleClose();
  };
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };
  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <div className="w-[496px] bg-primary-100 flex justify-between px-4 py-2 items-center">
          <h3 className="text-white">{t('password_set_up')}</h3>
          <IconButton
            // disabled={isLoading}
            edge="end"
            onClick={handleClose}
            aria-label="close"
            color="white"
          >
            <CloseIcon />
          </IconButton>
        </div>
        <DialogContent>
          <div className="flex justify-between">
            <div>
              <div className="mb-4">
                <Label text={t('new_password')} isRequired />
                <TextField
                  value={password}
                  size="small"
                  type={showPassword ? 'text' : 'password'}
                  onChange={(e) => setPassword(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleTogglePasswordVisibility}>
                          {showPassword ? <VisibilityOn /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
              <div className="mb-4">
                <Label text={t('confirm_password')} isRequired />
                <TextField
                  size="small"
                  value={confirmPassword}
                  type={showPassword ? 'text' : 'password'}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleTogglePasswordVisibility}>
                          {showPassword ? <VisibilityOn /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
            </div>
            <div>
              <button
                onClick={handleGenerate}
                type="button"
                className="flex mt-8 items-center max-w-[222px] h-9.5 rounded-md bg-white w-full px-4 text-text-secondary border-text-secondary border hover:border-primary-100 hover:text-primary-100 hover:fill-primary-100 transition-all"
              >
                <span className="text-lg mx-auto"> {t('generate')}</span>
              </button>
            </div>
          </div>
        </DialogContent>

        <div className="flex gap-2 p-4">
          <Button fullWidth onClick={handleConfirm} color="info" variant="contained">
            {t('save')}
          </Button>
          {/* @ts-ignore */}
          <Button fullWidth onClick={handleClose} color="disabled" variant="outlined">
            {t('cancel')}
          </Button>
        </div>
      </Dialog>
      <Dialog open={showPasswordDialog} onClose={handleClosePasswordGenerating}>
        <div className="w-[480px] bg-primary-100 flex justify-between px-4 py-2 items-center">
          <h3 className="text-white">{t('generation_of_password')}</h3>
          <IconButton edge="end" onClick={handleClosePasswordGenerating} aria-label="close" color="white">
            <CloseIcon />
          </IconButton>
        </div>
        <DialogContent>
          <p className="flex gap-2 mb-2">
            {t('remember_password')}
            <span
              onClick={handleCopy}
              className="text-primary-100 fill-primary-100 cursor-pointer items-center flex gap-1"
            >
              {t('copy_it')}
              <CopyIcon fill="currentColor" />
            </span>
          </p>
          <div className="w-full border border-text-secondary rounded-md text-center p-2">{generatedPassword}</div>
        </DialogContent>
        <div className="flex justify-center pb-4">
          <Button
            type="button"
            size="small"
            onClick={handleClosePasswordGenerating}
            variant="outlined"
            color={'disabled' as any}
          >
            {t('close')}
          </Button>
        </div>
      </Dialog>
    </>
  );
};
