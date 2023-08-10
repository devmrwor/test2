import { Control, FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { IProfile } from './profile';

export interface ReactHookSubFormProps<T extends Object> {
  setValue: UseFormSetValue<T>;
  watch: UseFormWatch<T>;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  control: Control<T, any>;
}

export type IClientProfileForm = ReactHookSubFormProps<IProfile>;
