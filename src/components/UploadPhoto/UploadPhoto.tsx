import { useTranslation } from 'next-i18next';
import { CameraIcon, Camera } from '../Icons/Icons';
import { useRef, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useS3Upload } from 'next-s3-upload';
import { Box } from '@mui/material';
import { secondary } from '@/themes/colors';

const inputId = uuidv4();

export const UploadPhoto = ({ text, photo, setPhoto, individual = false }) => {
  const { t } = useTranslation();
  const { uploadToS3 } = useS3Upload();
  const fileInputRef = useRef(null);

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleUploadPhoto = async ({ target }) => {
    try {
      const file = target.files[0];
      if (!file) return;
      const { url } = await uploadToS3(file);
      setPhoto(url);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeletePhoto = () => {
    setPhoto('');
  };

  return (
    <>
      <Box
        sx={{
          border: `1px dashed ${secondary.value}`,
        }}
        className="h-24 max-w-thumbIndividual w-full bg-darken-background rounded-full mr-[11.7px] text-[30px] flex items-center justify-center relative"
      >
        {photo ? (
          <>
            <button onClick={handleDeletePhoto} className="absolute -bottom-0.5 -right-1">
              <Camera />
            </button>
            <img src={photo} alt="user photo" className="w-full h-full rounded-full object-cover" />
          </>
        ) : (
          <div className="flex flex-col justify-center items-center text-text-secondary" onClick={handleClick}>
            <input
              ref={fileInputRef}
              type="file"
              id={inputId}
              name="photo"
              accept="image/*"
              onChange={handleUploadPhoto}
              className="hidden"
            />
            <CameraIcon fill="currentColor" />
            <p className="text-center text-base leading-5 max-w-[70px]">{t(text)}</p>
          </div>
        )}
      </Box>
      {individual && <p className="shrink max-w-[200px] text-toggle-background text-[15px]">{t('photo_message')}</p>}
    </>
  );
};
