import { Autocomplete, Box, Button, Dialog, DialogContent, IconButton, TextField, InputAdornment } from '@mui/material';
import { useTranslation } from 'next-i18next';
import CloseIcon from '@mui/icons-material/Close';
import { Label } from '../primitives/Label/Label';
import { useQuery } from 'react-query';
import { ICategory } from '../../../common/types/category';
import { getAllCategories } from '@/services/categories';
import { Controller, useForm } from 'react-hook-form';
import { ImportFields } from '../../../common/types/import-fields';

import { FormControlsWrapper } from '@/components/FormControlsWrapper/FormControlsWrapper';
import { v4 } from 'uuid';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { IProfile } from '../../../common/types/profile';

import { ProfileLanguages } from '../../../common/enums/profile-languages';
import { joiResolver } from '@hookform/resolvers/joi';
import { importUsersSchema } from '../../../common/validation/import-users-schema';
import { ImportUsersDialog } from './ImportDialog/ImportUsersDialog';
import { MAX_TAGS_LENGTH } from '../../../common/constants/tags-field';
import { getTags, saveTags } from '@/services/tags';
import { DropdownIcon } from '../Icons/Icons';

interface TagsModalProps {
  open: boolean;
  onClose: () => void;
  category: ICategory | null;
}
const inputId = v4();

export const TagsModal = ({ open, onClose, category }: TagsModalProps) => {
  const { t } = useTranslation();

  const inputFileRef = useRef(null);
  const submitButtonRef = useRef(null);

  const [tagsList, setTagsList] = useState<string[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null);

  const {
    data: categories,
    isLoading: isCategoriesLoading,
    refetch: refetchCategories,
  } = useQuery<ICategory[]>('categories', () => getAllCategories());
  const { data: tags, isLoading, refetch } = useQuery('tags', () => getTags(0, 1000));

  useEffect(() => {
    setSelectedCategory(category);
    if (!category) {
      setTagsList([]);
    }
  }, [category]);

  useEffect(() => {
    if (tags && selectedCategory) {
      const matchingCategory = [...tags.rows].reverse().find((tag) => tag.category_id === selectedCategory.id);
      setTagsList(matchingCategory ? matchingCategory.tags : selectedCategory.meta_tags);
      setSelectedLanguage(matchingCategory ? matchingCategory.language : null);
      return;
    }
    setTagsList([]);
  }, [selectedCategory]);

  const handleInputChange = (event) => {
    if (event.target.value.length > MAX_TAGS_LENGTH) {
      event.target.value = event.target.value.slice(0, MAX_TAGS_LENGTH);
    }
    setTagsList(event.target.value);
  };

  const handleClose = () => {
    setTagsList([]);
    setSelectedLanguage(null);
    setSelectedCategory(null);
    onClose();
  };

  const handleSubmitData = () => {
    saveTags({
      language: selectedLanguage,
      category_id: selectedCategory.id,
      tags: Array.isArray(tagsList)
        ? tagsList
        : tagsList
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean),
    });
    handleClose();
    refetch();
    refetchCategories();
  };

  const handleDisableSubmitButton = useMemo(() => {
    return !(selectedLanguage && selectedCategory);
  }, [selectedLanguage, selectedCategory]);

  return (
    <Dialog open={open} onClose={handleClose}>
      <div className="w-[528px] bg-primary-100 flex justify-between px-4 py-2 items-center">
        <h3 className="text-white">{t('create_tags')}</h3>
        <IconButton edge="end" onClick={onClose} aria-label="close" color="white">
          <CloseIcon />
        </IconButton>
      </div>
      <DialogContent>
        <div className="flex flex-col gap-6 pr-[194px]">
          <div>
            <Label isRequired={true} text={t('language')} />
            <Autocomplete
              disablePortal
              popupIcon={<DropdownIcon />}
              value={selectedLanguage}
              options={Object.values(ProfileLanguages)}
              // getOptionLabel={(option) => option.name}
              renderInput={(params) => <TextField {...params} key={params.id} placeholder={t('select_language')} />}
              onChange={(_, newValue: string) => {
                setSelectedLanguage(newValue);
              }}
              onInputChange={(_, __, reason) => {
                if (reason === 'clear') {
                  setSelectedLanguage(null);
                }
              }}
              renderOption={(props, option: string) => (
                <Box component="li" {...props}>
                  {option}
                </Box>
              )}
              sx={{
                '& .MuiInputBase-root': {
                  paddingTop: '0px',
                  paddingBottom: '0px',
                },
                '& .MuiInputBase-input ': {
                  paddingTop: '6.01px !important',
                  paddingBottom: '6px !important',
                },
                '.MuiAutocomplete-endAdornment': {
                  top: '6px',
                  right: '20.2px !important',
                },
              }}
              clearOnEscape
            />
          </div>

          <div>
            <Label isRequired={true} text={t('category')} />

            {categories && (
              // <Controller
              // 	name='category'
              // 	control={control}
              // 	defaultValue={null}
              // 	render={({ field: { onChange, value }, fieldState: { error } }) => (
              <Autocomplete
                disablePortal
                popupIcon={<DropdownIcon fill="#949494" />}
                value={selectedCategory ? categories.find((option) => option.id === selectedCategory.id) : null}
                options={categories || []}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => <TextField {...params} key={params.id} placeholder={t('choose_category')} />}
                onChange={(_, newValue) => {
                  setSelectedCategory(newValue);
                }}
                onInputChange={(_, __, reason) => {
                  if (reason === 'clear') {
                    setSelectedCategory(null);
                  }
                }}
                // value={categories.find((option) => option.id === value) || null}
                // inputValue={categories.find((option) => option.id === value)?.name || ''}
                renderOption={(props, option: ICategory) => (
                  <Box component="li" {...props}>
                    <span className={[option.parent_id ? 'pl-2' : 'font-bold']}>{option.name}</span>
                  </Box>
                )}
                sx={{
                  '& .MuiInputBase-root': {
                    paddingTop: '0px',
                    paddingBottom: '0px',
                  },
                  '& .MuiInputBase-input ': {
                    paddingTop: '4.51px !important',
                    paddingBottom: '4.5px !important',
                  },
                  '.MuiAutocomplete-endAdornment': {
                    top: '5px',
                    right: '20.2px !important', // Move the popup icon to the right
                  },
                }}
                clearOnEscape
              />
            )}
            {/* />
						)} */}
          </div>

          <div>
            <Label text={t('list_tags')} />
            <p className="text-text-secondary -mt-2.5">({t('max_500_symbols')}):</p>
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder={t('textfield_tags')}
              inputProps={{ maxLength: MAX_TAGS_LENGTH }}
              onChange={handleInputChange}
              value={tagsList}
            />
          </div>
        </div>
      </DialogContent>
      <div className="flex gap-2 py-4 pl-6 pr-[194px]">
        <Button
          disabled={handleDisableSubmitButton}
          sx={{ width: '131px', height: '35px', fontSize: '18px' }}
          onClick={handleSubmitData}
          color="info"
          variant="contained"
          type="submit"
        >
          {t('save')}
        </Button>
        {/* @ts-ignore */}
        <Button
          sx={{
            width: '131px',
            height: '35px',
            fontSize: '18px',
          }}
          onClick={handleClose}
          color="disabled"
          variant="outlined"
        >
          {t('cancel')}
        </Button>
      </div>
    </Dialog>
  );
};
