import React, { createRef, FC, FormEventHandler, useEffect, useState } from 'react';
import { Box, Button, TextField, FormControl, TextareaAutosize, RadioGroup, InputAdornment } from '@mui/material';
import { Autocomplete } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { ICategory } from '../../common/types/category';
import { useQuery } from 'react-query';
import { getAllCategories } from '@/services/categories';
import { IProfile, IProfileForm } from '../../common/types/profile';
import { ConfirmDialog } from './modals/ConfirmDialog';
import { joiResolver } from '@hookform/resolvers/joi';
import { ProfileFormSchema } from '../../common/validation/profile-schema';
import { UploadedImage } from './primitives/UploadedImage/UploadedImage';
import { Label } from './primitives/Label/Label';
import { useTranslation } from 'next-i18next';
import { Toggle } from './primitives/Toggle/toggle';
import { FormSeparator } from './primitives/FormSeparator/FormSeparator';
import { FormControlsWrapper } from './FormControlsWrapper/FormControlsWrapper';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useRouter } from 'next/router';
import { RadiusesList } from './primitives/RadiusesList/RadiusesList';
import MetaTagChooser from './MetaTagsSelector/MetaTagsSelector';
import { radiuses } from '../../common/constants/radiuses';
import { useUsersContext } from '@/contexts/usersContext';
import { CustomerTypes } from '../../common/enums/customer-type';
import { JobTypes } from '../../common/enums/job-types';
import PriceList from './PriceList/PriceList';
import MessengerList from './MessengersList/MessengersList';
import { languagesData } from '../../common/constants/languages';
import { Language } from '../../common/types/language';
import PlaceIcon from '@mui/icons-material/Place';
import { Languages } from '../../common/enums/languages';
import { ProfileLanguages } from '../../common/enums/profile-languages';
import { ChevronRightXl, LocationIcon, PenEditIcon, DropdownIcon } from './Icons/Icons';
import { Routes, UserRoutes } from '../../common/enums/api-routes';
import { uniteRoutes } from '@/utils/uniteRoute';
import { CustomCheckbox } from './Checkbox/Checkbox';
import { FormControlLabel } from './primitives/FormControlLabel/FormControlLabel';
import { AddButton, SuccessLink, SuccessSolid } from './Buttons';
import { SaveButtonsGroup } from './SaveButtonsGrop/SaveButtonsGroup';
import { CheckboxLabel } from './primitives/CheckboxLabel/CheckboxLabel';

interface ProfileFormProps {
  initialValues?: IProfile;
  isLoading?: boolean;
  onSubmit: (data: IProfileForm) => void;
}

