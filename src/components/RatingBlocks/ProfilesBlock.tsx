import { useUsersContext } from '@/contexts/usersContext';
import { useTranslation } from 'next-i18next';
import { ProfilesList } from '../primitives/ProfilesList/ProfilesList';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Label } from '../primitives/Label/Label';
import { FormControlsWrapper } from '../FormControlsWrapper/FormControlsWrapper';
import { fillUserId } from '@/utils/formatUserId';
import { IProfile, IRatingFormProfile } from '../../../common/types/profile';
import { ParagraphWithIcon } from '../primitives/ParagraphWithIcon/ParagraphWithIcon';

import { FormSeparator } from '../primitives/FormSeparator/FormSeparator';
import { UploadedImage } from '../primitives/UploadedImage/UploadedImage';
import { Autocomplete, Button, RadioGroup } from '@mui/material';
import { languagesData } from '../../../common/constants/languages';
import {
  CardIcon,
  ChatIcon,
  PremiumIcon,
  RocketIcon,
  ShieldIcon,
  StarIcon,
  ThumbUpIcon,
  TopExecutorsIcon,
  TopRatedIcon,
  UmbrellaIcon,
  VolunteeringIcon,
} from '../Icons/Icons';
import { useRouter } from 'next/router';
import { Controller, set, useForm } from 'react-hook-form';
import { Language } from '../../../common/types/language';
import { IRatingForm } from '../../../common/types/profile-rating';
import { ConfirmDialog } from '../modals/ConfirmDialog';
import { uniteApiRoutes, uniteRoutes } from '@/utils/uniteRoute';
import { ApiProfileRoutes, ApiRoutes, UserRoutes } from '../../../common/enums/api-routes';
import { useLayout } from '@/contexts/layoutContext';
import { FormControlLabel } from '../primitives/FormControlLabel/FormControlLabel';
import { TextField } from '@mui/material';
import { SaveButtonsGroup } from '../SaveButtonsGrop/SaveButtonsGroup';
import { ControlledCheckboxLabel } from '../primitives/CheckboxLabel/ControlledCheckboxLabel';

