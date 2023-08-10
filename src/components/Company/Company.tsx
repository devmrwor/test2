import { TextField, Box } from '@mui/material';
import { Label } from '../primitives/Label/Label';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { CircleCheck } from '../Icons/Icons';
import Link from 'next/link';
import { Phones } from '../ContactFields/Phones';
import { Phone } from '../../../common/types/individual';
import { Emails } from '../ContactFields/Emails';
import { Messengers } from '../ContactFields/Messengers';
import { Address } from '../ContactFields/Address';
import { ProfileBlock } from '../primitives/ProfileBlock/ProfileBlock';
import { Rating } from '../primitives/Rating';
import { Language } from '../../../common/types/language';
import { StaticFilledField } from '../primitives/StaticField/StaticFilledField';
import { Navigation } from '../Navigation/Navigation';
import { NavigationMenu } from '../../../common/enums/navigation-menu';
import { SelectChangeEvent } from '@mui/material/Select';
import { useClientContext } from '@/contexts/clientContext';
import { Toggle } from '../primitives/Toggle/toggle';
import { ApiRoutes, ApiUsersRoutes, ClientRoutes } from '../../../common/enums/api-routes';
import { useRouter } from 'next/router';
import { UploadPhoto } from '../UploadPhoto/UploadPhoto';
import { secondary } from '@/themes/colors';
import { MuiRating } from '@/components/RatingBlocks/MuiRating';
import { LanguagesUserSelect } from '@/components/LanguagesSelect/LanguagesSelect';
import { uniteValues } from '@/utils/uniteValues';
import { IsRequiredInput } from '../primitives/IsRequiredInput';
import { PlacesInput } from '../primitives/PlacesInput';
import { toggleFunctionWrapper } from '@/utils/toggleFunctionWrapper';
import { toast } from 'react-toastify';
import { uniteApiRoutes, uniteRoutes } from '@/utils/uniteRoute';
import { DeleteDialog } from '../modals/DeleteDialogWarning';

const RATING = 3.4;
const REVIEWS = 3;

