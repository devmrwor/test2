import { Autocomplete, Box, Button, RadioGroup, TextField } from '@mui/material';
import { createRef, useEffect, useRef, useState } from 'react';
import { Label } from '@/components/primitives/Label/Label';
import { FormSeparator } from '@/components/primitives/FormSeparator/FormSeparator';
import { ChevronLeft, ChevronRight, FilterIcon, TimeIconXs, XmarkXs } from '@/components/Icons/Icons';
import { Toggle } from '@/components/primitives/Toggle/toggle';
import { FormControlsWrapper } from '@/components/FormControlsWrapper/FormControlsWrapper';
import { formatDate } from '@/utils/dateFormatter';
import { fillBannerId } from '@/utils/formatUserId';
import { DateField, TimePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { joiResolver } from '@hookform/resolvers/joi';
import { INotification } from '../../common/types/notification';
import NotificationSchema from '../../common/validation/notification-schema';
import { Controller, useForm } from 'react-hook-form';
import { ConfirmDialog } from './modals/ConfirmDialog';
import { Routes } from '../../common/enums/api-routes';
import { uniteRoutes } from '@/utils/uniteRoute';
import { NotificationTypes } from '../../common/enums/notification-types';
import { pages } from '../../common/constants/pages';
import { DateFormat, TimeFormat } from '../../common/constants/date-formats';
import { useS3Upload } from 'next-s3-upload';
import { RadioButton } from './primitives/RadioButton/RadioButton';
import { FormControlLabel } from './primitives/FormControlLabel/FormControlLabel';
import { SaveButtonsGroup } from './SaveButtonsGrop/SaveButtonsGroup';
import { BaseButton } from './Buttons/BaseButton';

interface NotificationFormProps {
  initialValues?: INotification;
  isLoading?: boolean;
  onSubmit: (data: INotification) => void;
}

export const NotificationForm = ({ initialValues, isLoading = false, onSubmit }: NotificationFormProps) => {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const submitRef = createRef<HTMLButtonElement>();

  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    trigger,
    formState: { errors, dirtyFields },
  } = useForm<INotification>({
    resolver: joiResolver(NotificationSchema),
  });

  const { t } = useTranslation();
  const { uploadToS3 } = useS3Upload();

  const [isFileUploading, setIsFileUploading] = useState<boolean>(false);
  const [isHintVisible, setIsHintVisible] = useState<boolean>(true);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const wasChanged = !!Object.keys(dirtyFields).length;
  const isFormLoading = isLoading;

  const handleUpload = () => {
    if (!inputFileRef.current) return;
    inputFileRef.current.click();
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>, onChange: (value: string) => void) => {
    if (!e.target.files) return;
    setIsFileUploading(true);
    const file = e.target.files[0];
    const { url } = await uploadToS3(file);
    setIsFileUploading(false);
    onChange(url);
  };

  const getDateFromString = (date: string) => {
    if (!date) return dayjs(new Date());
    return dayjs(date, DateFormat);
  };

  const getStringFromDate = (date: Dayjs) => {
    return dayjs(date).format(DateFormat);
  };

  const getTimeFromString = (date: string) => {
    if (!date) return dayjs(new Date());
    return dayjs(date, TimeFormat);
  };

  const getStringFromTime = (date: Dayjs) => {
    return dayjs(date).format(TimeFormat);
  };

  const onNextClickHandler = () => {
    const startDate = getDateFromString(start_date);
    const endDate = getDateFromString(end_date);
    setValue('end_date', getStringFromDate(endDate.add(1, 'day')));
  };

  const onPrevClickHandler = () => {
    const startDate = getDateFromString(start_date);
    const endDate = getDateFromString(end_date);
    setValue('start_date', getStringFromDate(startDate.subtract(1, 'day')));
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSave = async () => {
    const isValid = await trigger();
    if (isValid) {
      handleSubmit(onSubmit)();
    }
    setOpenDialog(false);
  };

  const handleCancel = () => {
    if (!wasChanged) {
      router.push(uniteRoutes([Routes.NOTIFICATIONS]));
    } else {
      setOpenCancelDialog(true);
    }
  };

  useEffect(() => {
    if (!initialValues) return;
    console.log(initialValues);
    const {
      start_date,
      end_date,
      displaying_page,
      banner,
      banner_appearance,
      show_banner,
      sort_order,
      start_date_time,
      status,
    } = initialValues;
    reset({
      displaying_page,
      start_date,
      end_date,
      start_date_time,
      banner,
      banner_appearance,
      show_banner,
      sort_order,
      status,
    });
  }, [initialValues]);

  const start_date = watch('start_date') || getStringFromDate(dayjs(new Date()));
  const end_date = watch('end_date') || getStringFromDate(dayjs(new Date()).add(1, 'day'));
  const start_date_time = watch('start_date_time') || getStringFromTime(dayjs(new Date()));
  const displaying_page = watch('displaying_page');
  const status = watch('status') || NotificationTypes.FOR_ALL;
  const banner = watch('banner');
  const show_banner = watch('show_banner');

  useEffect(() => {
    if (!start_date || !end_date) return;
    const startDate = getDateFromString(start_date);
    const endDate = getDateFromString(end_date);
    if (startDate.isAfter(endDate) || startDate.isSame(endDate)) {
      setValue('end_date', getStringFromDate(startDate.add(1, 'day')));
    }
  }, [start_date, end_date]);

  return (
    <>
      <div className="w-full bg-secondary rounded-md h-12 mb-3"></div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col max-w-notification pb-5">
        <div>
          <Label text={t('load_banner')} />
          <div className="flex gap-4 items-center mb-7">
            <Controller
              control={control}
              name="banner"
              defaultValue={banner}
              render={({ field }) => (
                <input
                  onChange={(e) => handleInputChange(e, field.onChange)}
                  ref={inputFileRef}
                  className="hidden"
                  type="file"
                />
              )}
            />
            <BaseButton
              text={t('overview')}
              color="primary"
              type="solid"
              size="md"
              disabled={isFileUploading}
              onClick={handleUpload}
            ></BaseButton>
            {<p className="text-text-primary">{!banner ? t('file_not_selected') : banner.slice(111)}</p>}
          </div>
        </div>
        {isHintVisible && (
          <div className="mb-10.5">
            <Label text={t('banner_appearance')} />
            <div className="rounded-md flex items-center justify-between relative bg-background gap-4 p-4 py-3 pr-6">
              <button type="button" onClick={() => setIsHintVisible(false)} className="absolute top-2 right-2">
                <XmarkXs />
              </button>
              <div className="flex  justify-between items-center gap-1 h-full">
                <div className="relative -top-0.5">
                  <FilterIcon />
                </div>
                <p className="text-lg text-primary-100">{t('filter')}</p>
              </div>
              <Label text={t('use_filter_hint')} />
            </div>
          </div>
        )}

        <div className="mb-4.5">
          <Label text={t('banner_display_page')} isRequired />
          <Controller
            control={control}
            name="displaying_page"
            defaultValue={displaying_page || pages[0]}
            render={({ field }) => (
              <Autocomplete
                options={pages}
                value={field.value}
                onChange={(_, value) => field.onChange(value)}
                renderInput={(params) => <TextField {...params} size="small" placeholder={t('choose_page_caption')} />}
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    {option}
                  </Box>
                )}
                clearOnEscape
              />
            )}
          />
          {errors.displaying_page && <p className="text-red-100">{errors?.displaying_page?.message}</p>}
        </div>

        <div className="mb-5">
          <FormSeparator className="mb-4" />
          <FormControlsWrapper classes="mt-2 mb-2">
            <Label text={t('status')} caption={t('show_banner')} />
            <Controller
              control={control}
              name="show_banner"
              defaultValue={show_banner || false}
              render={({ field }) => <Toggle onChange={(value) => field.onChange(value)} value={field.value} />}
            />
          </FormControlsWrapper>
          <Controller
            control={control}
            name="status"
            defaultValue={status}
            render={({ field }) => (
              <RadioGroup
                defaultValue={NotificationTypes.FOR_ALL}
                value={field.value}
                onChange={(_, value) => field.onChange(value)}
                aria-labelledby="status-type"
              >
                <FormControlLabel value={NotificationTypes.FOR_ALL} label={t('all_users')} />
                <FormControlLabel label={t('only_customers')} value={NotificationTypes.FOR_CUSTOMER} />
                <FormControlLabel label={t('only_executors')} value={NotificationTypes.FOR_EXECUTOR} />
              </RadioGroup>
            )}
          />
        </div>
        <FormSeparator className="mb-4.5" />

        <div className="mb-7.25">
          <Label text={t('display_period')} />
          <div className="pl-9">
            <Label text={t('date')} />
          </div>
          <div className="flex justify-between items-center gap-5 mb-4">
            <button type="button" onClick={onPrevClickHandler} className="grow">
              <ChevronLeft />
            </button>
            <div className="flex items-center">
              <Controller
                control={control}
                name="start_date"
                defaultValue={start_date}
                render={({ field }) => (
                  <DateField
                    size="small"
                    value={getDateFromString(field.value)}
                    onChange={(newValue) => field.onChange(getStringFromDate(newValue))}
                    format={DateFormat}
                  />
                )}
              />
              <span className="w-3 h-0.5 shrink-0 bg-background-decorative mx-2 block"></span>
              <Controller
                control={control}
                name="end_date"
                defaultValue={end_date}
                render={({ field }) => (
                  <DateField
                    size="small"
                    value={getDateFromString(field.value)}
                    onChange={(newValue) => field.onChange(getStringFromDate(newValue))}
                    format={DateFormat}
                  />
                )}
              />
            </div>
            <button type="button" onClick={onNextClickHandler} className="grow">
              <ChevronRight />
            </button>
          </div>
          <div className="pl-9">
            <Label text={t('beginning_time')} />
            {
              <Controller
                control={control}
                name="start_date_time"
                defaultValue={start_date_time}
                render={({ field }) => (
                  <TimePicker
                    value={getTimeFromString(field.value)}
                    onChange={(newValue) => field.onChange(getStringFromTime(newValue))}
                    componentsProps={{
                      textField: {
                        size: 'small',
                      },
                    }}
                    components={{
                      OpenPickerButton: TimeIconXs,
                    }}
                    // sx={{
                    //   padding: "4px !important;",
                    //   height: "40px !important;",
                    // }}
                    sx={{
                      width: '156px',
                      padding: '0px !important;',
                    }}
                    ampm={false}
                  />
                )}
              />
            }
          </div>
        </div>
        <FormSeparator className="mb-4.5" />
        <div className="mb-7">
          <Label text={t('number_of_shows')} isRequired caption={t('from_to', { from: 1, to: 3 })} />
          <TextField
            type="number"
            size="small"
            {...register('banner_appearance')}
            InputProps={{
              inputProps: {
                min: 1,
                max: 3,
              },
            }}
            defaultValue={1}
            fullWidth
          />
          {errors.banner_appearance && <p className="text-red-100">{errors?.banner_appearance?.message}</p>}
        </div>
        <div className="mb-5.5">
          <Label text={t('sort_order')} caption={t('banner_sort_order_caption')} />
          <TextField size="small" {...register('sort_order')} defaultValue={1} fullWidth type="number" />
        </div>
        {initialValues?.id && (
          <div className="mb-6.25">
            <Label text={t('number_of_banner')} caption={t('automatically')} />
            <TextField size="small" disabled fullWidth value={fillBannerId(initialValues.id)} />
          </div>
        )}

        <div>
          <Label text={t('date_of_banner')} caption={t('automatically')} />
          <TextField size="small" disabled fullWidth value={formatDate(initialValues?.created_at || new Date())} />
        </div>

        <SaveButtonsGroup
          wrapperClassName="justify-between flex w-full mx-auto gap-4 mt-10"
          isLoading={isFormLoading}
          onSave={() => setOpenDialog(true)}
          onCancel={handleCancel}
          submitRef={submitRef}
        />
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
      </form>
    </>
  );
};
