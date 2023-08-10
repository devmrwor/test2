import { useTranslation } from 'next-i18next';
import { useClientContext } from '@/contexts/clientContext';
import { MuiRating } from '../RatingBlocks/MuiRating';
import {
  Comment,
  ThumbUpIcon,
  ShieldIcon,
  WarningIconSm,
  Medal,
  CreditCard,
  UmbrellaIcon,
  Trophy,
  RocketIcon,
  CrownIcon,
  VolunteeringIcon,
} from '../Icons/Icons';
import { Divider } from '../primitives/Divider';
import { Toggle } from '../primitives/Toggle/toggle';
import { useEffect, useState } from 'react';
import { IProfile, IRatingFormProfile } from '../../../common/types/profile';
import { IProfileRating } from '../../../common/types/profile-rating';
import { updateProfileRating } from '@/services/rating';
import { SaveButtonsGroup } from '../SaveButtonsGrop/SaveButtonsGroup';
import { ConfirmDialog } from '../modals/ConfirmDialog';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { Rating } from '../primitives/Rating';

const DATA = {
  service: 'Service',
  marks: 123,
  reviews: 15,
  orders_done: 10,
  position_in_category_rating: 1999,
  top_in_reviews_position: 78,
  orders_on_time_percentage: 94,
  how_long_registered: 6,
};

const DEFAULT_DATA = {
  profile_id: 12345678,
  rating: 4.5,
  secure_deal_available: false,
  services_insured: false,
  provides_volunteer_assistance: false,
};

interface RatingFormProps {
  profile: IProfile;
  isProfileCreated: boolean;
}

