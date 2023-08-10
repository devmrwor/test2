import React, { createRef, FC, useEffect, useState } from 'react';
import { Button, Checkbox, MenuItem, Select, TextField } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { ConfirmDialog } from './modals/ConfirmDialog';
import { joiResolver } from '@hookform/resolvers/joi';
import { Label } from './primitives/Label/Label';
import { useTranslation } from 'next-i18next';
import { FormControlsWrapper } from './FormControlsWrapper/FormControlsWrapper';
import { useRouter } from 'next/router';
import { IUser } from '../../common/types/user';
import { formatDate } from '@/utils/dateFormatter';
import { PasswordGenerator } from './modals/SetPasswordDialog';
import { Roles } from '../../common/enums/roles';
import AdminFormSchema from '../../common/validation/admin-schema';
import { uniteRoutes } from '@/utils/uniteRoute';
import { Routes, UserRoutes } from '../../common/enums/api-routes';
import { AddButton } from './Buttons';
import { SaveButtonsGroup } from './SaveButtonsGrop/SaveButtonsGroup';
import { SecondaryBaseButton } from './Buttons/SecondaryBaseButton';
import { ControlledCheckboxLabel } from './primitives/CheckboxLabel/ControlledCheckboxLabel';

interface AdminFormProps {
  initialValues?: IUser;
  isLoading?: boolean;
  onSubmit: (data: IUser) => void;
}

