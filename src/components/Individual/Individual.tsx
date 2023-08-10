import { useCallback, useEffect, useState } from 'react';
import { TextField, Box } from '@mui/material';
import { Label } from '../primitives/Label/Label';
import { useTranslation } from 'next-i18next';
import { FemaleIcon, MaleIcon, CircleCheck } from '../Icons/Icons';
import Link from 'next/link';
import { Phones } from '../ContactFields/Phones';
import { Phone } from '../../../common/types/individual';
import { Emails } from '../ContactFields/Emails';
import { Messengers } from '../ContactFields/Messengers';
import { ProfileBlock } from '../primitives/ProfileBlock/ProfileBlock';
import { Language } from '../../../common/types/language';
import { StaticFilledField } from '../primitives/StaticField/StaticFilledField';
import { Navigation } from '../Navigation/Navigation';
import { NavigationMenu } from '../../../common/enums/navigation-menu';
import { DoubleRoundedBtn } from '../Buttons/DoubleRoundedBtn';
import { LanguagesUserSelect } from '../LanguagesSelect/LanguagesSelect';
import { Gender } from '../../../common/enums/gender';
import { SelectChangeEvent } from '@mui/material/Select';
import { useClientContext } from '@/contexts/clientContext';
import { Toggle } from '../primitives/Toggle/toggle';
import { ApiRoutes, ApiUsersRoutes, ClientRoutes } from '../../../common/enums/api-routes';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';
import { Routes } from '../../../common/enums/api-routes';
import { uniteApiRoutes, uniteRoutes } from '@/utils/uniteRoute';
import { UploadPhoto } from '../UploadPhoto/UploadPhoto';
import { PlacesInput } from '../primitives/PlacesInput';
import { secondary } from '@/themes/colors';
import { MuiRating } from '@/components/RatingBlocks/MuiRating';
import { IsRequiredInput } from '@/components/primitives/IsRequiredInput';
import { uniteValues } from '@/utils/uniteValues';
import { toggleFunctionWrapper } from '@/utils/toggleFunctionWrapper';
import { DeleteDialog } from '../modals/DeleteDialogWarning';
import { toast } from 'react-toastify';
import { Rating } from '../primitives/Rating';
import { EmailTypes, PhoneTypes, MessengerTypes } from '../../../common/types/contact-types';

const RATING = 3.4;
const REVIEWS = 3;

