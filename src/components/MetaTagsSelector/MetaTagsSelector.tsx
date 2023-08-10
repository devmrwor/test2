import React, { useState, ChangeEvent, useCallback, useMemo } from 'react';
import { IconButton } from '@mui/material';
import { metaTags } from '../../../common/constants/metaTags';
import { useTranslation } from 'next-i18next';
import { Label } from '../primitives/Label/Label';
import DeleteIcon from '@mui/icons-material/Delete';
import classNames from 'classnames';
import { ShareButton } from '../Buttons';
import { MetaTagsButton } from '../Buttons/ready/MetaTagsButton';
import { SearchInput } from '../primitives/SearchInput/SearchInput';
import { BinXs, Bin } from '../Icons/Icons';
import { BaseButton } from '../Buttons/BaseButton';

interface MetaTagChooserProps {
  value: string[];
  list: string[];
  errorsMessage?: string;
  onChange: (chosenMetaTags: string[]) => void;
}

const MetaTagChooser: React.FC<MetaTagChooserProps> = ({ value = [], list = [], errorsMessage, onChange }) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredMetaTags = useMemo(
    () => (list.length ? list : ['test']).filter((name) => name.toLowerCase().includes(searchTerm)),
    [list, searchTerm]
  );

  const handleAddTag = useCallback(
    (tag: string) => {
      onChange([...value, tag]);
    },
    [value, onChange]
  );

  const handleRemoveTag = useCallback(
    (tag: string) => {
      onChange([...value.filter((item) => item !== tag)]);
    },
    [filteredMetaTags, onChange]
  );

  const handleSearchChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term.toLowerCase());
  }, []);

  return (
    <>
      <div className="p-2 bg-primary-50 rounded">
        <Label text={t('meta_tags')} isRequired />
        <div className="mb-4 mt-2 px-1 flex gap-1 flex-wrap">
          {value.map((tag) => (
            <BaseButton
              textClasses="-order-1"
              size="xs"
              color="primary"
              type="solid"
              key={tag}
              text={tag}
              onClick={() => handleRemoveTag(tag)}
              Icon={Bin}
            />
          ))}
        </div>

        <SearchInput
          error={!!errorsMessage}
          classes="mb-2.75 w-full"
          placeholder={t('meta_tags_search')}
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <div className="bg-white p-2.5 rounded-md text-sm">
          <p className="mb-2 text-text-primary">{t('meta_tags_hints')}</p>
          <ul className="flex flex-wrap gap-1">
            {filteredMetaTags.map((tag) => {
              const isActive = value.includes(tag);
              return (
                <MetaTagsButton
                  key={tag}
                  text={tag}
                  isActive={isActive}
                  onClick={() => !isActive && handleAddTag(tag)}
                />
              );
            })}
          </ul>
        </div>
      </div>
      {errorsMessage && <span className="text-red-500 mt-2">{errorsMessage}</span>}
    </>
  );
};

export default MetaTagChooser;
