import { SearchIcon } from '@/components/Icons/Icons';
import classNames from 'classnames';
import { useTranslation } from 'next-i18next';
import { HTMLAttributes } from 'react';

interface SearchInputProps extends HTMLAttributes<HTMLInputElement> {
  classes?: string;
  disabled?: boolean;
  error?: boolean;
}

export const SearchInput = ({ error, classes, disabled, ...props }: SearchInputProps) => {
  return (
    <div className={classNames('relative h-9.5 grow', classes ?? 'max-w-[196px]')}>
      <div className="absolute left-3 top-2">
        <SearchIcon />
      </div>
      <input
        onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
        className={classNames(
          'pl-10 focus:outline-none focus:border-2 w-full h-full rounded-small border px-4 py-2.5 text-sm focus:border-primary-800',
          disabled
            ? 'text-text-disabled cursor-not-allowed placeholder:text-text-disabled border-text-disabled'
            : error
            ? ' text-text-primary  border-red-100'
            : ' text-text-primary  border-border-dark hover:border-text-primary'
        )}
        {...props}
      />
    </div>
  );
};
