import { TextField } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { StarGroup, HourglassHalf, MaleIcon, FemaleIcon } from '../Icons/Icons';
import { JobTypes } from '../../../common/enums/job-types';
import _filter from '@/styles/client/filter.module.css';
import { UploadOrderPhoto } from '../Orders/UploadOrderPhoto';
import { Controller } from 'react-hook-form';
import { CustomCheckbox } from '../Checkbox/Checkbox';
import { IsRequiredInput } from '../primitives/IsRequiredInput';
import { Gender } from '../../../common/enums/gender';
import { DoubleRoundedBtn } from '../Buttons/DoubleRoundedBtn';
import { Divider } from '../primitives/Divider';
import { Emails, Phones, Messengers } from '../ContactFields';
import { Toggle } from '../primitives/Toggle/toggle';
import { PlacesInput } from '../primitives/PlacesInput';
import { LabelDoubleLine } from '../primitives/Label/LabelDoubleLine';
import { radiuses } from '../../../common/constants/radiuses';
import { useClientContext } from '@/contexts/clientContext';
import { uniteValues } from '@/utils/uniteValues';
import { IClientProfileForm } from '../../../common/types/form-props';
import { CustomerTypes } from '../../../common/enums/customer-type';
import { UploadedImage } from '../primitives/UploadedImage/UploadedImage';