export const ProfilesBlock = () => {
  const { t } = useTranslation();
  const { user } = useUsersContext();
  const { addNotification } = useLayout();

  const router = useRouter();
  const query = router.query;

  const profileSubmitRef = useRef<HTMLButtonElement>(null);
  const ratingSubmitRef = useRef<HTMLButtonElement>(null);

  const [profileIndex, setProfileIndex] = useState<number>(+(query.profileId as string) || 0);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [isRatingLoading, setIsRatingLoading] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(false);

  const isFormLoading = isRatingLoading || isProfileLoading;

  const mainProfile: IProfile | undefined = useMemo(() => {
    return user?.profiles?.[profileIndex];
  }, [profileIndex, user]);

  useEffect(() => {
    if (mainProfile) {
      setIsProfileLoading(false);
      const languages = mainProfile.languages;
      profileReset({
        selfie_with_document: mainProfile.selfie_with_document,
        document_photo: mainProfile.document_photo,
        languages: typeof languages === 'string' ? JSON.parse(languages) : languages,
        is_documents_confirmed: mainProfile.is_documents_confirmed,
      });
      if (mainProfile.profile_rating) {
        console.log(mainProfile.profile_rating);
        ratingReset({
          is_top_category: mainProfile.profile_rating.is_top_category,
          secure_deal_available: mainProfile.profile_rating.secure_deal_available,
          top_executor: mainProfile.profile_rating.top_executor,
          services_insured: mainProfile.profile_rating.services_insured,
          order_completed_on_time: mainProfile.profile_rating.order_completed_on_time,
          premium_executor: mainProfile.profile_rating.premium_executor,
          provides_volunteer_assistance: mainProfile.profile_rating.provides_volunteer_assistance,
        });
      } else {
        ratingReset({
          is_top_category: false,
          secure_deal_available: false,
          top_executor: false,
          services_insured: false,
          order_completed_on_time: false,
          premium_executor: false,
          provides_volunteer_assistance: false,
        });
      }
      setIsProfileLoading(false);
    } else {
      setIsProfileLoading(true);
    }
  }, [mainProfile]);

  const setProfile = (index: number) => {
    setProfileIndex(index);
    router.push({
      pathname: router.pathname,
      query: { ...query, profileId: index },
    });
  };

  const {
    handleSubmit: ratingSubmit,
    watch: ratingWatch,
    reset: ratingReset,
    control: ratingControl,
    formState: { errors: ratingErrors, dirtyFields: ratingDirtyFields },
  } = useForm<IRatingForm>({
    defaultValues: {
      is_top_category: false,
      secure_deal_available: false,
      top_executor: false,
      services_insured: false,
      order_completed_on_time: false,
      premium_executor: false,
      provides_volunteer_assistance: false,
    },
  });

  const {
    handleSubmit: profileSubmit,
    watch: profileWatch,
    reset: profileReset,
    control: profileControl,
    formState: { errors: profileErrors, dirtyFields: profileDirtyFields },
  } = useForm<IRatingFormProfile>();

  const wasProfileChanged = !!Object.keys(profileDirtyFields).length;
  const wasRatingChanged = !!Object.keys(ratingDirtyFields).length;

  const onProfileSubmit = async (data: IRatingFormProfile) => {
    try {
      if (!mainProfile) return;
      setIsProfileLoading(true);
      const response = await fetch(uniteApiRoutes([ApiRoutes.PROFILES, mainProfile.id, ApiProfileRoutes.DOCUMENTS]), {
        method: 'PUT',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Error on documents update');
      }

      if (response.ok && !isRatingLoading) {
        router.push(uniteRoutes([ApiRoutes.USERS, UserRoutes.EXECUTORS]));
        addNotification({
          type: 'success',
          text: t('documents_updated_successfully'),
        });
      }
    } catch (error) {
      addNotification({
        type: 'error',
        text: t('error_on_profile_update'),
      });
    } finally {
      setIsProfileLoading(false);
    }
  };

  const onRatingSubmit = async (data: IRatingForm) => {
    try {
      if (!mainProfile) return;
      setIsRatingLoading(true);
      const response = await fetch(uniteApiRoutes([ApiRoutes.PROFILES, ApiProfileRoutes.RATING, mainProfile.id]), {
        method: mainProfile.profile_rating ? 'PUT' : 'POST',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Error on rating update');
      }

      if (response.ok && !isProfileLoading) {
        router.push(uniteRoutes([ApiRoutes.USERS, UserRoutes.EXECUTORS]));
        addNotification({
          type: 'success',
          text: t('updated_successfully'),
        });
      }
    } catch (error) {
      addNotification({
        type: 'error',
        text: t('error_on_rating_update'),
      });
    } finally {
      setIsRatingLoading(false);
    }
  };

  const handleSave = () => {
    if (!profileSubmitRef.current || !ratingSubmitRef.current) return;
    if (wasProfileChanged) {
      profileSubmitRef.current.click();
    }
    if (wasRatingChanged) {
      ratingSubmitRef.current.click();
    }
    setOpenDialog(false);
  };

  const handleCancel = () => {
    if (!wasProfileChanged || !wasRatingChanged) {
      router.back();
    } else {
      setOpenCancelDialog(true);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const documentPhoto = profileWatch('document_photo');
  const selfieWithDocument = profileWatch('selfie_with_document');
  const isDocumentVerified = profileWatch('is_documents_confirmed');
  const languages = profileWatch('languages') || [];

  const is_top_category = ratingWatch('is_top_category');
  const secure_deal_available = ratingWatch('secure_deal_available');
  const top_executor = ratingWatch('top_executor');
  const services_insured = ratingWatch('services_insured');
  const order_completed_on_time = ratingWatch('order_completed_on_time');
  const premium_executor = ratingWatch('premium_executor');
  const provides_volunteer_assistance = ratingWatch('provides_volunteer_assistance');

  console.log(user?.profiles);

  const isProfilesAvailable = user?.profiles && user.profiles.filter((profile) => !profile.is_main).length;

  return (
    <div className="mt-4.5 flex flex-col">
      <div>
        <Label text={t('profile_rating')} />
        {isProfilesAvailable ? (
          <ProfilesList
            list={user.profiles
              .filter((profile) => !profile.is_main)
              .map((profile) => profile?.category?.name || `Profile ${profile.id}`)}
            active={profileIndex}
            onChange={setProfile}
          />
        ) : (
          <p className="text-text-primary">{t('no_profiles_yet')}</p>
        )}
      </div>

      {(isProfilesAvailable || '') && (
        <>
          {mainProfile && (
            <div className="flex flex-col mb-7.5 mt-7">
              <div className="-mb-1.5">
                <Label text={mainProfile.name} />
              </div>
              <FormControlsWrapper>
                <p className="text-text-secondary">{t('profile_number')}</p>
                <p className="text-text-secondary">{fillUserId(user?.id || 0)}</p>
              </FormControlsWrapper>
              <FormControlsWrapper>
                <p className="text-text-secondary">{t('user_profile_number')}</p>
                <p className="text-text-secondary">{fillUserId(mainProfile.id)}</p>
              </FormControlsWrapper>
            </div>
          )}

          <div className="flex flex-col gap-3 mb-3">
            <ParagraphWithIcon text={t('no_ratings')} icon={<StarIcon />} />
            <ParagraphWithIcon text={t('no_feedbacks')} icon={<ChatIcon fill="#b0b0b0" />} />
            <ParagraphWithIcon text={t('completed_orders')} icon={<ThumbUpIcon />} />
          </div>

          <FormSeparator className="my-4" />

          <form onSubmit={profileSubmit(onProfileSubmit)} className="flex flex-col mt-6 gap-3">
            <ParagraphWithIcon text={t('document_verification')} icon={<ShieldIcon />} />
            <div>
              <Label text={t('upload_passport_photo')}></Label>
              <Controller
                control={profileControl}
                name="document_photo"
                defaultValue={documentPhoto}
                render={({ field }) => (
                  <UploadedImage
                    image={documentPhoto}
                    isPlaceholder={!documentPhoto}
                    onRemove={() => field.onChange(null as unknown as string)}
                    handleImageChange={(image) => field.onChange(image)}
                    placeholderText={t('add')}
                  />
                )}
              />
            </div>
            <div className="mb-4">
              <Label text={t('upload_selfie_with_document')}></Label>
              <Controller
                control={profileControl}
                name="selfie_with_document"
                defaultValue={selfieWithDocument}
                render={({ field }) => (
                  <UploadedImage
                    image={selfieWithDocument}
                    isPlaceholder={!selfieWithDocument}
                    onRemove={() => field.onChange(null as unknown as string)}
                    handleImageChange={(image) => field.onChange(image)}
                    placeholderText={t('add')}
                  />
                )}
              />
            </div>
            <ControlledCheckboxLabel
              name="is_documents_confirmed"
              defaultChecked={isDocumentVerified}
              control={profileControl}
              text={t('confirm_verification')}
            />
            <button className="hidden" type="submit" ref={profileSubmitRef}></button>
          </form>

          <FormSeparator className="my-4" />
          <form className="flex flex-col" onSubmit={ratingSubmit(onRatingSubmit)}>
            <button className="hidden" type="submit" ref={ratingSubmitRef}></button>

            <div className="flex flex-col gap-3">
              <ParagraphWithIcon
                isActive={is_top_category}
                text={t('top_10_in_category')}
                icon={<TopExecutorsIcon fill="currentColor" />}
              />

              <Controller
                control={ratingControl}
                name="is_top_category"
                defaultValue={is_top_category || false}
                render={({ field }) => (
                  <RadioGroup value={field.value} onChange={(_, value) => field.onChange(value)}>
                    <FormControlLabel value={true} label={t('yes')} />
                    <FormControlLabel value={false} label={t('no')} />
                  </RadioGroup>
                )}
              />
            </div>

            <FormSeparator className="my-4" />

            <div className="flex flex-col gap-3">
              <ParagraphWithIcon
                isActive={secure_deal_available}
                text={t('secure_deal_available')}
                icon={<CardIcon fill="currentColor" />}
              />
              <ControlledCheckboxLabel
                name="secure_deal_available"
                defaultChecked={secure_deal_available}
                control={ratingControl}
                text={t('agreement_to_receive_card_payments')}
              />
            </div>

            <FormSeparator className="my-4" />

            <div className="flex flex-col gap-3">
              <ParagraphWithIcon
                isActive={services_insured}
                text={t('insured_services')}
                icon={<UmbrellaIcon fill="currentColor" />}
              />
              <ControlledCheckboxLabel
                name="services_insured"
                defaultChecked={services_insured}
                control={ratingControl}
                text={t('confirm_verification')}
              />
            </div>

            <FormSeparator className="my-4" />

            <div className="flex flex-col gap-3">
              <ParagraphWithIcon
                isActive={top_executor}
                text={t('top_100_positive_reviews')}
                icon={<TopRatedIcon fill="currentColor" />}
              />
              <div className="flex item justify-between items-center gap-20">
                <Controller
                  control={ratingControl}
                  name="top_executor"
                  defaultValue={top_executor || false}
                  render={({ field }) => (
                    <RadioGroup value={field.value} onChange={(_, value) => field.onChange(value)}>
                      <FormControlLabel value={true} label={t('yes')} />
                      <FormControlLabel value={false} label={t('no')} />
                    </RadioGroup>
                  )}
                />
                <p className="text-text-secondary">{t('no_award_for_101_or_higher')}</p>
              </div>
            </div>

            <FormSeparator className="my-4" />

            <div className="flex flex-col gap-3">
              <ParagraphWithIcon
                isActive={order_completed_on_time}
                text={t('more_than_95_percent_orders_on_time')}
                icon={<RocketIcon fill="currentColor" />}
              />
              <div className="flex item justify-between items-center gap-20">
                <Controller
                  control={ratingControl}
                  name="order_completed_on_time"
                  defaultValue={order_completed_on_time || false}
                  render={({ field }) => (
                    <RadioGroup value={field.value} onChange={(_, value) => field.onChange(value)}>
                      <FormControlLabel value={true} label={t('yes')} />
                      <FormControlLabel value={false} label={t('no')} />
                    </RadioGroup>
                  )}
                />
                <p className="text-text-secondary">{t('no_award_for_94_percent_or_lower')}</p>
              </div>
            </div>

            <FormSeparator className="my-4" />

            <div>
              <Label text={t('speaking_on')} />

              <Controller
                control={profileControl}
                name="languages"
                defaultValue={languages.map((item) => item.name)}
                render={({ field }) => (
                  <Autocomplete
                    multiple
                    fullWidth
                    options={languagesData.map((item) => item.name)}
                    value={field?.value?.map((item) => item.name) || []}
                    renderInput={(params) => <TextField placeholder={t('choose_language')} {...params} size="small" />}
                    onChange={(_, value) =>
                      field.onChange(value.map((item) => languagesData.find((lang) => lang.name === item) as Language))
                    }
                  />
                )}
              />
            </div>

            <FormSeparator className="my-4" />

            <div className={'flex flex-col gap-3 my-1'}>
              <ParagraphWithIcon
                isActive={premium_executor}
                text={t('premium_contractor_3_years_on_platform')}
                icon={<PremiumIcon fill="currentColor" />}
              />
              <ControlledCheckboxLabel
                name="premium_executor"
                defaultChecked={premium_executor}
                control={ratingControl}
                text={t('confirm_verification')}
              />
            </div>

            <FormSeparator className="my-4" />

            <div className="flex flex-col gap-3">
              <ParagraphWithIcon
                isActive={provides_volunteer_assistance}
                text={t('provides_volunteer_assistance')}
                icon={<VolunteeringIcon fill="currentColor" />}
              />
              <ControlledCheckboxLabel
                name="provides_volunteer_assistance"
                defaultChecked={provides_volunteer_assistance}
                control={ratingControl}
                text={t('confirm_verification')}
              />
            </div>
          </form>

          <SaveButtonsGroup
            wrapperClassName="mt-17 justify-between flex w-full mx-auto gap-4"
            isLoading={isFormLoading}
            onSave={() => setOpenDialog(true)}
            onCancel={handleCancel}
          />
        </>
      )}
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
          onSave={() => router.back()}
          customText={t('data_was_changed_cancel')}
        />
      )}
    </div>
  );
};