export const Individual = () => {
  const { t, i18n } = useTranslation();
  const { setShowSocialMedia, setShowProfilePreview, userData, setUserData } = useClientContext();
  const userName =
    userData.name && userData.surname ? `${userData.name} ${userData.surname}` : userData.name ? userData.name : '';
  const [name, setName] = useState<string>(userName);
  const [ratingValue, setRatingValue] = useState<number | null>(3);
  const [phones, setPhones] = useState<PhoneTypes[]>(
    userData.phone ? (uniteValues(userData.phone, userData.additional_phones) as Phone[]) : []
  );
  const [emails, setEmails] = useState<EmailTypes[]>(
    userData.email ? uniteValues(userData.email, userData.additional_emails) : []
  );
  const [messengers, setMessengers] = useState<MessengerTypes[]>(userData.messengers ?? []);
  const [address, setAddress] = useState<string>(userData.address || '');
  const [showAddress, setShowAddress] = useState<boolean>(userData.show_address_publicly ?? false);
  const [language, setSelectedLanguage] = useState<string | Language | undefined>('');
  const [selectedSex, setSelectedSex] = useState<string>(userData.gender ?? Gender.MALE);
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
    setUserData({ ...userData, language: lang });
  };

  const handleNameValidation = useCallback(
    (name: string) => {
      const regName = /^[A-Z][a-zA-Z]{1,}[ ][A-Z][a-zA-Z]{1,}$/;
      return regName.test(name);
    },
    [name]
  );

  const handleOpenPreview = () => {
    setShowProfilePreview(true);
  };

  const handleDateConvert = (date: string) => {
    const newDate = new Date(date);
    return newDate.toLocaleString('fr-CH');
  };

  useEffect(() => {
    if (photo) {
      setUserData({ ...userData, photo });
    }
  }, [photo]);

  const handleSignOut = async () => {
    await signOut({
      callbackUrl: uniteRoutes([Routes.ROOT]),
      redirect: false,
    });
    router.push(uniteRoutes([ClientRoutes.CLIENT]));
  };

  // if (isLoading || !userProfile) {
  //   return <></>;
  // }

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
      <div className="mb-[33.3px]">
        <div className="flex items-center space-x-1.75">
          <span className="text-red-100">*</span>
          <Label text={t('name')} />
          <CircleCheck fill={handleNameValidation(name) ? '#55bc7d' : '#f3f3f3'} size="sm" />
        </div>
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          placeholder={t('enter_name')}
          value={name}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setName(event.target.value);
            const [name, surname] = event.target.value.split(' ');
            setUserData({ ...userData, name, surname: surname || null });
          }}
        />
      </div>
      <div className="flex items-center ml-0.5 mb-[27px]">
        <UploadPhoto text="upload_photo" photo={photo} setPhoto={setPhoto} individual={true} />
      </div>
      {/* <FormControlsWrapper type="left" classes="mb-[9px] items-baseline"> */}
      {/*<Rating name="read-only" value={ratingValue} readOnly />*/}
      {/*<Rating emptySymbol={<IconSun size="1rem" />} fullSymbol={<IconMoon size="1rem" />} />*/}
      {/* <MuiRating defaultValue={RATING} readOnly />
        <p className="ml-0.5">{RATING}</p>
        <div className="mx-1.5">-</div>
        <p>
          {REVIEWS} {t('marks')}
        </p>
      </FormControlsWrapper> */}
      <Rating rating={userData.statistic?.reviews_rating || 0} reviews={userData.statistic?.reviews_count || 0} />
      <Link className="text-primary-100 text-lg mb-2" href="#">
        {t('how_to_get_rating')}
      </Link>
      <button className="text-primary-100 text-lg block" onClick={handleOpenPreview}>
        {t('how_my_profile_looks')}
      </button>
      <div className="mt-9.5 mb-4.5 -mx-4.5 border-background-decorative border-b"></div>
      <div>
        <h2 className="text-lg mb-[18.4px]">{t('contacts')}</h2>
        <Emails
          values={emails}
          onChange={(newEmails) => {
            setEmails(newEmails);
            const [email, ...additional_emails] = newEmails.map((email) => email.value);
            setUserData({ ...userData, email, additional_emails });
          }}
          classes="mb-10.75"
        />
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
        {/* <Address
          value={address}
          onChange={(newAddress) => {
            setAddress(newAddress);
            setUserData({ ...userData, address: newAddress });
          }}
          classes="mt-7.5"
        /> */}
        {/* FIXME places api hardcoded countries */}
        <div className="mt-7.5">
          <IsRequiredInput text="address" filled={address !== ''} />
          <PlacesInput
            placeholder="city_placeholder"
            queryCountries={['ua', 'cz']}
            inputValue={address}
            onChange={(newAddress: string) => {
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
      <div className="mt-8.25 mb-7.5 -mx-4.5 border-background-decorative border-b"></div>
      <DoubleRoundedBtn
        firstVal={{
          value: Gender.MALE,
          text: 'male_user',
          icon: <MaleIcon fill={selectedSex === Gender.MALE ? '#000' : '#949494'} />,
        }}
        secondVal={{
          value: Gender.FEMALE,
          text: 'female_user',
          icon: <FemaleIcon fill={selectedSex === Gender.FEMALE ? '#000' : '#949494'} />,
        }}
        selectedValue={selectedSex}
        onChange={(value) => {
          setSelectedSex(value);
          setUserData({ ...userData, gender: value });
        }}
      />
      <div className="mt-[31.6px] mb-5 -mx-4.5 border-background-decorative border-b"></div>
      <ProfileBlock
        heading="feedbacks_to_me"
        count={3}
        caption="feedbacks"
        text="show_to_executors"
        dividerStyle="-mx-4.5 mt-3 mb-5.5"
        show={showFeedbacks}
        setShow={toggleFunctionWrapper(
          (value) => setShowFeedbacks(value),
          (value) => setUserData({ ...userData, show_company_feedbacks: value })
        )}
        onClick={() => router.push(ClientRoutes.REVIEWS)}
      />
      <ProfileBlock
        heading="my_orders"
        count={10}
        caption="orders_placed_by_customer"
        text="show_to_executors"
        dividerStyle="mt-[18.4px] mb-2.25 -mx-4.5"
        show={showOrders}
        setShow={toggleFunctionWrapper(
          (value) => setShowOrders(value),
          (value) => setUserData({ ...userData, show_orders: value })
        )}
        onClick={() => router.push(uniteRoutes([ClientRoutes.CLIENT, ClientRoutes.ORDERS]))}
      />
      <ProfileBlock
        heading="my_feedbacks"
        count={8}
        caption="feedbacks_left"
        text="show_to_executors"
        dividerStyle="mb-3.5 mt-6 -mx-4.5"
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
        dividerStyle="mb-2.25 mt-5.75 -mx-4.5"
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
        dividerStyle="mb-5.5 mt-3.5 -mx-4.5"
      />
      <ProfileBlock
        heading="deleting_profile"
        caption="all_will_be_deleted"
        toggle={false}
        dividerStyle="mb-7.5 mt-4.5 -mx-4.5"
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
        value={userData.created_at ? handleDateConvert(userData.created_at) : ''}
        disabled
      />
      <StaticFilledField
        container=" mb-6.5"
        text="date_of_logging"
        caption="automatically"
        value={userData.created_at ? handleDateConvert(userData.login_at) : ''}
        disabled
      />
      <div className="flex flex-col justify-center items-center mb-[67.6px]">
        <button className="text-center text-lg text-primary-100 mb-[17.3px]">{t('change_password')}</button>
        <button className="text-lg  text-primary-100" onClick={handleSignOut}>
          {t('exit')}
        </button>
      </div>
      <DeleteDialog
        customText={t('delete_profile_warning')}
        buttonText={t('delete')}
        onSave={deleteHandler}
        onClose={() => setIsOpenDeleteDialog(false)}
        open={isOpenDeleteDialog}
      />
      <Navigation selectedRoute={NavigationMenu.PROFILE} />
    </>
  );
};
