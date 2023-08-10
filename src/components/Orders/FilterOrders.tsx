import { BackHeader } from '../primitives/BackHeader/BackHeader';
import { SegmentedControl } from '@mantine/core';
import { Roles } from '../../../common/enums/roles';
import { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { CustomerTypes } from '../../../common/enums/customer-type';
import { DoubleButton } from '../Buttons/DoubleButton';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { DropdownIcon, YoungIcon, OldIcon } from '../Icons/Icons';
import { MenuItem, TextField } from '@mui/material';
import { OrderStatusesFilter } from '../../../common/enums/orders-filter';
import _filter from '@/styles/client/filter.module.css';
import { SortOrders } from '../../../common/enums/sort-order';
import { SegmentedControls } from '../primitives/SegmentedControl/SegmentedControl';
import { BallotRounded } from '@mui/icons-material';

interface FilterOrdersProps {
  onBackClick: () => void;
  filters: null | any;
  setFilters: (filters: any) => void;
  filterFilters: (filters: any) => void;
}

const DEFAULT_FILTERS = {
  status: '',
  type: '',
  lowest_price: '',
  highest_price: '',
  sortOrder: '',
};

export const FilterOrders = ({ onBackClick, filters, setFilters, filterFilters }: FilterOrdersProps) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (!filters) {
      setFilters(DEFAULT_FILTERS);
      return;
    }
    setFilters({ ...DEFAULT_FILTERS, ...filters });
  }, []);

  const handleStatusChange = (event: SelectChangeEvent) => {
    setFilters({ ...filters, status: event.target.value });
  };

  const handleTypeChange = (value: string) => {
    setFilters({ ...filters, type: value });
  };

  const handlePriceChange = (value: string, type: string) => {
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue)) {
      setFilters({ ...filters, [type]: value });
    }
  };

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
    localStorage.removeItem('orderFilters');
  };

  const handleApplyFilters = () => {
    const cleanedFilters = filterFilters(filters);
    localStorage.setItem('orderFilters', JSON.stringify(cleanedFilters));
    onBackClick();
  };

  const handleGoBack = () => {
    try {
      const savedFilters = localStorage.getItem('orderFilters');
      savedFilters ? setFilters(JSON.parse(savedFilters)) : setFilters(null);
    } catch (error) {
      console.log(error);
    }
    onBackClick();
  };

  if (!filters) {
    return <></>;
  }

  return (
    <>
      <BackHeader
        onClick={handleGoBack}
        heading="orders_filter"
        buttonContent={t('clear_orders_filter')}
        buttonFunc={handleReset}
        classes="mt-2 pl-1.75 pr-2.75"
      />
      <div className="mt-5.75 pl-3.25 pr-3.75">
        <SegmentedControls />
        <DoubleButton value={filters.type} setValue={handleTypeChange} classes="mt-6 mb-6.25" />
        <h2 className="text-lg">{t('status')}</h2>
        <Select
          fullWidth
          IconComponent={DropdownIcon}
          id="sortSelect"
          value={filters.status}
          onChange={handleStatusChange}
          style={{ height: '35px' }}
          sx={{
            '& .MuiSelect-icon': { top: 15, right: 13.4 },
            '& .MuiSelect-select': {
              color: '#949494',
            },
          }}
        >
          {Object.values(OrderStatusesFilter).map((el) => (
            <MenuItem key={el} value={el}>
              {t(el + '_orders')}
            </MenuItem>
          ))}
        </Select>
        <div className="flex items-center space-x-px mt-8 mb-8.5">
          {Object.values(SortOrders).map((type) => (
            <button
              key={type}
              onClick={(e) => {
                e.preventDefault();
                setFilters({ ...filters, sortOrder: type });
              }}
              className={`flex justify-center items-center my-1 grow p-0.5 ${
                filters.sortOrder === type ? 'bg-primary-200 text-black ' : 'bg-background text-text-secondary '
              } ${_filter['toggle__btn']}`}
            >
              {type === SortOrders.DESC && <YoungIcon fill="currentColor" />}
              {type === SortOrders.ASC && <OldIcon fill="currentColor" />}
              <span className="ml-2">{type === SortOrders.DESC ? t('first_new') : t('old_first')}</span>
            </button>
          ))}
        </div>
        <h2 className="text-lg">{t('budget')}</h2>
        <TextField
          fullWidth
          placeholder={t('price_from')}
          value={filters.lowest_price}
          onChange={(e) => handlePriceChange(e.target.value, 'lowest_price')}
          sx={{
            '.MuiInputBase-root': {
              marginBottom: '11px',
              height: '35px',
            },
          }}
        />
        <TextField
          fullWidth
          placeholder={t('price_to')}
          value={filters.highest_price}
          onChange={(e) => handlePriceChange(e.target.value, 'highest_price')}
          sx={{
            '.MuiInputBase-root': {
              height: '35px',
            },
          }}
        />
        <button onClick={handleReset} className="w-full mt-6.25 mx-auto uppercase text-primary-100">
          {t('clear_filters')}
        </button>
        <button
          onClick={handleApplyFilters}
          type="submit"
          className="w-full mt-5 pt-2.25 pb-1.25 bg-green-100 text-white rounded"
        >
          {t('show_profiles', { profiles: '' })}
        </button>
      </div>
    </>
  );
};