export const Company = () => {
  const { t, i18n } = useTranslation();
  const { setShowSocialMedia, setShowProfilePreview, setUserData, userData } = useClientContext();
  const [companyName, setCompanyName] = useState<string>(userData.company_name);
  const [identificationNumber, setIdentificationNumber] = useState<string>(userData.company_tin);
  const [ratingValue, setRatingValue] = useState<number | null>(3);
  const [phones, setPhones] = useState(
    userData.phone ? (uniteValues(userData.phone, userData.additional_phones) as Phone[]) : []
  );
  const [emails, setEmails] = useState(userData.email ? uniteValues(userData.email, userData.additional_emails) : []);
  const [messengers, setMessengers] = useState(userData.messengers ?? []);
  const [address, setAddress] = useState<string>(userData.address || '');
  const [showAddress, setShowAddress] = useState<boolean>(userData.show_address_publicly ?? false);
  const [companyWebsite, setCompanyWebsite] = useState<string>(userData.company_site);
  const [language, setSelectedLanguage] = useState<string | Language | undefined>('');
  const [showFeedbacks, setShowFeedbacks] = useState<boolean>(!!userData?.show_company_feedbacks);
  const [showOrders, setShowOrders] = useState<boolean>(!!userData?.show_orders);
  const [showReviews, setShowReviews] = useState<boolean>(!!userData?.show_feedbacks);
  const [showReviewMark, setShowReviewMark] = useState<boolean>(!!userData?.show_waiting_for_review);
  const [showSocials, setShowSocials] = useState<boolean>(!!userData?.show_messengers);
  const [photo, setPhoto] = useState<string>(userData.photo || '');
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState<boolean>(false);
  const router = useRouter();

  const handleLanguageChange = (event: SelectChangeEvent<{ value: string | Language | undefined }>) => {
    const lang = event.target.value;
    setSelectedLanguage(lang);
    if (lang) {
      localStorage.setItem('system_lang', lang);
      i18n.changeLanguage(lang);
    }
  };

  const handleOpenPreview = () => {
    setShowProfilePreview(true);
  };

  useEffect(() => {
    if (photo) {
      setUserData({ ...userData, photo });
    }
  }, [photo]);

  const handleDateConvert = (date: string) => {
    const newDate = new Date(date);
    return newDate.toLocaleString('fr-CH');
  };

  const deleteHandler = async () => {
    try {
      const response = await fetch(uniteApiRoutes([ApiRoutes.USERS, ApiUsersRoutes.ME]), {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error deleting user');
      }
      toast.success(t('profile_deleted_successfully'));
      router.push(uniteRoutes([ClientRoutes.CLIENT]));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <>
      <div className="ml-0.5 mb-[21.6px]">
        <Label text={t('logo')} caption={t('logo_formats')} captionLowerCase={false} />
        <UploadPhoto text="upload_logo" photo={photo} setPhoto={setPhoto} />
      </div>
      <Rating rating={userData.statistic?.reviews_rating || 0} reviews={userData.statistic?.reviews_count || 0} />
      <Link className="text-primary-100 text-lg mb-2" href="#">
        {t('how_to_get_rating')}
      </Link>
      <button className="text-primary-100 text-lg block" onClick={handleOpenPreview}>
        {t('how_my_profile_looks')}
      </button>
      <div className="mt-[23.2px]">
        <div className="flex items-center space-x-1.75">
          <Label text={t('company_name')} caption={t('visible_to_all')} isRequired={true} />
          {/* <CircleCheck fill={handleNameValidation(companyName) ? '#36abd6' : '#e2e2e2'} /> */}
          <CircleCheck fill={companyName !== '' ? '#55bc7d' : '#e2e2e2'} size="sm" />
        </div>
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          placeholder={t('company_name_placeholder')}
          value={companyName}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setCompanyName(event.target.value);
            setUserData({ ...userData, company_name: event.target.value });
          }}
          sx={{
            '& .MuiInputBase-input': {
              paddingTop: '6px',
              paddingBottom: '6px',
            },
          }}
        />
      </div>
      <div className="mt-4.25">
        <div className="flex items-center space-x-1.75">
          <Label text={t('taxpayer_number')} caption={t('hidden_from_clients')} isRequired={true} />
          <CircleCheck fill={identificationNumber !== '' ? '#55bc7d' : '#e2e2e2'} size="sm" />
        </div>
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          placeholder="34567352536"
          value={identificationNumber}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setIdentificationNumber(event.target.value);
            setUserData({ ...userData, company_tin: event.target.value });
          }}
          sx={{
            '& .MuiInputBase-input': {
              paddingTop: '6px',
              paddingBottom: '6px',
            },
          }}
        />
      </div>
      <div className="mt-[23.87px] mb-4.5 -mx-4.5 border-background-decorative border-b"></div>
      <div>
        <h2 className="text-lg mb-[18.4px]">{t('contacts')}</h2>
        <div>
          <Emails
            values={emails}
            onChange={(newEmails) => {
              setEmails(newEmails);
              const [email, ...additional_emails] = newEmails.map((email) => email.value);
              setUserData({ ...userData, email, additional_emails });
            }}
            classes="mb-10.75"
          />
        </div>
        <Phones
          values={phones}
          onChange={(newPhones) => {
            setPhones(newPhones);
            const [phone, ...additional_phones] = newPhones.map((phone) => phone.value);
            setUserData({ ...userData, phone, additional_phones });
          }}
        />
        <Messengers
          values={messengers}
          onChange={(value) => {
            setMessengers(value);
            setUserData({ ...userData, messengers: value });
          }}
        />
        {/* <Address value={address} onChange={(newAddress) => setAddress(newAddress)} classes="mt-7.5" /> */}
        <div className="mt-7.5">
          <IsRequiredInput text="address" filled={address !== ''} />
          <PlacesInput
            placeholder="city_placeholder"
            queryCountries={['ua', 'cz']}
            inputValue={address}
            onChange={(newAddress) => {
              setAddress(newAddress);
              setUserData({ ...userData, address: newAddress });
            }}
          />
        </div>
        <div className="flex justify-between items-center mt-2.25">
          <p className="text-text-secondary">{t('show_address_to_clients')}</p>
          <Toggle
            value={showAddress}
            onChange={() => {
              setShowAddress((prev) => !prev);
              setUserData({ ...userData, show_address_publicly: !showAddress });
            }}
          />
        </div>
      </div>
      <div className="mt-9">
        <div className="flex items-center space-x-1.75">
          <Label text={t('company_website')} />
          <CircleCheck fill={companyWebsite !== '' ? '#55bc7d' : '#f3f3f3'} size="sm" />
        </div>
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          placeholder="www.site.com"
          value={companyWebsite}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setCompanyWebsite(event.target.value);
            setUserData({ ...userData, company_site: event.target.value });
          }}
          sx={{
            '& .MuiInputBase-input': {
              paddingTop: '6px',
              paddingBottom: '6px',
            },
          }}
        />
      </div>
      <div className="mt-[34.7px] mb-[17.4px] -mx-4.5 border-background-decorative border-b"></div>
      <ProfileBlock
        heading="my_orders"
        count={10}
        caption="orders_placed_by_customer"
        text="show_to_executors"
        dividerStyle="mt-4 mb-[17.8px] -mx-4.5"
        show={showOrders}
        onClick={() => router.push(uniteRoutes([ClientRoutes.CLIENT, ClientRoutes.ORDERS]))}
        setShow={toggleFunctionWrapper(
          (value) => setShowOrders(value),
          (value) => setUserData({ ...userData, show_orders: value })
        )}
      />
      <ProfileBlock
        heading="company_feedbacks"
        count={3}
        caption="feedbacks"
        text="show_to_executors"
        dividerStyle="-mx-4.5 mt-3 mb-2.25"
        show={showFeedbacks}
        setShow={toggleFunctionWrapper(
          (value) => setShowFeedbacks(value),
          (value) => setUserData({ ...userData, show_company_feedbacks: value })
        )}
        onClick={() => router.push(ClientRoutes.REVIEWS)}
      />
      <ProfileBlock
        heading="my_feedbacks"
        count={8}
        caption="feedbacks_left"
        text="show_to_executors"
        dividerStyle="mb-2.25 mt-[23.5px] -mx-4.5"
        show={showReviews}
        setShow={toggleFunctionWrapper(
          (value) => setShowReviews(value),
          (value) => setUserData({ ...userData, show_feedbacks: value })
        )}
        onClick={() => router.push(ClientRoutes.REVIEWS)}
      />
      <ProfileBlock
        heading="waiting_for_rating"
        count={6}
        caption="executors_count"
        text="show_to_executors"
        dividerStyle="mt-6 mb-[13.8px] -mx-4.5"
        show={showReviewMark}
        setShow={toggleFunctionWrapper(
          (value) => setShowReviewMark(value),
          (value) => setUserData({ ...userData, show_waiting_for_review: value })
        )}
        onClick={() => router.push(ClientRoutes.REVIEWS)}
      />
      <ProfileBlock
        heading="social_media_messengers"
        caption="no_connected"
        text="show_to_executors"
        dividerStyle="mb-1.75 mt-5.75 -mx-4.5"
        show={showSocials}
        setShow={toggleFunctionWrapper(
          (value) => setShowSocials(value),
          (value) => setUserData({ ...userData, show_messengers: value })
        )}
        onClick={() => setShowSocialMedia(true)}
      />
      <ProfileBlock
        heading="settings"
        caption="notifications_rules"
        toggle={false}
        dividerStyle="mb-5.25 mt-2.25 -mx-4.5"
      />
      <ProfileBlock
        heading="delete_company_profile"
        caption="all_will_be_deleted"
        toggle={false}
        dividerStyle="mb-7.5 mt-4.25 -mx-4.5"
        onClick={() => setIsOpenDeleteDialog(true)}
      />
      <LanguagesUserSelect value={language} onChange={handleLanguageChange} placeholder="system_language" />
      <StaticFilledField
        container="mt-7.75 mb-6.5"
        text="profile_number"
        caption="automatically"
        value={userData.id ?? ''}
        disabled
      />
      <StaticFilledField
        container="mb-6.5"
        text="registration_date"
        caption="automatically"
        value={userData.created_at ? handleDateConvert(userData?.created_at) : ''}
        disabled
      />
      <StaticFilledField
        container=" mb-6.5"
        text="date_of_logging"
        caption="automatically"
        value={userData.created_at ? handleDateConvert(userData.login_at) : ''}
        disabled
      />
      <div className="flex flex-col justify-center items-center pb-[67.6px]">
        <button className="text-center text-lg text-primary-100 mb-[17.3px]">{t('change_password')}</button>
        <button className="text-lg  text-primary-100">{t('exit')}</button>
      </div>
      <Navigation selectedRoute={NavigationMenu.PROFILE} />
      <DeleteDialog
        customText={t('delete_profile_warning')}
        buttonText={t('delete')}
        onSave={deleteHandler}
        onClose={() => setIsOpenDeleteDialog(false)}
        open={isOpenDeleteDialog}
      />
    </>
  );
};
