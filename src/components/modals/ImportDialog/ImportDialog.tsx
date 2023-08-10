import { Autocomplete, Box, Button, Dialog, DialogContent, IconButton, TextField, RadioGroup } from '@mui/material';
import { useTranslation } from 'next-i18next';
import CloseIcon from '@mui/icons-material/Close';
import { Label } from '../../primitives/Label/Label';
import { useQuery } from 'react-query';
import { ICategory } from '../../../../common/types/category';
import { getAllCategories } from '@/services/categories';
import { Controller, useForm } from 'react-hook-form';
import { ImportFields } from '../../../../common/types/import-fields';
import { FormControlsWrapper } from '@/components/FormControlsWrapper/FormControlsWrapper';
import { FormControlLabel } from '@/components/primitives/FormControlLabel/FormControlLabel';
import { v4 } from 'uuid';
import { useEffect, useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { IProfile } from '../../../../common/types/profile';
import { ImportUsersDialog } from './ImportUsersDialog';
import { ProfileLanguages } from '../../../../common/enums/profile-languages';
import { joiResolver } from '@hookform/resolvers/joi';
import { importUsersSchema } from '../../../../common/validation/import-users-schema';
import classNames from 'classnames';
import { AddButton } from '@/components/Buttons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { languagesData } from '../../../../common/constants/languages';
import { DropdownIcon } from '@/components/Icons/Icons';
import { CategoryFilter } from '../../../../common/enums/category-filter';
import { BaseButton } from '@/components/Buttons/BaseButton';
import { SecondaryBaseButton } from '@/components/Buttons/SecondaryBaseButton';

interface ImportDialogProps {
  open: boolean;
  onClose: () => void;
}
const inputId = v4();

export const ImportDialog = ({ open, onClose }: ImportDialogProps) => {
  const { t } = useTranslation();

  const inputFileRef = useRef(null);
  const submitButtonRef = useRef(null);

  const [file, setFile] = useState<File | null>(null);
  const [sheetData, setSheetData] = useState<IProfile[]>([]);
  const [isOpenImportTable, setIsOpenImportTable] = useState(false);
  const [isTranslations, setIsTranslations] = useState(false);
  const [categorySearchValue, setCategorySearchValue] = useState('');
  const [subcategorySearchValue, setSubcategorySearchValue] = useState('');

  const { data: categories, isLoading: isCategoriesLoading } = useQuery<ICategory[]>('categories', () =>
    getAllCategories(CategoryFilter.CATEGORIES, false)
  );
  console.log(categories);

  useEffect(() => {
    setFile(null);
  }, [open]);

  const {
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors, dirtyFields },
  } = useForm<ImportFields>({
    resolver: joiResolver(importUsersSchema),
  });

  const handleUpload = () => {
    inputFileRef.current && inputFileRef.current.click();
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // Convert the sheet data to JSON
      const headers = jsonData[1] || []; // Get the 3rd row which contains the headers
      const dataRows = jsonData.slice(2); // Get the data rows, skipping the header row

      const clearedHeaders = headers.map((el) => String(el).trim().toLowerCase().split(' ')[0]);

      const newData = [clearedHeaders, ...dataRows]; // Combine headers and data rows
      const newSheet = XLSX.utils.aoa_to_sheet(newData); // Create a new sheet from the data
      const newJsonData = XLSX.utils.sheet_to_json(newSheet); // Convert the new sheet data to JSON

      setSheetData(newJsonData as IProfile[]);
    };
    reader.readAsBinaryString(file);
  };

  const handleFilesChange = ({ target }) => {
    const file = target.files[0];
    if (file) {
      const validExtensions = ['.xls', '.xlsx'];
      const fileExtension = file.name.slice((Math.max(0, file.name.lastIndexOf('.')) || Infinity) + 1);
      if (validExtensions.includes('.' + fileExtension)) {
        setFile(file);
        processFile(file);
      } else {
        alert('Invalid file format. Please upload an .xls or .xlsx file.');
      }
    }
  };

  const onSubmit = () => {
    setIsOpenImportTable(true);
  };

  const closeTableDialog = () => {
    setIsOpenImportTable(false);
    onClose();
    reset();
  };

  const getFileName = () => {
    if (!file) return '';
    return file.name.length > 25 ? file.name.slice(0, 25) + '...' : file.name;
  };

  const selectedCategory = watch('category');
  const selectedSubcategory = watch('subcategory');
  const subcategories = categories?.find((item) => item.id === selectedCategory)?.subcategories || [];
  const mappedCategories = categories
    ?.filter((item) => !!item.subcategories.length)
    ?.map((item) => ({ name: item.name, id: item.id }));

  return (
    <Dialog open={open} onClose={onClose}>
      <div className="w-96 bg-primary-100 flex justify-between px-4 py-2 items-center">
        <h3 className="text-white">{t('import')}</h3>
        <IconButton edge="end" onClick={onClose} aria-label="close" color="white">
          <CloseIcon />
        </IconButton>
      </div>
      <DialogContent>
        <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <input
              ref={inputFileRef}
              type="file"
              id={inputId}
              name="file-upload"
              accept=".xlsx, .xls"
              onChange={handleFilesChange}
              className="hidden"
            />
            <div className="flex justify-between items-center">
              <div>
                <Label text={t('upload_image_text')} />
                <div className="flex items-center gap-2.25">
                  <button
                    onClick={handleUpload}
                    type="button"
                    className="h-9.5 rounded-md bg-white grow px-4 text-primary-100 border-primary-100 border hover:bg-primary-100 hover:text-white transition-all"
                  >
                    <div className="flex gap-2 items-center">
                      <span className=""> {t('overview')}</span>
                    </div>
                  </button>
                  <p className={classNames('text-text-secondary', !file && '-left-8')}>
                    {file ? getFileName() : t('file_not_selected')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <FormControlsWrapper>
              <Label text={t('import_step_2')} />
              <AddButton />
            </FormControlsWrapper>

            {categories && (
              <Controller
                name="category"
                control={control}
                defaultValue={null}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <Autocomplete
                    disablePortal
                    popupIcon={<DropdownIcon />}
                    options={mappedCategories}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        key={params.id}
                        placeholder={t('choose')}
                        error={Boolean(error)}
                        helperText={error?.message}
                      />
                    )}
                    onChange={(_, newValue) => {
                      setValue('category', newValue?.id as string);
                      setValue('subcategory', null);
                      onChange(newValue?.id as number);
                    }}
                    onInputChange={(_, newValue, reason) => {
                      setCategorySearchValue(newValue);
                      if (reason === 'clear') {
                        setValue('category', null);
                        setValue('subcategory', null);
                      }
                    }}
                    value={categories.find((option) => option.id === value) || null}
                    inputValue={categorySearchValue}
                    renderOption={(props, option: ICategory) => (
                      <Box component="li" key={props.id} {...props}>
                        <span className={[option.parent_id ? 'pl-2' : 'font-bold']}>{option.name}</span>
                      </Box>
                    )}
                    sx={{
                      '.MuiAutocomplete-endAdornment': {
                        top: '8px',
                        right: '17.2px !important',
                      },
                    }}
                    clearOnEscape
                  />
                )}
              />
            )}
          </div>
          <div>
            <FormControlsWrapper>
              <Label text={t('import_step_3')} />
              <AddButton />
            </FormControlsWrapper>

            {categories && (
              <Controller
                name="subcategory"
                control={control}
                defaultValue={null}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <Autocomplete
                    disablePortal
                    popupIcon={<DropdownIcon />}
                    options={subcategories}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        key={params.id}
                        placeholder={t('choose')}
                        error={Boolean(error)}
                        helperText={error?.message}
                      />
                    )}
                    onChange={(_, newValue) => {
                      setValue('subcategory', newValue?.id as string);
                      onChange(newValue?.id as number);
                    }}
                    onInputChange={(_, newValue, reason) => {
                      setSubcategorySearchValue(newValue);
                      if (reason === 'clear') {
                        setValue('subcategory', null);
                      }
                    }}
                    value={categories.find((option) => option.id === value) || null}
                    inputValue={subcategorySearchValue}
                    renderOption={(props, option: ICategory) => (
                      <Box component="li" key={props.id} {...props}>
                        <span className={[option.parent_id ? 'pl-2' : 'font-bold']}>{option.name}</span>
                      </Box>
                    )}
                    sx={{
                      '.MuiAutocomplete-endAdornment': {
                        top: '8px',
                        right: '17.2px !important',
                      },
                    }}
                    clearOnEscape
                  />
                )}
              />
            )}
          </div>

          <div>
            <FormControlsWrapper>
              <Label text={t('import_step_4')} />
              <AddButton />
            </FormControlsWrapper>

            <Controller
              name="language"
              control={control}
              defaultValue={null}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <Autocomplete
                  disablePortal
                  popupIcon={<DropdownIcon />}
                  options={Object.values(ProfileLanguages)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      key={params.id}
                      placeholder={t('choose')}
                      error={Boolean(error)}
                      helperText={error?.message}
                    />
                  )}
                  onChange={(_, newValue: string) => {
                    setValue('language', newValue);
                    onChange(newValue);
                  }}
                  onInputChange={(_, __, reason) => {
                    if (reason === 'clear') {
                      setValue('language', null);
                    }
                  }}
                  renderOption={(props, option: string) => (
                    <Box component="li" key={option.id} {...props}>
                      {languagesData.find((lang) => lang.code === option)?.name || option}
                    </Box>
                  )}
                  sx={{
                    '.MuiAutocomplete-endAdornment': {
                      top: '8px',
                      right: '17.2px !important',
                    },
                  }}
                  clearOnEscape
                />
              )}
            />
          </div>
          <div>
            <FormControlsWrapper>
              <Label text={t('profile_priority')} />
            </FormControlsWrapper>

            <Controller
              control={control}
              name="is_main"
              defaultValue={false}
              render={({ field }) => (
                <RadioGroup
                  defaultValue={false}
                  value={field.value}
                  onChange={(_, value) => {
                    field.onChange(value);
                    setIsTranslations(value);
                  }}
                  aria-labelledby="is_main"
                >
                  <FormControlLabel label={t('primary')} value={false} />
                  <FormControlLabel label={t('secondary')} value={true} />
                </RadioGroup>
              )}
            />
          </div>
          <button className="hidden" ref={submitButtonRef} type="submit"></button>
        </form>
      </DialogContent>
      <ImportUsersDialog
        isTranslations={isTranslations}
        file={file}
        categoryId={selectedSubcategory}
        categoryName={subcategories?.find((category) => category.id === selectedSubcategory)?.name}
        language={watch('language')}
        isMain={watch('is_main')}
        data={sheetData}
        onClose={closeTableDialog}
        open={isOpenImportTable}
      />
      <div className="flex gap-2 p-4">
        <BaseButton
          classes="w-full justify-center"
          type="solid"
          size="large"
          variant=""
          color="success"
          disabled={!file}
          fullWidth
          text={t('confirm')}
          onClick={() => submitButtonRef.current.click()}
        ></BaseButton>

        <SecondaryBaseButton
          classes="w-full justify-center"
          size="large"
          fullWidth
          onClick={onClose}
          type="outline"
          color="secondary"
          text={t('cancel')}
        ></SecondaryBaseButton>
      </div>
    </Dialog>
  );
};
