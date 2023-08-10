import { IProfile } from '../../common/types/profile';

export const getFilledProfileValue = (profile: IProfile) => {
  const profileCheckValues: (keyof IProfile)[] = [
    'name',
    'surname',
    'gender',
    'additional_phones',
    'messengers',
    'tags',
    'service_radius',
    'address',
    'additional_address',
    'type',
    'description',
    'services_pricelist',
    'languages',
    'remote_address',
  ];
  const filledCount = profileCheckValues.reduce((acc, item) => (profile[item] === null ? acc : acc + 1), 0);
  return (filledCount / profileCheckValues.length).toFixed(2);
};
