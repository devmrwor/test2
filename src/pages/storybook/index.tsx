// @ts-ignore

import { NextPage } from 'next';
import Link from 'next/link';
import { AddButton, ShareButton, SuccessLink, SuccessOutline, SuccessSolid } from '@/components/Buttons';
import { Toggle } from '@/components/primitives/Toggle/toggle';
import MessengerList from '@/components/MessengersList/MessengersList';
import { messengers } from '../../../common/constants/messengers';
import { Label } from '@/components/primitives/Label/Label';
import MetaTagChooser from '@/components/MetaTagsSelector/MetaTagsSelector';
import { FormControlLabel } from '@/components/primitives/FormControlLabel/FormControlLabel';
import PriceList from '@/components/PriceList/PriceList';
import { useState } from 'react';
import { ButtonGroup } from '@/components/ButtonGroup/ButtonGroup';
import { TabsGroup } from '@/components/TabsGroup/TabsGroup';
import { UploadedImage } from '@/components/primitives/UploadedImage/UploadedImage';
import { EditTablePopup } from '@/components/EditTablePopup';
import { ProfileBlock } from '@/components/primitives/ProfileBlock/ProfileBlock';
import { StaticFilledField } from '@/components/primitives/StaticField/StaticFilledField';
import { Navigation } from '@/components/Navigation/Navigation';
import { DoubleRoundedBtn } from '@/components/Buttons/DoubleRoundedBtn';
import { SegmentedControls } from '@/components/primitives/SegmentedControl/SegmentedControl';
import { DoubleButton } from '@/components/Buttons/DoubleButton';
import { BurgerButton } from '@/components/Buttons/BurgerButton';
import { BackHeader } from '@/components/primitives/BackHeader/BackHeader';
import { FemaleIcon, MaleIcon } from '@/components/Icons/Icons';
import { SegmentedControl } from '@mantine/core';
import { CustomSelect } from '@/components/primitives/CustomSelect';
import { languagesData } from '../../../common/constants/languages';
import { Messengers } from '@/components/ContactFields/Messengers';
import { Phones } from '@/components/ContactFields/Phones';
import { MetaTagsButton } from '@/components/Buttons/ready/MetaTagsButton';
import { SearchInput } from '@/components/primitives/SearchInput/SearchInput';
import { SecondaryBaseButton } from '@/components/Buttons/SecondaryBaseButton';
import { PlacesInput } from '@/components/primitives/PlacesInput';
import IOSSwitch from '@/components/primitives/IOSswitch';

const noop = () => null;

