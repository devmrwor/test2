import { useState } from 'react';
import { Label } from '../primitives/Label/Label';
import { useTranslation } from 'next-i18next';
import { CameraIcon, FemaleIcon, MaleIcon } from '../Icons/Icons';
import { Rating } from '../primitives/Rating';
import { useClientContext } from '@/contexts/clientContext';
import { Divider } from '../primitives/Divider';
import { TextField } from '@mui/material';
import { Emails } from '../ContactFields/Emails';
import { Phones } from '../ContactFields/Phones';
import { Messengers } from '../ContactFields/Messengers';
import { EmailTypes, PhoneTypes, MessengerTypes } from '../../../common/types/contact-types';
import { IsRequiredInput } from '../primitives/IsRequiredInput';
import { PlacesInput } from '../primitives/PlacesInput';
import { DoubleRoundedBtn } from '../Buttons/DoubleRoundedBtn';
import { Gender } from '../../../common/enums/gender';
import { ProfileBlock } from '../primitives/ProfileBlock/ProfileBlock';
import { RateTypes } from '../../../common/enums/rate-types';
import { LanguagesUserSelect } from '../LanguagesSelect/LanguagesSelect';
import { SelectChangeEvent } from '@mui/material/Select';
import { Language } from '../../../common/types/language';
import { StaticFilledField } from '../primitives/StaticField/StaticFilledField';

const RATING = 3.4;
const REVIEWS = 3;

export const MainTabCompany = () => {
  const { t } = useTranslation();
  const { setShowProfilePreview } = useClientContext();
  const [name, setName] = useState<string>('');
  const [surname, setSurname] = useState<string>('');
  const [emails, setEmails] = useState<EmailTypes[]>([]);
  const [phones, setPhones] = useState<PhoneTypes[]>([]);
  const [messengers, setMessengers] = useState<MessengerTypes[]>([]);
  const [address, setAddress] = useState<string>('');
  const [selectedSex, setSelectedSex] = useState<string>(Gender.MALE);
  const [walletData, setWalletData] = useState<string>('0');
  const [rate, setRate] = useState<string>(RateTypes.BASIC);
  const [language, setSelectedLanguage] = useState<string | Language | undefined>('');

  const handleOpenPreview = () => {
    setShowProfilePreview(true);
  };

  const handleLanguageChange = (event: SelectChangeEvent<string | Language | undefined>) => {
    const lang = event.target.value;
    setSelectedLanguage(lang);
    if (lang) {
      // localStorage.setItem('system_lang', lang);
    }
  };

  return (
    <div className="mt-8.5">
      <Label text={t('photo')} caption={t('photo_executor_message')} />
      <div className="flex flex-col items-center justify-center w-24 h-24 bg-background rounded-lg text-text-secondary px-1 mt-1">
        <CameraIcon fill="currentColor" size="2x" />
        <p className="text-center text-base leading-5 ">{t('upload_up_to', { num: 3 })}</p>
      </div>
      <Rating rating={RATING} reviews={REVIEWS} classes="mt-4.5" />
      <button className="text-primary-100 text-lg block mb-7.75" onClick={handleOpenPreview}>
        {t('how_my_profile_looks')}
      </button>
      <Label text={t('name')} caption={t('visible_to_all')} isRequired={true} />
      <TextField fullWidth variant="outlined" size="small" placeholder={t('name_input_placeholder')} value={name} />
      <Label text={t('surname')} caption={t('visible_first_letter')} isRequired={true} classes="mt-4.25" />
      <TextField
        fullWidth
        variant="outlined"
        size="small"
        placeholder={t('surname_input_placeholder')}
        value={surname}
      />
      <Divider classes="-mx-4.5 mt-8.75 mb-7.75" />
      <div className="mb-20">
        <h2 className="text-lg mb-4.5">{t('contacts')}</h2>
        <Emails
          values={emails}
          onChange={(newEmails) => {
            setEmails(newEmails);
          }}
          classes="mb-10.75"
          required={true}
        />
        <Phones
          values={phones}
          onChange={(newPhones) => {
            setPhones(newPhones);
          }}
        />
        <Messengers
          values={messengers}
          onChange={(value) => {
            setMessengers(value);
          }}
        />
        <div className="mt-6.75">
          <IsRequiredInput text="address" filled={address !== ''} />
          <PlacesInput
            placeholder="city_placeholder"
            queryCountries={['ua', 'cz']}
            inputValue={address}
            onChange={(newAddress: string) => {
              setAddress(newAddress);
            }}
          />
        </div>
        <Divider classes="-mx-4.5 mt-8.25 mb-6.25" />
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
          }}
        />
        <Divider classes="-mx-4.5 mt-6.25 mb-7" />
        <ProfileBlock
          heading="verify_documents"
          caption="verify_documents_caption"
          toggle={false}
          dividerStyle="mt-3.75 mb-2.75 -mx-4.5"
        />
        <ProfileBlock heading="wallet" caption={walletData} toggle={false} dividerStyle="mb-4.5 mt-3 -mx-4.5" />
        <ProfileBlock
          heading="rate"
          headingValue={rate}
          caption="cant_receive_reviews"
          toggle={false}
          dividerStyle="mb-3.75 mt-3 -mx-4.5"
        />
        <ProfileBlock
          heading="orders_done"
          headingCaption="visible_to_all"
          count={10}
          caption="orders_word"
          toggle={false}
          dividerStyle="my-3.75 -mx-4.5"
        />
        <ProfileBlock
          heading="reviews_received"
          headingCaption="visible_to_all"
          count={10}
          caption="reviews_for_orders"
          toggle={false}
          dividerStyle="mt-3.25 mb-5.25 -mx-4.5"
        />
        <ProfileBlock
          heading="review_left"
          headingCaption="visible_to_all"
          count={10}
          caption="reviews_to"
          toggle={false}
          dividerStyle="mt-5.5 mb-4.75 -mx-4.5"
        />
        <ProfileBlock
          heading="waiting_for_rating"
          headingCaption="visible_to_all"
          count={6}
          caption="clients_customers"
          toggle={false}
          dividerStyle="mt-5.25 mb-3.75 -mx-4.5"
        />
        <ProfileBlock
          heading="social_media_messengers"
          caption="no_connected"
          text="show_to_executors"
          toggle={false}
          dividerStyle="mb-3.75 mt-4.25 -mx-4.5"
        />
        <ProfileBlock heading="settings" caption="notifications_rules" toggle={false} dividerStyle="my-4.25 -mx-4.5" />
        <ProfileBlock
          heading="deleting_profile"
          caption="all_will_be_deleted"
          toggle={false}
          dividerStyle="mb-11.25 mt-4.25 -mx-4.5"
        />
        <LanguagesUserSelect
          heading={false}
          value={language}
          onChange={handleLanguageChange}
          placeholder="system_language"
        />
        <StaticFilledField
          container="mt-5.75 mb-8.75"
          text="profile_number_executor"
          caption="automatically"
          value={''}
          disabled
        />
        <StaticFilledField container="mb-10.5" text="registration_date" caption="automatically" value={''} disabled />
        <StaticFilledField container=" mb-9" text="date_of_logging" caption="automatically" value={''} disabled />
        <div className="flex flex-col justify-center items-center mb-16.25">
          <button className="text-center text-lg text-primary-100 mb-4.25">{t('change_password')}</button>
          <button className="text-lg  text-primary-100">{t('exit')}</button>
        </div>
      </div>
    </div>
  );
};
