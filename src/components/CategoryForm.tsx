import React, { ChangeEventHandler, createRef, FC, FormEventHandler, useEffect, useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import { Autocomplete } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Controller, set, useForm } from 'react-hook-form';
import { ICategory, ICategoryForm } from '../../common/types/category';
import { useQuery } from 'react-query';
import { getCategoriesParents } from '@/services/categories';
import { getCategoryTagsById } from '@/services/tags';
import { formatDate } from '@/utils/dateFormatter';
import { ConfirmDialog } from './modals/ConfirmDialog';
import { useRouter } from 'next/router';
import { joiResolver } from '@hookform/resolvers/joi';
import CategoryFormSchema from '../../common/validation/category-schema';
import { UploadedImage } from './primitives/UploadedImage/UploadedImage';
import { useTranslation } from 'next-i18next';
import { Toggle } from './primitives/Toggle/toggle';
import { Label } from './primitives/Label/Label';
import { CustomSelect } from './primitives/CustomSelect';
import { ButtonGroup } from './ButtonGroup/ButtonGroup';
import MetaTagChooser from './MetaTagsSelector/MetaTagsSelector';
import { PhotoIconXl, DropdownIcon } from './Icons/Icons';
import { Routes } from '../../common/enums/api-routes';
import { uniteRoutes } from '@/utils/uniteRoute';
import { SuccessSolid } from './Buttons';
import { BaseButton } from './Buttons/BaseButton';
import { SecondaryBaseButton } from './Buttons/SecondaryBaseButton';
import { SaveButtonsGroup } from './SaveButtonsGrop/SaveButtonsGroup';
import { languagesData } from '../../common/constants/languages';
import { LanguagesUserSelect } from '@/components/LanguagesSelect/LanguagesSelect';
import useCategoryTranslation from '@/hooks/useCategoryTranslation';

interface CategoryFormProps {
  initialValues?: ICategoryForm;
  isLoading?: boolean;
  onSubmit: (data: ICategoryForm) => void;
  id?: string;
}