const ProfileForm: FC<ProfileFormProps> = ({ initialValues, isLoading = false, onSubmit }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors, dirtyFields },
  } = useForm<IProfileForm>({
    resolver: joiResolver(ProfileFormSchema),
    defaultValues: {
      volunteering: false,
      is_working_remotely: false,
      can_visit_client: false,
      show_additional_address_publicly: false,
      gender: 'male',
      type: 'individual',
      job_type: JobTypes.MAIN,
    },
  });
  const { user } = useUsersContext();
  const { t } = useTranslation();

  const router = useRouter();
  const query = router.query;

  const submitRef = createRef<HTMLButtonElement>();
  const [filteredLanguages, setFilteredLanguages] = useState<Language[]>(languagesData);
  const [languageInputValue, setLanguageInputValue] = useState('');
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [uploadedPhoto, setUploadedPhoto] = useState<File | null>(null);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const { data: categories, isLoading: isCategoriesLoading } = useQuery<ICategory[]>('categories', () =>
    getAllCategories()
  );
  const [isCompanyNameEditable, setIsCompanyNameEditable] = useState(false);
  const [isAddressesEditable, setIsAddressesEditable] = useState(false);

  const additional_phones = watch('additional_phones') || [];
  const languages = watch('languages') || [];
  const tags = watch('tags') || [];
  const gender = watch('gender');
  const typeOfExecutor = watch('type');
  const volunteering = watch('volunteering');
  const isWorkingRemotely = watch('is_working_remotely');
  const showMainAddress = watch('show_address_publicly');
  const showAdditionalAddress = watch('show_additional_address_publicly');
  const departureClientsHome = watch('can_visit_client');
  const radiusOfDeparture = watch('service_radius');
  const isJobMain = watch('job_type');
  const photo = watch('photo');
  const pricelist = watch('services_pricelist') || [];
  const messengers = watch('messengers') || [];
  const profilePhotos = watch('portfolio_photos') || [];

  const isFormLoading = isLoading || isCategoriesLoading;
  const wasChanged = !!Object.keys(dirtyFields).length;

  useEffect(() => {
    if (!initialValues) return;
    const filteredInitialValues: Record<keyof Partial<IProfile>, any> = {};

    const allowedFields: (keyof IProfile)[] = [
      'category_id',
      'type',
      'name',
      'surname',
      'phone',
      'education',
      'tags',
      'employment',
      'languages',
      'is_working_remotely',
      'show_address_publicly',
      'show_additional_address_publicly',
      'can_visit_client',
      'description',
      'volunteering',
      'portfolio_photos',
      'address',
      'remote_address',
      'additional_address',
      'email',
      'photo',
      'service_radius',
      'gender',
      'is_main_job',
      'phone_numbers',
      'messengers',
      'job_type',
      'company_name',
      'services_pricelist',
      'show_to_executors',
      'profile_language',
      'selfie_with_document',
      'document_photo',
      'additional_phones',
      'is_documents_confirmed',
      'translations',
      'lowest_price',
      'highest_price',
      'languages_codes',
      'company_tin',
      'company_logo',
      'additional_photos',
      'additional_emails',
    ];

    allowedFields.forEach((key) => {
      if (['services_pricelist', 'messengers', 'languages'].includes(key) && initialValues[key]) {
        try {
          filteredInitialValues[key] =
            typeof initialValues[key] === 'string' ? JSON.parse(initialValues[key]) : initialValues[key];
        } catch (error) {
          console.error(error);
        }
        return;
      }
      filteredInitialValues[key] = initialValues[key];
    });
    reset({
      ...filteredInitialValues,
      name: filteredInitialValues.name ?? null,
      surname: filteredInitialValues.surname ?? null,
      address: filteredInitialValues.address ?? null,
      description: filteredInitialValues.description ?? null,
      company_name: filteredInitialValues.company_name ?? null,
      phone: filteredInitialValues.phone ?? null,
    });
  }, [initialValues]);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSave = () => {
    if (!submitRef.current) return;
    submitRef.current.click();
    setOpenDialog(false);
  };

  const handleCancel = () => {
    if (!wasChanged) {
      router.push(uniteRoutes([Routes.USERS, UserRoutes.EXECUTORS]));
    } else {
      setOpenCancelDialog(true);
    }
  };

  useEffect(() => {
    const preventUnload = (e: any) => {
      if (wasChanged) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', preventUnload);
    return () => {
      window.removeEventListener('beforeunload', preventUnload);
    };
  }, [dirtyFields]);

  const handleImageChange = (image: string) => {
    setValue('portfolio_photos', [...profilePhotos, image]);
  };

  const handleUploadedImageRemove = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImageRemove = (index: number) => {
    setValue(
      'portfolio_photos',
      profilePhotos.filter((_, i) => i !== index)
    );
  };

  const handlePhotoChange = (image: string) => {
    setValue('photo', image);
  };

  const handlePhotoRemove = () => {
    setValue('photo', null);
    setUploadedPhoto(null);
  };

  const imagesToUploadFormWrapper: FormEventHandler<HTMLFormElement> = (event) => {
    return handleSubmit((data) => {
      try {
        for (const key in data) {
          console.log(key);
          if (['messengers', 'services_pricelist', 'languages'].includes(key)) {
            // @ts-ignore
            data[key] = data[key] && JSON.stringify(data[key]);
          }
        }
      } catch (error) {
        console.log(error);
      }
      return onSubmit({
        ...data,
        uploadedImages,
        photo: (photo || uploadedPhoto || null) as unknown as string,
      });
    })(event);
  };

  console.log(errors);

  return (
    <div className="flex gap-15 items-end">
      <div className="order-2 ">
        <p className="text-primary-100 text-lg mb-2">{t('how_profile_looks')}</p>
      </div>
      <form onSubmit={imagesToUploadFormWrapper} className="w-full max-w-form grow">
        <div className="mb-6">
          {categories && (
            <Controller
              name="category_id"
              control={control}
              defaultValue={initialValues?.category_id || null}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <Autocomplete
                  disablePortal
                  popupIcon={<DropdownIcon fill="#949494" />}
                  options={categories || []}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      key={params.id}
                      label={t('category')}
                      placeholder={t('category')}
                      error={Boolean(error)}
                      helperText={error?.message}
                    />
                  )}
                  onChange={(_, newValue) => {
                    setValue('category_id', newValue?.id as number);
                    onChange(newValue?.id as number);
                  }}
                  onInputChange={(_, newInputValue, reason) => {
                    if (reason === 'clear') {
                      setValue('category_id', null);
                    }
                  }}
                  value={categories.find((option) => option.id === value) || null}
                  inputValue={categories.find((option) => option.id === value)?.name || ''}
                  renderOption={(props, option: ICategory) => (
                    <Box component="li" {...props}>
                      <span className={[option.parent_id ? 'pl-2' : 'font-bold']}>{option.name}</span>
                    </Box>
                  )}
                  sx={{
                    '.MuiAutocomplete-endAdornment': {
                      top: '8px',
                      right: '20px !important',
                    },
                  }}
                  clearOnEscape
                />
              )}
            />
          )}
          <p className="text-sm text-text-secondary mt-2">{t('choose_category_caption')}</p>
        </div>
        <div className="mb-5.5">
          <div className="-mb-3">
            <Label text={t('photo_of_executor')} />
          </div>
          <UploadedImage
            image={photo || (uploadedPhoto && URL.createObjectURL(uploadedPhoto)) || undefined}
            isPlaceholder={!photo && !uploadedPhoto}
            onRemove={handlePhotoRemove}
            handleImageChange={handlePhotoChange}
            placeholderText={t('add')}
          />
          {user?.photo && (
            <CheckboxLabel
              text={t('use_profile_photo')}
              onChange={({ target: { checked } }) => {
                if (checked) {
                  setValue('photo', user.photo);
                  setUploadedPhoto(null);
                }
              }}
            />
          )}
        </div>
        <div className="mb-7.25">
          <FormControl>
            <Label text={t('gender')} />
            <RadioGroup
              onChange={({ target }) => setValue('gender', target.value)}
              value={gender}
              aria-labelledby="gender"
            >
              <FormControlLabel value={'male'} label={t('male')} />
              <FormControlLabel value={'female'} label={t('female')} />
            </RadioGroup>
          </FormControl>
        </div>
        <div className="mb-7.75">
          <FormControl>
            <Label text={t('type_of_executor')} />
            <RadioGroup
              onChange={({ target }) => setValue('type', target.value)}
              value={typeOfExecutor}
              aria-labelledby="type"
            >
              <FormControlLabel value={CustomerTypes.INDIVIDUAL} label={t('individual')} />
              <FormControlLabel value={CustomerTypes.COMPANY} label={t('company')} />
            </RadioGroup>
          </FormControl>
        </div>
        <div className="mb-3.25">
          <div className="flex items-end justify-between">
            <Label text={t('name_of_company')} caption={t('limitation_caption', { max: 12 })} />
            <div className="relative left-2">
              <CustomCheckbox
                checked={isCompanyNameEditable}
                onChange={() => setIsCompanyNameEditable((prev) => !prev)}
              />
            </div>
          </div>
          <TextField
            size="small"
            placeholder={t('company_name_placeholder')}
            disabled={!isCompanyNameEditable}
            fullWidth
            {...register('company_name')}
            error={Boolean(errors.company_name)}
            helperText={errors.company_name?.message}
          />
          {!isCompanyNameEditable && (
            <div className="flex justify-between mt-2">
              <p className="text-text-primary">{t('edit_company_data')}</p>
              <button type="button" onClick={() => setIsCompanyNameEditable(true)}>
                <PenEditIcon />
              </button>
            </div>
          )}
        </div>
        <div className="mb-4.25">
          <Label text={t('name')} isRequired caption={t('limitation_caption', { max: 12 })} />
          <TextField
            fullWidth
            size="small"
            placeholder={t('name_placeholder')}
            {...register('name')}
            error={Boolean(errors.name)}
            helperText={errors.name?.message}
          />
        </div>
        <div className="mb-7.75">
          <Label text={t('surname')} isRequired caption={t('limitation_caption', { max: 12 })} />
          <TextField
            fullWidth
            placeholder={t('name_placeholder')}
            size="small"
            {...register('surname')}
            error={Boolean(errors.surname)}
            helperText={errors.surname?.message}
          />
        </div>
        <div className="mb-8.25">
          <FormControlsWrapper>
            <Label text={t('phone')} isRequired caption={t('required')} />
            <AddButton onClick={() => setValue('additional_phones', [...additional_phones, ''])} />
          </FormControlsWrapper>
          <TextField
            size="small"
            {...register('phone_numbers')}
            placeholder="+420"
            fullWidth
            className="border-2 border-gray-300 px-4 py-2 rounded w-full"
            error={Boolean(errors.phone_numbers)}
            helperText={errors.phone_numbers?.message}
          />
          {(additional_phones?.length || '') && (
            <div className="mt-4 flex flex-col gap-4">
              {additional_phones.map((_, index) => (
                <TextField
                  placeholder="+420"
                  size="small"
                  fullWidth
                  key={index}
                  {...register(`additional_phones.${index}`)}
                />
              ))}
            </div>
          )}
        </div>
        <div className="mb-15.25">
          <MessengerList value={messengers || []} onChange={(value) => setValue('messengers', value)} />
        </div>
        <div className="mb-9">
          <Label text={t('email')} caption={t('required')} isRequired />
          <TextField
            size="small"
            placeholder={t('email_placeholder')}
            {...register('email')}
            fullWidth
            className="border-2 border-gray-300 px-4 py-2 rounded w-full"
            error={Boolean(errors.email)}
            helperText={errors.email?.message}
          />
          {user?.email && (
            <CheckboxLabel
              text={t('take_from_profile')}
              onChange={({ target: { checked } }) => checked && setValue('email', user.email)}
            />
          )}
        </div>
        <div className="mb-6.25 flex flex-col gap-4">
          <FormSeparator />
          <div className="flex justify-between">
            <p className="text-text-primary">{t('working_remotely')}</p>
            <Toggle onChange={(value) => setValue('is_working_remotely', value)} value={isWorkingRemotely} />
          </div>
          <FormSeparator />
        </div>
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <p className="text-xl mb-2 text-text-primary">{t('regions_and_addresses')}</p>
            {!isAddressesEditable && (
              <SuccessLink
                onClick={() => setIsAddressesEditable(true)}
                type="button"
                className="text-xl text-primary-100"
                text={t('edit')}
              ></SuccessLink>
            )}
          </div>

          <Label text={t('main_address')} isRequired />
          <TextField
            size="small"
            disabled={!isAddressesEditable}
            fullWidth
            sx={{
              '& .MuiInputBase-root': {
                color: !showMainAddress ? '#000' : '#33a1c9',
                backgroundColor: '#f3f3f3',
              },
            }}
            placeholder={t('address_placeholder')}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationIcon />
                </InputAdornment>
              ),
            }}
            {...register('address')}
            error={Boolean(errors.address)}
            helperText={errors.address?.message}
          />
          <FormControlsWrapper classes="mt-2">
            <p className="text-text-secondary mr-2">{t('show_address_to_clients')}</p>
            <Toggle
              disabled={!isAddressesEditable}
              onChange={(value) => setValue('show_address_publicly', value)}
              value={showMainAddress}
            />
          </FormControlsWrapper>
        </div>
        <div className="mb-3">
          <Label text={t('additional_address')} isRequired />
          <TextField
            size="small"
            disabled={!isAddressesEditable}
            placeholder={t('address_placeholder')}
            sx={{
              '& .MuiInputBase-root': {
                color: !showAdditionalAddress ? '#000' : '#33a1c9',
                backgroundColor: '#f3f3f3',
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationIcon />
                </InputAdornment>
              ),
            }}
            fullWidth
            {...register('additional_address')}
            error={Boolean(errors.additional_address)}
            helperText={errors.additional_address?.message}
          />
          <FormControlsWrapper classes="mt-2 mb-3">
            <p className="text-text-secondary mr-2">{t('show_address_to_clients')}</p>
            <Toggle
              disabled={!isAddressesEditable}
              onChange={(value) => setValue('show_additional_address_publicly', value)}
              value={showAdditionalAddress}
            />
          </FormControlsWrapper>

          <FormSeparator />
        </div>
        <div className="mb-4.25">
          <FormControlsWrapper>
            <Label text={t('departure_home')} isRequired />
            <Toggle
              disabled={!isAddressesEditable}
              onChange={(value) => setValue('can_visit_client', value)}
              value={departureClientsHome}
            />
          </FormControlsWrapper>
          <p className="text-sm text-text-secondary relative -top-1.5 left-3">{t('departure_home_caption')}</p>

          <TextField
            size="small"
            disabled={!isAddressesEditable}
            placeholder={t('address_placeholder')}
            sx={{
              '& .MuiInputBase-root': {
                color: !departureClientsHome ? '#000' : '#33a1c9',
                backgroundColor: '#f3f3f3',
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationIcon />
                </InputAdornment>
              ),
            }}
            fullWidth
            {...register('remote_address')}
            error={Boolean(errors.remote_address)}
            helperText={errors.remote_address?.message}
          />
        </div>
        <div className="mb-7.25">
          <Label text={t('radius_of_departure')} />
          <p className="text-sm text-text-secondary -mt-1 mb-2">{t('radius_of_departure_caption')}</p>
          <RadiusesList
            onChange={(value) => setValue('service_radius', value)}
            active={radiusOfDeparture}
            list={radiuses}
          />
        </div>
        <FormSeparator className="mb-3.75" />
        <div className="mb-6.25">
          <div className="relative flex justify-between">
            <Label text={t('portfolio')} />
            <p className="text-text-secondary text-lg">{t('photo_count', { count: profilePhotos.length })}</p>
          </div>
          <div className="flex gap-4 items-center flex-wrap">
            <UploadedImage handleImageChange={handleImageChange} isPlaceholder placeholderText={t('add')} />
            {profilePhotos &&
              profilePhotos.map((item, i) => (
                <UploadedImage key={item} image={item} onRemove={() => handleImageRemove(i)} />
              ))}
            {uploadedImages.map((item, i) => (
              <UploadedImage
                key={item.name}
                image={URL.createObjectURL(item)}
                onRemove={() => handleUploadedImageRemove(i)}
              />
            ))}
          </div>
        </div>
        <FormSeparator className="mb-3.25" />
        <PriceList onChange={(value) => setValue('services_pricelist', value)} value={pricelist} />
        <div className="flex flex-col gap-3 mb-6">
          <FormSeparator />

          <FormControlsWrapper>
            <Label text={t('videopresentation')} caption={t('videopresentation_caption', { max: 10 })} />
            <ChevronRightXl />
          </FormControlsWrapper>

          <FormSeparator />

          <FormControlsWrapper>
            <Label text={t('live_stream')} caption={t('testing')} />
            <ChevronRightXl />
          </FormControlsWrapper>

          <FormSeparator />

          <FormControlsWrapper>
            <Label text={t('education_and_experience')} />
            <ChevronRightXl />
          </FormControlsWrapper>

          <FormSeparator />
        </div>
        <div className="mb-10">
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
        <div className="mb-12">
          <Label text={t('meta_tags')} />
          {tags && (
            <MetaTagChooser
              errorsMessage={errors?.tags?.message}
              value={tags}
              onChange={(tags) => setValue('tags', tags)}
            />
          )}
        </div>
        <div className="mb-7">
          <FormControl>
            <Label text={t('job_type')} />
            <p className="text-sm text-text-secondary mb-3">{t('job_type_caption')}</p>
            <RadioGroup
              onChange={({ target }) => setValue('job_type', target.value as JobTypes)}
              value={isJobMain}
              aria-labelledby="job-type"
            >
              <FormControlLabel value={'temporary'} label={t('no_answer_job_type')} />
              <FormControlLabel value={'main'} label={t('yes_answer_job_type')} />
            </RadioGroup>
          </FormControl>
        </div>
        <FormSeparator className="mb-4" />
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
          {/* <Controller
            name="languages"
            control={control}
            defaultValue={null}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <Autocomplete
                size="small"
                disablePortal
                options={filteredLanguages || []}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    key={params.id}
                    placeholder={t("choose_language")}
                    error={Boolean(error)}
                    helperText={error?.message}
                  />
                )}
                onChange={(_, newValue) => {
                  setValue("languages", newValue?.id);
                  onChange(newValue?.id);
                }}
                onInputChange={(event, newInputValue, reason) => {
                  if (!languagesData) return;
                  if (reason === "input") {
                    setValue("languages", null);
                    const filteredOptions = languagesData.filter((option) =>
                      option.name.includes(newInputValue)
                    );
                    setLanguageInputValue(newInputValue);
                    setFilteredLanguages(filteredOptions);
                  } else if (reason === "clear") {
                    setLanguageInputValue("");
                    setValue("languages", null);
                  }
                }}
                value={languagesData.find((option) => option.code === value) || null}
                inputValue={
                  languagesData.find((option) => option.code === value)?.name || languageInputValue
                }
                renderOption={(props, option) => (
                  <Box component="li" key={option.id} {...props}>
                    {option.name}
                  </Box>
                )}
                clearOnEscape
              />
            )}
          /> */}
        </div>
        <div className="flex flex-col gap-4">
          <FormSeparator />

          <FormControlsWrapper>
            <Label withWarning text={t('volunteering_ability')} caption={t('volunteering_ability_caption')} />
            <Toggle onChange={(value) => setValue('volunteering', value)} value={volunteering} />
          </FormControlsWrapper>

          <FormSeparator />
        </div>
        <SaveButtonsGroup
          isLoading={isFormLoading}
          onSave={() => setOpenDialog(true)}
          onCancel={handleCancel}
          submitRef={submitRef}
        />
        {openDialog && (
          <ConfirmDialog
            open={openDialog}
            onClose={handleCloseDialog}
            onSave={handleSave}
            customText={t('data_was_changed_confirm')}
          />
        )}
        {openCancelDialog && (
          <ConfirmDialog
            open={openCancelDialog}
            buttonText={t('yes')}
            onClose={() => setOpenCancelDialog(false)}
            onSave={handleSave}
            customText={t('data_was_changed_confirm')}
          />
        )}
      </form>
    </div>
  );
};

export default ProfileForm;
