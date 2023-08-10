import { Gender, ImageType } from '../../common/enums/gender';

export const generateUserPhoto = (photo: string, gender: string) => {
  if (photo) return photo;
  const defaultGender = gender === Gender.MALE ? ImageType.MAN : ImageType.WOMAN;
  const randomNumber = Math.floor(Math.random() * (gender === Gender.MALE ? 7 : 5)) + 1;
  const defaultPhoto = `/assets/images/Face_${defaultGender}_${randomNumber}.svg`;
  return defaultPhoto;
};