const CategoryForm: FC<CategoryFormProps> = ({ initialValues, isLoading = false, onSubmit, id }) => {
  const router = useRouter();
  const submitRef = createRef<HTMLButtonElement>();
  const { t, i18n } = useTranslation();

  const [uploadedActive, setUploadedActive] = useState<File | null>(null);
  const [uploadedPassive, setUploadedPassive] = useState<File | null>(null);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [isMainSelected, setIsMainSelected] = useState(true);
  const [filteredCategories, setFilteredCategories] = useState<ICategory[]>([]);
  const [categoryInputValue, setCategoryInputValue] = useState('');
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors, dirtyFields },
  } = useForm<ICategoryForm>({
    resolver: joiResolver(CategoryFormSchema),
    defaultValues: {
      parent_id: null as unknown as number,
      sort_order: 0,
      status: false,
    },
  });
  const { selectedLanguage, changeLanguage, translations, updateField, getField, updateTranslations } =
    useCategoryTranslation(initialValues);

  const { data: categoriesParents, isLoading: categoriesParentsLoading } = useQuery<ICategory[]>(
    'categories-parents',
    () => getCategoriesParents(id as string)
  );

  const { data: categoryTags, isLoading: categoryTagsLoading } = useQuery<string[]>('tags', () =>
    getCategoryTagsById(id as string)
  );

  // const tags = [categoryTags,];

  const selectedMetaTags = watch('meta_tags') || [];
  const parentCategory = watch('parent_id');
  const status = watch('status') || false;

  const isFormLoading = isLoading || categoriesParentsLoading || categoryTagsLoading;
  const wasChanged = !!Object.keys(dirtyFields).length;

  const getCategoryName = (id: number): string => {
    const category = categoriesParents?.find((item) => item.id === id);
    return category?.name ?? '';
  };

  const handleActiveImageChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const file = event?.target?.files?.[0];
    if (!file) return;
    setUploadedActive(file);
  };

  const handlePassiveImageChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const file = event?.target?.files?.[0];
    if (!file) return;
    setUploadedPassive(file);
  };

  useEffect(() => {
    if (!initialValues) return;
    const filteredInitialValues = { ...initialValues };
    const filterFields = ['deletedAt', 'id', 'created_at', 'updated_at'];
    Object.keys(filteredInitialValues).forEach((key) => {
      if (filterFields.includes(key)) delete filteredInitialValues[key as keyof ICategoryForm];
    });

    reset(filteredInitialValues);
    updateTranslations(initialValues.translations);
  }, [initialValues]);

  useEffect(() => {
    setFilteredCategories(categoriesParents ?? []);
  }, [filteredCategories]);

  useEffect(() => {
    setValue('name', getField('name'));
  }, [selectedLanguage, setValue, getField, initialValues]);

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
      router.push(uniteRoutes([Routes.CATEGORIES]));
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

    window.addEventListener('beforeunload', preventUnload);
    return () => {
      window.removeEventListener('beforeunload', preventUnload);
    };
  }, [dirtyFields]);

  const active_icon = watch('active_icon') || (uploadedActive && URL.createObjectURL(uploadedActive));
  const passive_icon = watch('passive_icon') || (uploadedPassive && URL.createObjectURL(uploadedPassive));

  const imagesToUploadFormWrapper: FormEventHandler<HTMLFormElement> = (event) => {
    return handleSubmit((data) =>
      onSubmit({
        ...data,
        uploadedActive,
        uploadedPassive,
        translations,
      })
    )(event);
  };

  const removeActiveImage = () => {
    setUploadedActive(null);
    setValue('active_icon', null as unknown as string);
  };

  const removePassiveImage = () => {
    setUploadedPassive(null);
    setValue('passive_icon', null as unknown as string);
  };

  // @ts-ignore
  const handleFieldChange = (fieldName) => (e) => {
    updateField(fieldName, e.target.value);
    setValue(fieldName, e.target.value);
  };

  const handleLanguageChange = (event: SelectChangeEvent<{ value: string | Language | undefined }>) => {
    const lang = event.target.value;
    const language = languagesData.find((el) => lang === el.code);
    if (language) {
      changeLanguage(language.code);
    }
  };

  console.log(errors);

  return (
    <form onSubmit={imagesToUploadFormWrapper} className="flex flex-col w-full max-w-form">
      <div className="w-[243px] mb-4.25">
        <ButtonGroup
          buttons={[
            { text: t('main'), isActive: isMainSelected, onClick: () => setIsMainSelected(true) },
            { text: t('SEO'), isActive: !isMainSelected, onClick: () => setIsMainSelected(false) },
          ]}
        />
      </div>

      <div className="flex flex-col justify-between mb-7.25">
        <LanguagesUserSelect value={selectedLanguage} placeholder="language" onChange={handleLanguageChange} />
      </div>

      <div className="flex justify-between mb-7.25">
        <Label text={t('status')} caption={t('show_category')} />
        <Toggle value={status} onChange={() => setValue('status', !status)} />
      </div>

      <div className="mb-7.5">
        <Label text={t('parent_category')} />
        {filteredCategories && (
          <Controller
            name="parent_id"
            control={control}
            defaultValue={null}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <Autocomplete
                size="small"
                disablePortal
                popupIcon={<DropdownIcon fill="#949494" />}
                disabled={!categoriesParents}
                options={filteredCategories || []}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    key={params.id}
                    placeholder={t(categoriesParents ? 'choose_category' : 'loading')}
                    error={Boolean(error)}
                    helperText={error?.message}
                  />
                )}
                onChange={(_, newValue) => {
                  setValue('parent_id', newValue?.id);
                  onChange(newValue?.id);
                }}
                onInputChange={(event, newInputValue, reason) => {
                  if (!categoriesParents) return;
                  if (reason === 'input') {
                    setValue('parent_id', null);
                    const filteredOptions = categoriesParents.filter((option) => option.name.includes(newInputValue));
                    setCategoryInputValue(newInputValue);
                    setFilteredCategories(filteredOptions);
                  } else if (reason === 'clear') {
                    setCategoryInputValue('');
                    setValue('parent_id', null);
                  }
                }}
                value={(categoriesParents ?? []).find((option) => option.id === value) || null}
                inputValue={(categoriesParents ?? []).find((option) => option.id === value)?.name || categoryInputValue}
                renderOption={(props, option) => (
                  <Box component="li" key={option.id} {...props}>
                    {option.name}
                  </Box>
                )}
                sx={{
                  '.MuiAutocomplete-endAdornment': {
                    top: '7px',
                    right: '20.2px !important', // Move the popup icon to the right
                  },
                }}
                clearOnEscape
              />
            )}
          />
        )}
      </div>

      <div className="mb-7">
        <Label
          text={t(parentCategory ? 'subcategory' : 'category')}
          caption={t('category_limitation', { max: 40 })}
          isRequired
        ></Label>
        <TextField
          size="small"
          placeholder={t('category_name_placeholder')}
          InputLabelProps={{ shrink: true }}
          fullWidth
          {...register('name', { required: 'Name is required' })}
          onChange={handleFieldChange('name')}
          error={Boolean(errors.name)}
          helperText={errors.name?.message}
        />
      </div>

      <div className="mb-7.5">
        <Label text={t('sort_order')} caption={t('sort_order_caption')}></Label>
        <TextField
          placeholder="10"
          size="small"
          InputLabelProps={{ shrink: true }}
          fullWidth
          type="number"
          {...register('sort_order', { required: 'Sort order is required' })}
          error={Boolean(errors.sort_order)}
          helperText={errors.sort_order?.message}
        />
      </div>

      <div className="flex gap-10 items-center flex-wrap mb-7.5">
        {active_icon ? (
          <UploadedImage
            headlineCaption={t('active')}
            headline={t('image')}
            image={active_icon}
            onRemove={removeActiveImage}
          />
        ) : (
          <UploadedImage
            number="1."
            isPlaceholder
            placeholderIcon={<PhotoIconXl />}
            headlineCaption={t('active')}
            headline={t('image')}
            handleImageChange={(image) => setValue('active_icon', image)}
            placeholderText={t('load_svg')}
            uploadType=".svg"
          />
        )}
        {passive_icon ? (
          <UploadedImage
            headlineCaption={t('passive')}
            headline={t('image')}
            image={passive_icon}
            onRemove={removePassiveImage}
          />
        ) : (
          <UploadedImage
            number="2."
            isPlaceholder
            placeholderIcon={<PhotoIconXl />}
            headlineCaption={t('passive')}
            headline={t('image')}
            uploadType=".svg"
            placeholderText={t('load_svg')}
            handleImageChange={(image) => setValue('passive_icon', image)}
          />
        )}
      </div>

      <div className="mb-9">
        {selectedMetaTags && (
          <MetaTagChooser
            errorsMessage={errors?.meta_tags?.message}
            value={selectedMetaTags}
            list={categoryTags}
            onChange={(value) => setValue('meta_tags', value || [])}
          />
        )}
      </div>

      <div>
        <Label text={t('date_creating_category')} caption={t('automatically')}></Label>
        <TextField
          sx={{ backgroundColor: '#f3f3f3', '& .MuiInputBase-input': { padding: '6.5px 14px' } }}
          size="small"
          fullWidth
          type="text"
          InputProps={{ readOnly: true }}
          disabled
          defaultValue={formatDate(initialValues?.created_at || new Date())}
        />
      </div>
      <SaveButtonsGroup
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
          buttonText="Yes"
          onClose={() => setOpenCancelDialog(false)}
          onSave={handleSave}
          customText={t('data_was_changed_confirm')}
        />
      )}
    </form>
  );
};

export default CategoryForm;
