import { TextField, TextareaAutosize, Autocomplete } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { Label } from '../primitives/Label/Label';
import MetaTagChooser from '../MetaTagsSelector/MetaTagsSelector';
import { UploadedImage } from '../primitives/UploadedImage/UploadedImage';
import { FormControlsWrapper } from '../FormControlsWrapper/FormControlsWrapper';
import PriceList from '../PriceList/PriceList';
import { languagesData } from '../../../common/constants/languages';
import { Toggle } from '../primitives/Toggle/toggle';
import { Divider } from '../primitives/Divider';
import { ProfileBlock } from '../primitives/ProfileBlock/ProfileBlock';
import { IClientProfileForm } from '../../../common/types/form-props';
import { DropdownIcon } from '../Icons/Icons';
import { CustomerTypes } from '../../../common/enums/customer-type';
import { UploadOrderPhoto } from '../Orders/UploadOrderPhoto';
import { IsRequiredInput } from '../primitives/IsRequiredInput';

type AboutServiceFormProps = Omit<IClientProfileForm, 'control'>;

export const AboutServicesForm = ({ errors, setValue, watch, register }: AboutServiceFormProps) => {
  const { t } = useTranslation();

  const handleImageChange = (image: string) => {
    setValue('portfolio_photos', [...profilePhotos, image]);
  };

  const handleImageRemove = (index: number) => {
    setValue(
      'portfolio_photos',
      profilePhotos.filter((_, i) => i !== index)
    );
  };

  const { surname } = watch();
  const languages = watch('languages') || [];
  const tags = watch('tags') || [];
  const volunteering = watch('volunteering');
  const pricelist = watch('services_pricelist') || [];
  const profilePhotos = watch('portfolio_photos') || [];
  const photos = watch('additional_photos') || [];
  const isCompany = watch('type') === CustomerTypes.COMPANY;

  const handleAddPhoto = (url: string) => {
    setValue('additional_photos', [...photos, url]);
  };

  const handleDeletePhoto = (e: React.SyntheticEvent<EventTarget>, index: number) => {
    e.preventDefault();
    setValue(
      'additional_photos',
      photos.filter((e, i) => i !== index)
    );
  };

  return (
    <>
      {isCompany && (
        <>
          <div className="mt-6.5 mb-11">
            <div className="text-lg leading-6 text-text-primary">{t('foto_service_representative')}</div>
            <div className="text-text-secondary text-sm">({t('clients_trust')})</div>
            <div className="flex space-x-2.25 mt-2.25">
              {Array.from({ length: 3 }).map((_, index) => (
                <UploadOrderPhoto
                  key={index}
                  index={index}
                  primary={index === 0}
                  photos={photos}
                  addPhoto={handleAddPhoto}
                  deletePhoto={handleDeletePhoto}
                />
              ))}
            </div>
          </div>

          <IsRequiredInput text="name" caption="visible_to_all" required={true} filled={!!name} />
          <TextField
            fullWidth
            {...register('name', { required: true })}
            placeholder={t('name_input_placeholder')}
            error={Boolean(errors.name)}
            helperText={t(errors.name?.message)}
            sx={{
              '.MuiInputBase-root': {
                height: '35px',
              },
            }}
          />
          <IsRequiredInput
            text="surname"
            caption="visible_first_letter"
            required={true}
            filled={!!surname}
            classes="mt-4.25"
          />
          <TextField
            fullWidth
            {...register('surname', { required: true })}
            placeholder={t('surname_input_placeholder')}
            error={Boolean(errors.surname)}
            helperText={t(errors.surname?.message)}
            sx={{
              '.MuiInputBase-root': {
                height: '35px',
              },
            }}
          />
          <Divider classes="my-7.5 -mx-4.5" />
        </>
      )}
      <div className="mb-6 mt-10">
        <Label text={t('description')} caption={t('not_required')} />
        <TextareaAutosize
          {...register('description')}
          sx={{
            '& .MuiInputBase-root': {
              padding: 0,
              lineHeight: '1.5rem',
              color: '#000',
              resize: 'none',
            },
          }}
          placeholder={t('about_you')}
          className="border-2 border-gray-300 px-4 py-2 rounded w-full text-text-primary"
          minRows={4}
        />
        {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
      </div>
      <div className="mb-7.75">
        <div className="relative flex justify-between">
          <Label text={t('portfolio')} caption={t('photo_limitation_caption', { max: 10 })} />
        </div>
        <div className="flex gap-4 items-center flex-wrap">
          <UploadedImage handleImageChange={handleImageChange} isPlaceholder placeholderText={t('add')} />
          {profilePhotos &&
            profilePhotos.map((item, i) => (
              <UploadedImage key={item} image={item} onRemove={() => handleImageRemove(i)} />
            ))}
        </div>
      </div>
      <Divider classes="mb-4 -mx-4.5" />
      <PriceList onChange={(value) => setValue('services_pricelist', value)} value={pricelist} />

      <Divider classes="mb-5 -mx-4.5" />

      <ProfileBlock
        headingCaption={t('videopresentation_caption', { max: 10 })}
        heading={t('videopresentation')}
        toggle={false}
        dividerStyle="mb-5 mt-4.5 -mx-4.5"
      />

      <ProfileBlock
        headingCaption={t('education_and_experience')}
        heading="settings"
        toggle={false}
        dividerStyle="mb-5 mt-4.5 -mx-4.5"
      />
      <div className="mb-7.25">
        {tags && (
          <MetaTagChooser
            errorsMessage={t(errors?.tags?.message)}
            value={tags}
            onChange={(tags) => setValue('tags', tags)}
          />
        )}
      </div>
      <Divider classes="mb-4.75 -mx-4.5" />
      <div className="mb-4">
        <Label text={t('speaking_on')} />

        <Autocomplete
          multiple
          fullWidth
          popupIcon={<DropdownIcon fill="#949494" />}
          options={languagesData.map((item) => item.name)}
          value={languages.map((item) => item.name)}
          renderInput={(params) => <TextField placeholder={t('choose_language')} {...params} size="small" />}
          onChange={(_, value) =>
            setValue(
              'languages',
              value.map((item) => languagesData.find((lang) => lang.name === item) as Language)
            )
          }
          sx={{
            '.MuiAutocomplete-endAdornment': {
              top: '8px',
              right: '20px !important',
            },
          }}
        />
      </div>
      <Divider classes="mb-3.5 -mx-4.5" />
      <FormControlsWrapper>
        <Label withWarning text={t('volunteering_ability')} caption={t('volunteering_ability_caption')} />
        <Toggle onChange={(value) => setValue('volunteering', value)} value={volunteering} />
      </FormControlsWrapper>
      <Divider classes="mt-3.25 mb-22 -mx-4.5" />
    </>
  );
};