export const MainForm = ({ errors, control, setValue, watch, register }: IClientProfileForm) => {
  const { t } = useTranslation();
  const { userData } = useClientContext();
  const [useUserPhotos, setUseUserPhotos] = useState(false);

  const {
    name,
    surname,
    gender,
    email,
    is_working_remotely,
    show_address_publicly,
    show_additional_address_publicly,
    can_visit_client,
    service_radius,
    phone,
    company_logo: logo,
  } = watch();

  const messengers = watch('messengers') || [];
  const additional_emails = watch('additional_emails') || [];
  const additional_phones = watch('additional_phones') || [];
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

  const handleImageChange = (image: string) => {
    setValue('company_logo', image);
  };

  const handleDeleteImage = () => {
    setValue('company_logo', '');
  };

  return (
    <>
      {isCompany ? (
        <>
          <Divider classes="my-7.5 mb-7 -mx-4.5" />
          <IsRequiredInput text="logo" caption="company_logo_caption" required={false} />
          {logo ? (
            <UploadedImage image={logo} onRemove={handleDeleteImage} />
          ) : (
            <UploadedImage isPlaceholder handleImageChange={handleImageChange} placeholderText={t('load_logo')} />
          )}
          <IsRequiredInput text="company_name" caption="visible_to_all" required={false} classes="mt-6" />
          <TextField
            fullWidth
            {...register('company_name', { required: true })}
            placeholder={t('company_name_input_placeholder')}
            error={Boolean(errors.company_name)}
            helperText={errors.company_name?.message}
            sx={{
              '.MuiInputBase-root': {
                height: '35px',
              },
            }}
          />
          <IsRequiredInput text="tin" caption="hidden_from_executor" required={false} classes="mt-4.25" />
          <TextField
            fullWidth
            {...register('company_tin', { required: true })}
            placeholder={t('company_tin_input_placeholder')}
            error={Boolean(errors.company_tin)}
            helperText={errors.company_tin?.message}
            sx={{
              '.MuiInputBase-root': {
                height: '35px',
              },
            }}
          />
        </>
      ) : (
        <>
          <Controller
            name="job_type"
            control={control}
            render={({ field }) => (
              <div className="flex items-center mt-11.25 mb-10.25">
                {Object.values(JobTypes)
                  .reverse()
                  .map((job) => (
                    <button
                      key={job}
                      onClick={(e) => {
                        e.preventDefault();
                        setValue('job_type', job);
                      }}
                      className={`flex justify-center items-center pt-1.5 pb-1 grow capitalize text-black leading-5 ${
                        field.value === job ? 'bg-primary-200' : 'bg-background '
                      } ${_filter['toggle__btn']}`}
                    >
                      {job === JobTypes.MAIN && <StarGroup />}
                      {job === JobTypes.TEMPORARY && <HourglassHalf fill="currentColor" />}
                      <span className="ml-1">{job === JobTypes.MAIN ? t('main_job') : t('part_time')}</span>
                    </button>
                  ))}
              </div>
            )}
          />
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
          <div className="-ml-2.25 mt-2.75 mb-10.75 flex items-center">
            <CustomCheckbox checked={useUserPhotos} onChange={() => setUseUserPhotos((prev) => !prev)} />
            <p className="text-toggle-background">{t('use_profile_photo')}</p>
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
          <Divider classes="mt-6.75 mb-6.5 -mx-4.5" />
          <DoubleRoundedBtn
            firstVal={{ value: Gender.MALE, text: Gender.MALE, icon: <MaleIcon /> }}
            secondVal={{ value: Gender.FEMALE, text: Gender.FEMALE, icon: <FemaleIcon /> }}
            selectedValue={gender}
            onChange={(value) => setValue('gender', value)}
          />
        </>
      )}
      <Divider classes="my-7.5 -mx-4.5" />
      <h2 className="text-lg mb-4.5 text-text-primary">{t('contacts')}</h2>
      <Emails
        isVerified={true}
        values={uniteValues(email, additional_emails)}
        onChange={(newEmails) => {
          const [email, ...additional_emails] = newEmails;
          setValue('email', email.value);
          setValue(
            'additional_emails',
            additional_emails.map((item) => item.value)
          );
        }}
        classes="mb-10.75"
      />
      {errors.email && <p className="text-red-100"> {errors.email?.message} </p>}
      <Phones
        values={uniteValues(phone, additional_phones)}
        onChange={(newPhones) => {
          const [phone, ...additional_phones] = newPhones;
          setValue('phone', phone.value);
          setValue(
            'additional_phones',
            additional_phones.map((item) => item.value)
          );
        }}
      />
      <Messengers
        values={messengers}
        onChange={(value) => {
          setValue('messengers', value);
        }}
        required={false}
      />
      <Divider classes="mt-10 mb-5 -mx-4.5" />
      <div className="flex justify-between items-center">
        <p className="text-lg text-text-primary">{t('working_remotely')}</p>
        {/* TODO: toggle is corrected, but is the logic right? since toggle already returns changed value */}
        <Toggle value={is_working_remotely} onChange={() => setValue('is_working_remotely', !is_working_remotely)} />
      </div>
      <h2 className="text-xl capitalize mt-8 mb-3 text-text-primary">{t('addresses')}</h2>
      <LabelDoubleLine text={t('main')} caption={t('accepting_clients')} isRequired={true} classes="mb-1" />
      <Controller
        control={control}
        name="address"
        rules={{ required: true }}
        render={({ field }) => (
          <PlacesInput
            error={Boolean(errors.address)}
            helperText={t(errors.address?.message)}
            placeholder="city_placeholder"
            queryCountries={['ua', 'cz']}
            inputValue={field.value}
            onChange={field.onChange}
            iconColor="#949494"
            filledInput={true}
          />
        )}
      />
      <div className="flex justify-between items-center mt-0.75">
        <p className="text-lg text-text-secondary">{t('show_address_to_clients')}</p>
        <Toggle
          value={show_address_publicly}
          onChange={() => setValue('show_address_publicly', !show_address_publicly)}
        />
      </div>
      <LabelDoubleLine text={t('additional')} caption={t('accepting_clients')} classes="mt-7.25 mb-1" />
      <Controller
        control={control}
        name="additional_address"
        render={({ field }) => (
          <PlacesInput
            error={Boolean(errors.additional_address)}
            helperText={errors.additional_address?.message}
            placeholder="city_placeholder"
            queryCountries={['ua', 'cz']}
            inputValue={field.value}
            onChange={field.onChange}
            iconColor="#949494"
            filledInput={true}
          />
        )}
      />
      <div className="flex justify-between items-center mt-0.75">
        <p className="text-lg text-text-secondary">{t('show_address_to_clients')}</p>
        <Toggle
          value={show_additional_address_publicly}
          onChange={() => setValue('show_additional_address_publicly', !show_additional_address_publicly)}
        />
      </div>
      <div className="flex justify-between items-center mt-9.75 mb-2">
        <LabelDoubleLine text={t('departure_home')} caption={t('need_to_specify_area')} />
        <Toggle value={can_visit_client} onChange={() => setValue('can_visit_client', !can_visit_client)} />
      </div>
      <Controller
        control={control}
        name="remote_address"
        render={({ field }) => (
          <PlacesInput
            error={Boolean(errors.remote_address)}
            helperText={errors.remote_address?.message}
            placeholder="city_placeholder"
            queryCountries={['ua', 'cz']}
            inputValue={field.value}
            onChange={field.onChange}
            iconColor="#949494"
            filledInput={true}
          />
        )}
      />
      <LabelDoubleLine text={t('service_radius')} caption={t('from_the_address')} classes="mt-6.5 mb-4" />
      <div className="flex items-center mr-9 mt-1.5 space-x-1.75">
        {radiuses.map((radius) => (
          <button
            key={radius}
            onClick={(e) => {
              e.preventDefault();
              setValue('service_radius', radius);
            }}
            className={`text-sm py-0.5 px-2 rounded-md border ${
              service_radius === radius
                ? 'bg-primary-100 text-white p-px border-primary-100'
                : 'bg-background text-text-secondary border-text-secondary'
            }`}
          >
            {radius} {t('kilometers')}
          </button>
        ))}
      </div>
      <Divider classes="mt-7.5 mb-6.75 -mx-4.5" />
      <div className="flex flex-col justify-center items-center mb-[67.6px]">
        <button type="button" className="text-center text-lg text-primary-100 mb-[17.3px]">
          {t('how_profile_looks')}
        </button>
        <button type="button" className="text-lg  text-primary-100">
          {t('delete_questionnaire')}
        </button>
      </div>
    </>
  );
};