export const RatingForm = ({ profile, isProfileCreated }: RatingFormProps) => {
  const router = useRouter();
  const { t } = useTranslation();
  const [ratingData, setRatingData] = useState({
    ...DATA,
    ...DEFAULT_DATA,
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const updateRatingData = async () => {
    try {
      setOpenDialog(false);
      setIsLoading(true);
      const rating = await updateProfileRating(profile.id, ratingData);
      toast.success(t('rating_updated_successfully'));
      console.log(rating);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  useEffect(() => {
    setRatingData((prev) => ({
      ...prev,
      profile_id: profile.id,
      service: profile?.category?.name || t('service'),
      provides_volunteer_assistance: profile.profile_rating?.provides_volunteer_assistance,
      services_insured: profile.profile_rating?.services_insured,
      secure_deal_available: profile.profile_rating?.secure_deal_available,
    }));
  }, [profile, t]);

  const success = 'bg-green-50 text-green-100';
  const warning = 'bg-red-50 text-text-secondary';

  if (!profile || !isProfileCreated) {
    return <h2 className="text-text-primary text-lg">{t('questionnaire_not_created')}</h2>;
  }

  return (
    <div className="pb-25.5">
      <h1 className={'text-text-primary'}>{t('service')}</h1>
      <div className={'bg-green-50 text-green-100 w-fit h-7.5 mt-2 mb-5 px-2 flex items-center justify-center rounded'}>
        {ratingData.service}
      </div>
      <div className="text-lg text-text-primary">
        {profile.name} {profile.surname?.charAt(0)}
        {profile.surname && '.'}
      </div>
      <div className="text-text-secondary -mt-1 leading-5">{t('questionnaire_number')}</div>
      <div className="text-text-secondary">{ratingData.profile_id}</div>
      <Rating
        rating={ratingData.rating}
        reviews={ratingData.marks}
        classes="mt-5.75 text-primary-100"
        iconSize="lg"
        slash={true}
      />
      <div className="mt-3.25 text-primary-100">
        <Comment fill="currentColor" size="lg" />
        <span className="ml-2">{ratingData.reviews}</span>
        <span className="ml-1">{t('reviews_left')}</span>
      </div>
      <div className="mt-2.25 text-primary-100 flex items-center">
        <ThumbUpIcon fill="currentColor" width="21" height="21" />
        <div className="ml-2 pt-1 leading-4">{t('executed_orders', { orders: ratingData.orders_done })}</div>
      </div>
      <Divider classes="mt-6.25 mb-5.25 -mx-4.5" />
      <div className="flex justify-between items-center mb-2.5">
        <ShieldIcon />
        <div className="max-w-messengers text-text-primary">{t('company_approved_documents')}</div>
        <WarningIconSm />
      </div>
      <button className="block mx-auto w-56.5 h-8.75 text-text-secondary border border-darken-background rounded">
        {t('start_verification')}
      </button>
      <Divider classes="mt-5.75 mb-3.5 -mx-4.5" />
      <div className="flex justify-between items-center mb-1.5">
        <span
          className={` text-[23px] ${
            ratingData.position_in_category_rating <= 100 ? 'text-green-100' : 'text-toggle-background'
          }`}
        >
          <Medal fill="currentColor" />
        </span>
        <div className="max-w-messengers text-text-primary">{t('is_in-top-100')}</div>
        <WarningIconSm />
      </div>
      <div
        className={`block mx-auto w-56.75 h-6.25 pt-px text-center rounded ${
          ratingData.position_in_category_rating <= 100 ? success : warning
        }`}
      >
        {t('your_place', { position: ratingData.position_in_category_rating })}
      </div>
      <Divider classes="mt-2.75 mb-7.75 -mx-4.5" />
      <div className="flex justify-between items-center pr-2">
        <div
          className={`flex items-center ${
            ratingData.secure_deal_available ? 'text-green-100' : 'text-toggle-background'
          }`}
        >
          <CreditCard fill="currentColor" size="lg" />
          <div className="text-text-primary ml-2.5 mr-2">{t('secure_deal')}</div>
          <WarningIconSm />
        </div>
        <Toggle
          value={ratingData.secure_deal_available}
          onChange={() => setRatingData({ ...ratingData, secure_deal_available: !ratingData.secure_deal_available })}
        />
      </div>
      <Divider classes="mt-7.75 mb-5.25 -mx-4.5" />
      <div className="flex justify-between items-center pr-2">
        <div
          className={`flex items-center ${ratingData.services_insured ? 'text-green-100' : 'text-toggle-background'}`}
        >
          <UmbrellaIcon fill="currentColor" width="24" />
          <div className="text-text-primary ml-2.5 mr-2 max-w-menu">{t('insured_services')}</div>
        </div>
        <Toggle
          value={ratingData.services_insured}
          onChange={() => setRatingData({ ...ratingData, services_insured: !ratingData.services_insured })}
        />
      </div>
      <Divider classes="mt-4.25 mb-4 -mx-4.5" />
      <div
        className={`flex justify-between items-center mb-1.25 ${
          ratingData.top_in_reviews_position <= 100 ? 'text-green-100' : 'text-toggle-background'
        }`}
      >
        <Trophy fill="currentColor" size="lg" />
        <div className="text-text-primary  max-w-messengers">{t('is_in_top_100_reviews')}</div>
        <WarningIconSm />
      </div>
      <div
        className={`block mx-auto w-56.75 h-6.25 pt-px text-center rounded ${
          ratingData.top_in_reviews_position <= 100 ? success : warning
        }`}
      >
        {t('your_place', { position: ratingData.top_in_reviews_position })}
      </div>
      <Divider classes="mt-4.5 mb-4.75 -mx-4.5" />
      <div
        className={`flex justify-between items-center mb-1.25 ${
          ratingData.orders_on_time_percentage >= 95 ? 'text-green-100' : 'text-toggle-background'
        }`}
      >
        <RocketIcon fill="currentColor" />
        <div className="text-text-primary max-w-messengers">{t('orders_completed_on_time')}</div>
        <WarningIconSm />
      </div>
      <div
        className={`block mx-auto w-56.75 h-6.25 pt-px text-center rounded ${
          ratingData.orders_on_time_percentage >= 95 ? success : warning
        }`}
      >
        {t('you_have_percent', { percent: ratingData.orders_on_time_percentage })}
      </div>
      <Divider classes="mt-6.75 mb-5.5 -mx-4.5" />
      <div
        className={`flex justify-between items-center mb-1.25 ${
          ratingData.how_long_registered >= 36 ? 'text-green-100' : 'text-toggle-background'
        }`}
      >
        <CrownIcon />
        <div className="text-text-primary  max-w-messengers">{t('length_on_platform')}</div>
        <div className="w-3.75 h-3.75"></div>
      </div>
      <div
        className={`block mx-auto w-56.75 h-6.25 pt-px text-center rounded ${
          ratingData.how_long_registered >= 36 ? success : warning
        }`}
      >
        {t('on_platform')}
      </div>
      <Divider classes="mt-6 mb-8.5 -mx-4.5" />
      <div className="flex justify-between items-center pr-2">
        <div
          className={`flex items-center  ${
            ratingData.provides_volunteer_assistance ? 'text-green-100' : 'text-toggle-background'
          }`}
        >
          <VolunteeringIcon fill="currentColor" />
          <div className="text-text-primary ml-2.5 mr-2">{t('provides_volunteer_assistance')}</div>
          <WarningIconSm />
        </div>
        <Toggle
          value={ratingData.provides_volunteer_assistance}
          onChange={() =>
            setRatingData({ ...ratingData, provides_volunteer_assistance: !ratingData.provides_volunteer_assistance })
          }
        />
      </div>
      <Divider classes="mt-6.5 mb-11.5 -mx-4.5" />
      <SaveButtonsGroup isLoading={isLoading} onSave={() => setOpenDialog(true)} onCancel={() => router.back()} />
      <ConfirmDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onSave={updateRatingData}
        customText={t('data_was_changed_confirm')}
      />
    </div>
  );
};
