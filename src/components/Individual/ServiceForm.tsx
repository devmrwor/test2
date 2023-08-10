import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { BackHeader } from '../primitives/BackHeader/BackHeader';
import { useClientContext } from '@/contexts/clientContext';
import { DoubleButton } from '../Buttons/DoubleButton';
import { CustomerTypes } from '../../../common/enums/customer-type';
import { LanguageBar } from '../primitives/LanguageBar';
import { EmptyDataComponent } from '../Reviews/Customer/EmptyDataComponent';
import { DropdownIcon, StarIcon } from '../Icons/Icons';
import { ExecutorQuestionnaireTabs } from '../../../common/enums/executor-type';
import { TabsSwitcher } from '../primitives/TabsSwitcher/TabsSwitcher';
import { MainForm } from './MainForm';
import { AboutServicesForm } from './AboutServicesForm';
import { useQuery } from 'react-query';
import { Controller, set, useForm } from 'react-hook-form';
import { JobTypes } from '../../../common/enums/job-types';
import { Gender } from '../../../common/enums/gender';
import { radiuses } from '../../../common/constants/radiuses';
import { SaveButtonsGroup } from '../SaveButtonsGrop/SaveButtonsGroup';
import { ConfirmDialog } from '../modals/ConfirmDialog';
import { RatingForm } from './RatingForm';
import { useRouter } from 'next/router';
import { IProfile } from '../../../common/types/profile';
import { Autocomplete, Box, TextField } from '@mui/material';
import { ICategory } from '../../../common/types/category';
import { getAllCategories } from '@/services/categories';
import { joiResolver } from '@hookform/resolvers/joi';
import { ClientProfileSchema } from '../../../common/validation/profile-schema';
import classNames from 'classnames';
import { toast } from 'react-toastify';

interface InitialDataProps {
  initialData: IProfile;
  isProfileCreated?: boolean;
  emptyFormProp?: boolean;
  onBack?: () => void;
}

export const ServiceForm = ({
  onBack,
  initialData,
  emptyFormProp = true,
  isProfileCreated = false,
}: InitialDataProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = router.query;
  const { userData, setFillProfile, createProfile, updateProfile } = useClientContext();
  const [customerType, setCustomerType] = useState<string>(userData?.type || CustomerTypes.INDIVIDUAL);
  const [emptyForm, setEmptyForm] = useState<boolean>(emptyFormProp);
  const [selectedTab, setSelectedTab] = useState<string>(ExecutorQuestionnaireTabs.ABOUT_SERVICE);
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setTimeout(() => setSelectedTab(ExecutorQuestionnaireTabs.MAIN), 100);
  }, []);

  const submitRef = useRef<HTMLButtonElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm<IProfile>({
    resolver: joiResolver(ClientProfileSchema),
  });

  useEffect(() => {
    const allowedFields: (keyof IProfile)[] = [
      'name',
      'surname',
      'email',
      'address',
      'additional_address',
      'type',
      'gender',
      'job_type',
      'category_id',
      'company_name',
      'services_pricelist',
      'volunteering',
      'company_tin',
      'photo',
      'additional_photos',
      'additional_emails',
      'phone',
      'additional_phones',
      'is_working_remotely',
      'messengers',
      'service_radius',
      'can_visit_client',
      'show_additional_address_publicly',
      'portfolio_photos',
      'description',
      'tags',
      'languages',
      'company_logo',
      'remote_address',
      'show_address_publicly',
    ];
    const filteredData: Partial<IProfile> = {};

    allowedFields.forEach((key) => {
      filteredData[key] = initialData[key];
    });

    reset(filteredData);
  }, [initialData]);

  const type = watch('type') || CustomerTypes.INDIVIDUAL;

  const handleBack = () => {
    setFillProfile(false);
    onBack && onBack();
  };

  const handleCreateQuestionnaire = () => {
    setEmptyForm((prev) => !prev);
  };

  const handleTabsChange = (event: React.SyntheticEvent, newValue: string) => {
    setSelectedTab(newValue);
  };

  const { data: categories, isLoading: isCategoriesLoading } = useQuery<ICategory[]>('categories', () =>
    getAllCategories()
  );

  const onSubmit = async (data: IProfile) => {
    setIsLoading(true);
    id ? await updateProfile({ ...data, type }) : await createProfile({ ...data, type });
    setIsLoading(false);
    setFillProfile(false);
  };

  const handleSave = () => {
    setOpenDialog(false);
    submitRef.current?.click();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const setType = (type: string) => {
    setValue('type', type);
    setCustomerType(type);
  };

  useEffect(() => {
    if (!Object.keys(errors).length) return;
    toast.error(
      Object.values(errors)
        .map((error) => t(error.message))
        .join(' ')
    );
  }, [errors]);

  return (
    <>
      <BackHeader
        heading="questionnaire"
        onClick={handleBack}
        buttonContent={t('save')}
        buttonFunc={() => setOpenDialog(true)}
        classes="pl-2.75 pr-2.25 mt-2.75"
      />
      <div className="mt-8.25 pl-5 pr-3.75">
        {/* FIXME: at this moment translations is missing  <LanguageBar /> */}
        <DoubleButton value={watch('type') || customerType} setValue={setType} classes="mt-4.5" />
        {emptyForm ? (
          <div className="flex flex-col items-center">
            <EmptyDataComponent icon={<StarIcon width="67" height="59" />} heading="empty_service" />
            <button
              onClick={handleCreateQuestionnaire}
              className="flex items-center justify-center bg-primary-100 w-62.25 h-8.75 mt-7 text-grey-0 rounded"
            >
              {t('fill_questionnaire')}
            </button>
          </div>
        ) : (
          <>
            <TabsSwitcher
              data={ExecutorQuestionnaireTabs}
              value={selectedTab}
              onValueChange={handleTabsChange}
              plainObject={true}
            />
            <form onSubmit={handleSubmit(onSubmit)} className="mt-5.75">
              {categories && selectedTab !== ExecutorQuestionnaireTabs.RATING && (
                <Controller
                  name="category_id"
                  control={control}
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
                          label={t('select_service')}
                          placeholder={t('select_service')}
                          error={Boolean(error)}
                          helperText={t(error?.message)}
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
              {selectedTab === ExecutorQuestionnaireTabs.MAIN && (
                <MainForm control={control} setValue={setValue} watch={watch} register={register} errors={errors} />
              )}
              {selectedTab === ExecutorQuestionnaireTabs.ABOUT_SERVICE && (
                <AboutServicesForm setValue={setValue} watch={watch} register={register} errors={errors} />
              )}
              {selectedTab === ExecutorQuestionnaireTabs.RATING && (
                <RatingForm profile={initialData} isProfileCreated={isProfileCreated} />
              )}
              {selectedTab !== ExecutorQuestionnaireTabs.RATING && (
                <div className={classNames('mb-6', selectedTab === ExecutorQuestionnaireTabs.MAIN && '-mt-10')}>
                  <SaveButtonsGroup
                    isLoading={isLoading}
                    onSave={() => setOpenDialog(true)}
                    onCancel={() => router.back()}
                    submitRef={submitRef}
                  />
                  <ConfirmDialog
                    open={openDialog}
                    onClose={handleCloseDialog}
                    onSave={handleSave}
                    customText={t('data_was_changed_confirm')}
                  />
                </div>
              )}
            </form>
          </>
        )}
      </div>
    </>
  );
};