const AdminPage: NextPage = ({}) => {
  const [isToggled, setIsToggled] = useState(false);
  const [showReviews, setShowReviews] = useState<boolean>(false);
  const [selectedSex, setSelectedSex] = useState<string>('male');
  const [selectedRole, setSelectedRole] = useState<string>('customer');
  const [customerType, setCustomerType] = useState<string>('individual');
  const [language, setSelectedLanguage] = useState<string>('');
  const [messengers, setMessengers] = useState([]);
  const [phones, setPhones] = useState([]);
  const [category, setCategory] = useState('all');
  const [categoryTabs, setCategoryTabs] = useState('all');

  return (
    <div className="container mx-auto px-4 py-4 flex flex-col gap-4 max-w-form pb-20">
      <h2>Admin Design System</h2>
      <h3>Switches</h3>
      <div className="flex flex-col gap-5">
        <IOSSwitch defaultChecked={false} />
        <IOSSwitch defaultChecked={true} />
        <IOSSwitch defaultChecked={false} disabled />
        <IOSSwitch defaultChecked={true} disabled />
      </div>
      <AddButton></AddButton>
      <AddButton disabled></AddButton>
      <ShareButton></ShareButton>
      <ShareButton disabled></ShareButton>
      <SecondaryBaseButton
        classes="w-full justify-center"
        type="outline"
        size="large"
        color="secondary"
        onClick={noop}
        text={'cancel'}
      ></SecondaryBaseButton>
      <div>
        <SuccessLink text="Hello"></SuccessLink>
        <SuccessOutline text="Hello"></SuccessOutline>
        <SuccessSolid text="Hello"></SuccessSolid>
        <Toggle value={isToggled} onChange={() => setIsToggled(!isToggled)} />
      </div>
      <div>
        <BurgerButton></BurgerButton>
      </div>
      {/* <MessengerList
				onChange={() => {}}
				value={[
					{
						messenger: messengers[0],
						nicknameOrNumber: 'LoremIpsum',
					},
					{
						messenger: messengers[1],
						nicknameOrNumber: 'LoremIpsum',
					},
				]}
			/> */}
      <Messengers values={messengers} onChange={(value) => setMessengers(value)} />
      <Phones values={phones} onChange={(newPhones) => setPhones(newPhones)} />
      <ButtonGroup
        buttons={[
          {
            text: 'all',
            isActive: category === 'all',
            onClick: () => setCategory('all'),
          },
          {
            text: 'categories',
            isActive: category === 'categories',
            onClick: () => setCategory('categories'),
          },
          {
            text: 'subcategories',
            isActive: category === 'subcategories',
            onClick: () => setCategory('subcategories'),
          },
        ]}
      />
      <TabsGroup
        buttons={[
          {
            text: 'all',
            isActive: categoryTabs === 'all',
            onClick: () => setCategoryTabs('all'),
          },
          {
            text: 'categories',
            isActive: categoryTabs === 'categories',
            onClick: () => setCategoryTabs('categories'),
          },
          {
            text: 'subcategories',
            isActive: categoryTabs === 'subcategories',
            onClick: () => setCategoryTabs('subcategories'),
          },
        ]}
      />
      <MetaTagChooser value={['health']} list={['health']} onChange={noop} />
      <SearchInput classes="w-full" placeholder={'search input'} value={'value'} onChange={noop} />
      <div>
        <MetaTagsButton text="Meta tag" />
      </div>
      <PriceList
        value={[
          { name: 'service 1', price: 100, id: 1 },
          { name: 'service 2', price: 200, id: 2 },
        ]}
      />
      <FormControlLabel label="radio-button 1" />
      <FormControlLabel label="radio-button 2" />
      <FormControlLabel label="radio-button 3" />
      <UploadedImage />
      <EditTablePopup handleEdit={noop} handleDelete={noop} handleCopy={noop} />
      <div className="mt-4 p-2 border">
        <ProfileBlock
          heading="Reviews about me"
          caption="3 reviews"
          text="Show to executors"
          divider={false}
          show={showReviews}
          setShow={setShowReviews}
        />
      </div>
      <StaticFilledField container="mt-3" text="Registration date" caption="automatically" value="12.04.2023" />
      <Label text="Label text" caption="some caption" isRequired></Label>
      <Navigation selectedRoute="search" />
      <DoubleRoundedBtn
        firstVal={{ value: 'male', text: 'male', icon: <MaleIcon /> }}
        secondVal={{ value: 'female', text: 'female', icon: <FemaleIcon /> }}
        selectedValue={selectedSex}
        onChange={(value) => setSelectedSex(value)}
      />
      <p>Segmented control with routing(don&apos;t press)</p>
      <SegmentedControls />
      <p>Basic segmented control</p>
      <SegmentedControl
        fullWidth
        value={selectedRole}
        onChange={(value) => setSelectedRole(value)}
        data={[
          { label: 'I am customer', value: 'customer' },
          { label: 'I am executor', value: 'executor' },
        ]}
      />
      <DoubleButton value={customerType} setValue={setCustomerType} classes="mt-[27.6px] mb-7" />
      <div className="p-2  border">
        <BackHeader heading="Social media" />
      </div>
      <CustomSelect
        value={language}
        onChange={(value) => setSelectedLanguage(value)}
        placeholder="System language"
        data={languagesData}
      />
      <PlacesInput placeholder="Enter city" queryCountries={['ua', 'cz']} />
    </div>
  );
};

export async function getServerSideProps() {
  return {
    props: {},
  };
}

export default AdminPage;
