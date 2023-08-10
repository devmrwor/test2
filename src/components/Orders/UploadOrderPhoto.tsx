import { v4 as uuidv4 } from 'uuid';
import { useS3Upload } from 'next-s3-upload';
import { CameraIcon, CrossButton } from '../Icons/Icons';
import { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';

const inputId = uuidv4();

export const UploadOrderPhoto = ({ primary = false, index, photos, addPhoto, deletePhoto }) => {
  const { t } = useTranslation();
  const { uploadToS3 } = useS3Upload();
  const [url, setUrl] = useState('');
  const fileInputRef = useRef(null);

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  useEffect(() => {
    setUrl(photos[index]);
  }, [photos]);

  const handleUploadPhoto = async ({ target }) => {
    try {
      const file = target.files[0];
      if (!file) return;
      const { url } = await uploadToS3(file);
      console.log(photos);
      setUrl(url);
      addPhoto(url);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      {!!url ? (
        <div className="flex flex-col items-center justify-center w-24 h-24 bg-background rounded-lg text-text-secondary relative">
          <button onClick={(e) => deletePhoto(e, index)} className="absolute top-0.5 right-0.5">
            <CrossButton />
          </button>
          <img className="w-full h-full object-cover rounded-lg" src={url} alt="" />
        </div>
      ) : (
        <div
          className="flex flex-col items-center justify-center w-24 h-24 bg-background rounded-lg text-text-secondary px-1 border border-dashed border-text-secondary"
          onClick={handleClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            id={inputId}
            name="photo"
            accept="image/*"
            onChange={handleUploadPhoto}
            className="hidden"
          />
          {primary && (
            <>
              <CameraIcon fill="currentColor" size="2x" />
              <p className="text-center text-base leading-5 ">{t('upload_up_to', { num: 3 })}</p>
            </>
          )}
        </div>
      )}
    </>
  );
};