const AdminForm: FC<AdminFormProps> = ({ initialValues, isLoading = false, onSubmit }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors, dirtyFields },
  } = useForm<IUser>({
    resolver: joiResolver(AdminFormSchema(!initialValues)),
  });
  const { t } = useTranslation();

  const router = useRouter();
  const query = router.query;

  const submitRef = createRef<HTMLButtonElement>();
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [passwordGeneratingOpen, setPasswordGeneratingOpen] = useState(false);

  const isFormLoading = isLoading;
  const wasChanged = !!Object.keys(dirtyFields).length;

  const handleGeneratePassword = (value: string) => {
    setValue('password', value);
  };

  useEffect(() => {
    if (!initialValues) return;
    const filteredInitialValues = { ...initialValues };
    const filterFields = ['id', 'created_at', 'updated_at', 'user_id', 'user', 'deletedAt'];

    Object.keys(filteredInitialValues).forEach((key) => {
      if (filterFields.includes(key)) delete filteredInitialValues[key as keyof IUser];
      if (
        ['services_pricelist', 'messengers', 'languages'].includes(key) &&
        filteredInitialValues[key as keyof IUser]
      ) {
        try {
          // @ts-ignore
          filtered[key] =
            // @ts-ignore
            typeof filteredInitialValues[key as keyof IUser] === 'string'
              ? JSON.parse(filteredInitialValues[key])
              : filteredInitialValues[key];
        } catch (error) {
          console.error(error);
        }
      }
    });
    reset(filteredInitialValues);
  }, [initialValues]);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSave = () => {
    if (!submitRef.current) return;
    submitRef.current.click();
    setOpenDialog(false);
  };

  const handleCancel = () => {
    if (!wasChanged) {
      router.push(uniteRoutes([Routes.USERS, UserRoutes.ADMINS]));
    } else {
      setOpenCancelDialog(true);
    }
  };

  useEffect(() => {
    const preventUnload = (e: any) => {
      if (wasChanged) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    // window.addEventListener('beforeunload', preventUnload);
    // return () => {
    //   window.removeEventListener('beforeunload', preventUnload);
    // };
  }, [dirtyFields]);

  const is_entry_allowed = watch('is_entry_allowed');
  const authentication = watch('authentication');
  const not_allowed_to_change_password = watch('not_allowed_to_change_password');
  const require_logging_password = watch('require_logging_password');
  const role = watch('role');
  const additional_phones = watch('additional_phones') || [];
  const additional_emails = watch('additional_emails') || [];

  console.log(errors);
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 flex flex-col gap-6 w-full justify-between pb-6">
      <div className="flex">
        <div className="flex flex-col grow max-w-form mt-19 pr-24">
          <div className="mb-5.5">
            <Label text={t('user_type')} isRequired />
            <Controller
              name="role"
              control={control}
              defaultValue={role || Roles.ADMIN}
              rules={{ required: true }}
              render={({ field }) => (
                <Select fullWidth size="small" error={Boolean(errors.role)} placeholder={t('choose')} {...field}>
                  {Object.values(Roles).map((role) => (
                    <MenuItem key={role} value={role}>
                      {role}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.role && <p className="text-red-500">{errors.role.message}</p>}
          </div>
          <div className="mb-4.25">
            <Label text={t('surname')} isRequired caption={t('as_on_identity_card')} />
            <TextField
              size="small"
              fullWidth
              placeholder={t('name_placeholder')}
              {...register('surname')}
              error={Boolean(errors.surname)}
              helperText={errors.surname?.message}
            />
          </div>
          <div className="mb-4.25">
            <Label text={t('name')} isRequired caption={t('as_on_identity_card')} />
            <TextField
              size="small"
              fullWidth
              placeholder={t('name_placeholder')}
              {...register('name')}
              error={Boolean(errors.name)}
              helperText={errors.name?.message}
            />
          </div>
          <div className="mb-9">
            <Label text={t('patronymic')} caption={t('as_on_identity_card')} />
            <TextField
              size="small"
              fullWidth
              placeholder={t('name_placeholder')}
              {...register('patronymic')}
              error={Boolean(errors.patronymic)}
              helperText={errors.patronymic?.message}
            />
          </div>
          <div className="mb-4.25">
            <FormControlsWrapper>
              <Label text={t('phone')} isRequired caption={t('with_code')} />
              <AddButton onClick={() => setValue('additional_phones', [...additional_phones, ''])} />
            </FormControlsWrapper>
            <TextField
              size="small"
              fullWidth
              placeholder="+420"
              {...register('phone')}
              error={Boolean(errors.phone)}
              helperText={errors.phone?.message}
            />
            {(additional_phones?.length || '') && (
              <div className="mt-4 flex flex-col gap-4">
                {additional_phones.map((_, index) => (
                  <TextField
                    placeholder="+420"
                    size="small"
                    fullWidth
                    key={index}
                    {...register(`additional_phones.${index}`)}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="mb-13.5">
            <FormControlsWrapper>
              <Label text={t('email')} isRequired />

              <AddButton onClick={() => setValue('additional_emails', [...additional_emails, ''])} />
            </FormControlsWrapper>
            <TextField
              size="small"
              fullWidth
              placeholder={t('email_placeholder')}
              {...register('email')}
              error={Boolean(errors.email)}
              helperText={errors.email?.message}
            />
            {(additional_emails?.length || '') && (
              <div className="mt-4 flex flex-col gap-4">
                {additional_emails.map((_, index) => (
                  <TextField
                    placeholder={t('email_placeholder')}
                    size="small"
                    fullWidth
                    key={index}
                    {...register(`additional_emails.${index}`)}
                  />
                ))}
              </div>
            )}
          </div>

          <SaveButtonsGroup
            wrapperClassName="justify-between flex w-full mx-auto gap-4"
            isLoading={isFormLoading}
            onSave={() => setOpenDialog(true)}
            onCancel={handleCancel}
            submitRef={submitRef}
          />
        </div>
        <div className="flex flex-col grow max-w-form pr-24">
          <SaveButtonsGroup
            wrapperClassName="justify-between gap-4 flex w-full mx-auto mb-6.5"
            isLoading={isFormLoading}
            onSave={() => setOpenDialog(true)}
            onCancel={handleCancel}
            submitRef={submitRef}
          />
          <ControlledCheckboxLabel
            classes="mb-4.25"
            name="is_entry_allowed"
            control={control}
            text={t('login_allowed')}
          />
          <div className="mb-11.75">
            <Label text={t('name_for_login')} isRequired caption={t('limitation_caption', { max: 12 })} />
            <TextField
              size="small"
              fullWidth
              placeholder={t('name_placeholder')}
              {...register('username')}
              error={Boolean(errors.username)}
              helperText={errors.username?.message}
            />
          </div>
          <ControlledCheckboxLabel
            classes={'mb-2.25'}
            name="authentication"
            control={control}
            text={t('authentication')}
          />
          <div className="mb-6.75">
            <SecondaryBaseButton
              classes="w-[220px] justify-center"
              type="outline"
              size="large"
              color="secondary"
              onClick={() => setPasswordGeneratingOpen(true)}
              text={t('set_password')}
            ></SecondaryBaseButton>
            {errors.password?.message && <p className="text-red-500">{errors.password?.message}</p>}
          </div>

          <div className="mb-7.25">
            <ControlledCheckboxLabel
              classes="mb-3"
              name="require_logging_password"
              defaultChecked={require_logging_password}
              control={control}
              text={t('ask_for_password_after_login')}
            />
            <ControlledCheckboxLabel
              classes="mb-4.25"
              name="not_allowed_to_change_password"
              defaultChecked={not_allowed_to_change_password}
              control={control}
              text={t('user_cant_change_password')}
            />
          </div>
          <div className="mb-4.5">
            <Label text={t('sort_order')} caption={t('user_number')} />
            <TextField
              size="small"
              fullWidth
              {...register('sort_order')}
              type="number"
              defaultValue={1}
              error={Boolean(errors.name)}
              helperText={errors.sort_order?.message}
            />
          </div>
          <div>
            <Label text={t('date_creating_profile')} caption={t('automatically')} />
            <TextField
              size="small"
              InputLabelProps={{ shrink: true }}
              fullWidth
              type="text"
              disabled
              sx={{
                '& .MuiInputBase-root': {
                  color: '#dcf2fc',
                  backgroundColor: '#f3f3f3',
                },
              }}
              defaultValue={formatDate(initialValues?.created_at || new Date())}
            />
          </div>
        </div>
      </div>
      {openDialog && (
        <ConfirmDialog
          open={openDialog}
          onClose={handleCloseDialog}
          onSave={handleSave}
          customText={t('data_was_changed_confirm')}
        />
      )}
      <PasswordGenerator
        onGenerate={handleGeneratePassword}
        open={passwordGeneratingOpen}
        setOpen={setPasswordGeneratingOpen}
      />
      <button className="hidden" ref={submitRef} type="submit"></button>
    </form>
  );
};

export default AdminForm;
