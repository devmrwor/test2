import { useRef, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useTranslation } from 'next-i18next';
import React, { ChangeEventHandler } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { v4 as uuidv4 } from 'uuid';
import { useS3Upload } from 'next-s3-upload';
import { PhotoIcon } from '@/components/Icons/Icons';
import classNames from 'classnames';
import { BaseButton } from '@/components/Buttons/BaseButton';
import { SecondaryBaseButton } from '@/components/Buttons/SecondaryBaseButton';

interface UploadedImageProps {
  image?: string;
  headline?: string;
  number?: string;
  headlineCaption?: string;
  isPlaceholder?: boolean;
  placeholderText?: string;
  uploadType?: string;
  placeholderIcon?: React.ReactNode;
  disabled?: boolean;
  handleImageChange?: (image: string) => void;
  onRemove?: () => void;
}

const inputId = uuidv4();

export const UploadedImage = ({
  image,
  number,
  headline,
  headlineCaption,
  placeholderText,
  isPlaceholder = false,
  placeholderIcon,
  uploadType = 'image/*',
  disabled = false,
  handleImageChange,
  onRemove,
}: UploadedImageProps) => {
  const { t } = useTranslation();
  const inputFileRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [urls, setUrls] = useState([]);
  const { uploadToS3 } = useS3Upload();

  const handleClose = () => {
    setOpen(false);
    setUrls([]);
  };

  const handleUpload = () => {
    if (!inputFileRef.current) return;
    inputFileRef.current.click();
  };

  const handleConfirm = () => {
    /* @ts-ignore */
    handleImageChange(urls[0]);
    handleClose();
  };

  const handleFilesChange = async ({ target }) => {
    try {
      setIsLoading(true);
      const files = Array.from(target.files);

      for (let index = 0; index < files.length; index++) {
        const file = files[index];
        const { url } = await uploadToS3(file);

        setUrls((current) => [...current, url]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col">
        <h3 className="text-text-primary mb-4">
          {headline}
          {headlineCaption && <span className="text-text-secondary ml-1">{headlineCaption}</span>}
        </h3>
        <div
          className={classNames(
            'flex justify-center items-center relative h-28.25 w-31 p-1.5 rounded-lg box-border',
            disabled
              ? 'bg-background'
              : ' focus:border-primary-800 focus:border-2 bg-background text-text-secondary hover:bg-darken-background'
          )}
        >
          {!isPlaceholder && (
            <button onClick={onRemove} type="button" className="absolute top-2 right-2 ">
              <CloseIcon color="secondary" />
            </button>
          )}
          {number && (
            <span
              className={classNames(
                'absolute top-2 left-3',
                disabled ? 'text-darken-background' : 'text-text-secondary'
              )}
            >
              {number}
            </span>
          )}
          {image ? (
            <div>
              <img alt="" src={image} className="h-full w-full object-contain mx-auto" />
            </div>
          ) : (
            <div
              className={classNames(
                'flex gap-2 flex-col justify-center items-center',
                disabled && 'text-darken-background'
              )}
            >
              {placeholderIcon ? placeholderIcon : <PhotoIcon fill="currentColor" />}
              {placeholderText && isPlaceholder && (
                <p
                  className={classNames(
                    disabled ? 'text-darken-background' : 'text-text-secondary text-base text-center'
                  )}
                >
                  {placeholderText}
                </p>
              )}
            </div>
          )}
          {isPlaceholder && (
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="top-0 left-0 absolute h-full w-full"
            ></button>
          )}
        </div>
      </div>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <div className="w-96 bg-primary-100 flex justify-between px-4 py-2 items-center">
          <h3 className="text-white">{t('load')}</h3>
          <IconButton disabled={isLoading} edge="end" onClick={handleClose} aria-label="close" color="white">
            <CloseIcon />
          </IconButton>
        </div>
        <DialogContent>
          <input
            ref={inputFileRef}
            type="file"
            id={inputId}
            name="photo"
            accept={uploadType}
            onChange={handleFilesChange}
            className="hidden"
          />
          <div className="flex justify-between items-center">
            <div>
              <p className="mb-4">{t('upload_image_text')}</p>
              <BaseButton
                text={t('choose_image')}
                color="primary"
                type="solid"
                size="md"
                onClick={handleUpload}
              ></BaseButton>
            </div>
            {urls[0] ? (
              <img width={100} alt="" src={urls[0]} />
            ) : (
              <p className="text-text-secondary relative -left-8 top-5">
                {isLoading ? t('loading') : t('file_not_selected')}
              </p>
            )}
          </div>
        </DialogContent>
        <div className="flex gap-2 p-4">
          <BaseButton
            classes="w-full justify-center"
            type="solid"
            size="large"
            variant=""
            color="success"
            fullWidth
            disabled={!urls[0] || isLoading}
            onClick={handleConfirm}
            text={isLoading ? t('loading') : t('confirm')}
          ></BaseButton>

          <SecondaryBaseButton
            disabled={isLoading}
            classes="w-full justify-center"
            type="outline"
            size="large"
            color="secondary"
            onClick={handleClose}
            text={t('cancel')}
          ></SecondaryBaseButton>
        </div>
      </Dialog>
    </>
  );
};
