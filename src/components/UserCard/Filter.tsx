// @ts-nocheck
import {
  ChevronLeftSolid,
  UserIconBottom,
  BuildingUser,
  HourglassHalf,
  StarGroup,
  MaleIcon,
  FemaleIcon,
  LanguageIcon,
  Star,
  CaretRight,
  DropdownIcon,
} from '@/components/Icons/Icons';
import { TextField, SvgIcon, MenuItem, Autocomplete } from '@mui/material';
import { radiuses } from '../../../common/constants/radiuses';
import { ExecutorTypes } from '../../../common/enums/executor-type';
import { useEffect, useState } from 'react';
import { JobTypes } from '../../../common/enums/job-types';
import { CustomCheckbox } from '../Checkbox/Checkbox';
import { Gender } from '../../../common/enums/gender';
import { ServiceLocation } from '../../../common/enums/service-location';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { FormControlsWrapper } from '../FormControlsWrapper/FormControlsWrapper';
import { languagesData } from '../../../common/constants/languages';
import { useTranslation } from 'next-i18next';
import { SortOrders } from '../../../common/enums/sort-order';
import { PlacesInput } from '../primitives/PlacesInput';
import _filter from '@/styles/client/filter.module.css';
import { secondary } from '@/themes/colors';
import { defaultFilters } from '../../../common/constants/defaultFilters';

const SortOrdersVariants = {
  DATE_DESC: {
    sortField: 'date',
    sortOrder: SortOrders.DESC,
  },
  DATE_ASC: {
    sortField: 'date',
    sortOrder: SortOrders.ASC,
  },
};

export default function Filter(props) {
  const { handleBack, filters, setFilters, profiles, setSortingType, handleCategories } = props;
  const [sorting, setSorting] = useState(SortOrdersVariants.DATE_DESC);
  const [selectPlace, setSelectPlace] = useState(ServiceLocation.ANY);
  const { t } = useTranslation();

  useEffect(() => {
    if (!filters) {
      setFilters(defaultFilters);
      return;
    }
    setFilters({ ...defaultFilters, ...filters });
  }, []);

  useEffect(() => {
    console.log(filters);
  }, [filters]);

  const handleRatingChange = () => {
    const newValue = filters.high_rating ? '' : 4;
    setFilters({ ...filters, high_rating: newValue });
  };

  const handleJobTypeChange = () => {
    const newValue = filters.job_type === JobTypes.TEMPORARY ? 'any' : JobTypes.TEMPORARY;
    setFilters({ ...filters, job_type: newValue });
  };

  const handleChange = (event: SelectChangeEvent) => {
    setSorting(event.target.value as string);
    setSortingType(event.target.value as string);
  };

  const handleReset = () => {
    setFilters(defaultFilters);
    setSelectPlace(ServiceLocation.ANY);
    localStorage.removeItem('filters');
  };

  const handleSubmitData = () => {
    handleBack(false);
    localStorage.setItem('filters', JSON.stringify(filters));
  };

  const handleBudgetChange = (value) => {
    const numericValue = value.replace(/\D/g, '');
    return numericValue;
  };

  const handleGoBack = () => {
    try {
      const savedFilters = localStorage.getItem('filters');
      savedFilters ? setFilters(JSON.parse(savedFilters)) : setFilters(null);
    } catch (error) {
      console.log(error);
    }
    handleBack(false);
  };

  if (!filters) {
    return <></>;
  }

  return (
    <div className="executorProfile">
      <div className="flex item-center justify-between px-3.25 py-1 text-[28px] bg-primary-100  mb-6.25">
        <button className="flex items-center" onClick={handleGoBack}>
          <div className="text-lg leading-none">
            <ChevronLeftSolid fill="#fff" />
          </div>
          <div className="text-white text-base leading-none ml-0.5">{t('backward')}</div>
        </button>
        <div className="text-white text-base leading-7">{t('filter')}</div>
        <button onClick={handleReset} className="text-white text-base leading-7">
          {t('clear')}
        </button>
      </div>
      <div className="ml-[18.4px]">
        <div className="mr-6.25 mb-6.25">
          <p>{t('category_subcategory')}</p>
          <div className="grow rounded-md mt-px" onClick={handleCategories}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder={t('specify_service')}
              value={filters.category.name}
              InputProps={{
                endAdornment: <SvgIcon component={CaretRight} viewBox="0 0 24 24" />,
                readOnly: true,
              }}
              sx={{
                '.MuiInputBase-root': {
                  height: '35px',
                },
              }}
            />
          </div>
        </div>
        <div className="mr-[25px] mb-[15px]">
          <p>{t('specify_country')}</p>
          <div className="grow rounded-md mt-px">
            {/* FIXME places api hardcoded countries */}
            <PlacesInput
              placeholder="city_placeholder"
              queryCountries={['ua', 'cz']}
              inputValue={filters.address}
              onChange={(value) => setFilters({ ...filters, address: value })}
            />
            {/* <TextField
              fullWidth
              variant="outlined"
              placeholder={t('city_placeholder')}
              InputProps={{
                startAdornment: <LocationDotExtended />,
              }}
              sx={{
                '.MuiInputBase-input': {
                  marginLeft: '9px',
                },
                '.MuiInputBase-root': {
                  height: '35px',
                },
              }}
              value={filters.address}
              onChange={(e) => setFilters({ ...filters, address: e.target.value })}
            /> */}
          </div>
        </div>
        <div>
          <p className="text-text-secondary">
            {t('search_radius')} ({t('kilometers')}):
          </p>
          <div className="flex items-center mr-9 mt-1.5 space-x-[7px]">
            {radiuses.slice(0, -1).map((radius) => (
              <button
                key={radius}
                onClick={() => setFilters({ ...filters, service_radius: radius })}
                className={`text-sm py-0.5 px-[8px] rounded-md border ${
                  filters.service_radius === radius
                    ? 'bg-primary-100 text-white p-px border-primary-100'
                    : 'bg-background text-text-secondary border-text-secondary'
                }`}
              >
                {radius} {t('kilometers')}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-[27px] mb-[26px] -mx-[31.4px] border-background-decorative border-b"></div>
        <div>
          <p>{t('type_of_executor')}</p>
          <div className="flex items-center mt-1.5 mr-[15px] space-x-px">
            {Object.values(ExecutorTypes).map((role) => (
              <button
                key={role}
                onClick={() => setFilters({ ...filters, type: role })}
                className={`pt-1.25 pb-0.75 leading-5 grow capitalize ${
                  filters.type === role ? 'bg-primary-200 text-black' : 'bg-background text-text-secondary'
                } ${_filter['toggle__btn']}`}
              >
                {role === ExecutorTypes.INDIVIDUAL && (
                  <UserIconBottom fill={filters.type === role ? '#000' : secondary.value} size="md" />
                )}
                {role === ExecutorTypes.COMPANY && (
                  <BuildingUser fill={filters.type === role ? '#000' : secondary.value} size="md" />
                )}
                <span className="ml-1">{t(role)}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="mt-[29px] mb-6 -mx-[31.4px] border-background-decorative border-b"></div>
        <div>
          <p>{t('executor_occupation')}</p>
          <div className="flex items-center mt-1.5 mr-[15px] space-x-px">
            {Object.values(JobTypes)
              .reverse()
              .map((job) => (
                <button
                  key={job}
                  onClick={() => setFilters({ ...filters, job_type: job })}
                  className={`flex justify-center items-center pt-1.5 pb-1 grow capitalize text-black leading-5 ${
                    filters.job_type === job ? 'bg-primary-200 text-black' : 'bg-background text-text-secondary'
                  } ${_filter['toggle__btn']}`}
                >
                  {job === JobTypes.MAIN && (
                    <StarGroup fill={filters.job_type === JobTypes.MAIN ? '#000' : secondary.value} />
                  )}
                  {job === JobTypes.TEMPORARY && (
                    <HourglassHalf fill={filters.job_type === JobTypes.TEMPORARY ? '#000' : secondary.value} />
                  )}
                  <span className="ml-1">{job === JobTypes.MAIN ? t('main_job') : t('part_time')}</span>
                </button>
              ))}
          </div>

          <div className="flex items-center mt-[10.5px] -ml-[9px]">
            <CustomCheckbox
              checked={filters.job_type === 'any'}
              onChange={() => setFilters({ ...filters, job_type: 'any' })}
            />
            <p>{t('doesnt_matter')}</p>
          </div>
        </div>
        <div className="mt-[26px] mb-[19px] -mx-[31.4px] border-background-decorative border-b"></div>
        <div>
          <p>{t('gender_executor')}</p>
          <div className="flex items-center mt-1.5 mr-4.75 space-x-px">
            {Object.values(Gender).map((gender) => (
              <button
                onClick={() => setFilters({ ...filters, gender })}
                key={gender}
                className={`flex justify-center items-center pt-1.25 pb-0.75 leading-5 grow capitalize ${
                  filters.gender === gender ? 'bg-primary-200 text-black' : 'bg-background text-text-secondary '
                } ${_filter['toggle__btn']}`}
              >
                {gender === Gender.MALE && <MaleIcon fill={filters.gender === gender ? '#000' : '#949494'} />}
                {gender === Gender.FEMALE && <FemaleIcon fill={filters.gender === gender ? '#000' : '#949494'} />}
                <span className="ml-1 capitalize">
                  {gender === Gender.MALE ? t('male_sex') : gender === Gender.FEMALE ? t('female_sex') : t('any')}
                </span>
              </button>
            ))}
          </div>
        </div>
        <div className="mt-[22.7px] mb-4.5 -mx-[31.4px] border-background-decorative border-b"></div>
        <div>
          <p>{t('service_location')}</p>
          <div className="flex items-center mt-1.5 mr-4.5 space-x-px">
            {Object.values(ServiceLocation).map((place) => (
              <button
                key={place}
                onClick={() => setSelectPlace(place)}
                className={`pt-1.25 pb-0.75 leading-5 rounded grow capitalize ${
                  selectPlace === place ? 'bg-primary-200 text-black' : 'bg-background text-text-secondary '
                }`}
              >
                <span className="ml-1">{t(place)}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="mt-[19.7px] mb-[18px] -mx-[31.4px] border-background-decorative border-b"></div>
        <div className="mr-[15px]">
          <p className="text-lg">{t('budget')}</p>
          <TextField
            value={filters.lowest_price}
            onChange={(e) => setFilters({ ...filters, lowest_price: handleBudgetChange(e.target.value) })}
            sx={{
              '.MuiInputBase-root': {
                marginBottom: '11px',
                height: '35px',
              },
            }}
            fullWidth
            placeholder={t('price_from')}
          />
          <TextField
            value={filters.highest_price}
            onChange={(e) => setFilters({ ...filters, highest_price: handleBudgetChange(e.target.value) })}
            fullWidth
            placeholder={t('price_to')}
            sx={{
              '.MuiInputBase-root': {
                height: '35px',
              },
            }}
          />
        </div>
        <div className="mt-6 mb-5.75 -mx-[31.4px] border-background-decorative border-b"></div>
        <div className="mr-5.75">
          <p className="text-lg">{t('sort')}</p>
          <Select
            fullWidth
            IconComponent={DropdownIcon}
            id="sortSelect"
            value={sorting}
            onChange={handleChange}
            style={{ height: '35px' }}
            sx={{
              '& .MuiSelect-icon': { top: 15, right: 13.4 },
              '& .MuiSelect-select': {
                color: '#949494',
              },
            }}
          >
            <MenuItem value={SortOrdersVariants.DATE_DESC}>{t('new_first')}</MenuItem>
          </Select>
        </div>
        <div className="mt-[28.5px] mb-[18.7px] -mx-[31.4px] border-background-decorative border-b"></div>
        <div className="mr-5.75">
          <div className="flex items-center mb-2">
            <LanguageIcon />
            <p className="ml-2 text-lg before:content-['*'] before:mr-0.5 before:text-red-100">{t('speaking')}</p>
          </div>
          <Autocomplete
            multiple
            fullWidth
            popupIcon={<DropdownIcon />}
            options={languagesData.map((item) => item.name)}
            value={filters.languages.map((item) => item.name)}
            renderInput={(params) => <TextField placeholder={t('choose_language')} {...params} size="small" />}
            onChange={(_, value) =>
              setFilters({
                ...filters,
                languages: value.map((item) => languagesData.find((lang) => lang.name === item) as Language),
              })
            }
            sx={{
              '.MuiAutocomplete-endAdornment': {
                top: '6px',
                right: '13.4px !important',
              },
              '.MuiInputBase-root': {
                paddingTop: '3.5px !important',
                paddingBottom: '3.5px !important',
              },
            }}
          />

          {/* <Autocomplete
            multiple
            fullWidth
            popupIcon={<DropdownIcon fill="#949494" />}
            options={languagesData.map((item) => item.name)}
            value={filters.languages.map((item) => item.name)}
            renderInput={(params) => <TextField placeholder={t('choose_language')} {...params} size="small" />}
            onChange={(_, value) =>
              setFilters({
                ...filters,
                languages: value.map((item) => languagesData.find((lang) => lang.name === item) as Language),
              })
            }
            sx={{
              '.MuiAutocomplete-endAdornment': {
                top: '8px',
                right: '20px !important',
              },
            }}
          /> */}
        </div>
        <div className="my-[19px] -mx-[31.4px] border-background-decorative border-b"></div>
        <div>
          <p>{t('other')}</p>
          <FormControlsWrapper
            type="left"
            classes="-ml-[9px] mb-2"
            onClick={() => setFilters({ ...filters, high_rating: !filters.high_rating })}
          >
            <CustomCheckbox checked={filters.high_rating} />
            <p>
              {t('executors_from')} {<Star fill="#55bc7d" />} 4
            </p>
          </FormControlsWrapper>
          <FormControlsWrapper
            type="left"
            classes="-ml-[9px] mb-1"
            onClick={() => setFilters({ ...filters, secure_deal_available: !filters.secure_deal_available })}
          >
            <CustomCheckbox checked={filters.secure_deal_available} />
            <div className="flex flex-col">
              <p>{t('card_payment')}</p>
              <p className="text-sm text-text-secondary">{t('through_safe_deal')}</p>
            </div>
          </FormControlsWrapper>
          <FormControlsWrapper
            type="left"
            classes="-ml-[9px] mb-2"
            onClick={() => setFilters({ ...filters, is_documents_confirmed: !filters.is_documents_confirmed })}
          >
            <CustomCheckbox checked={filters.is_documents_confirmed} />
            <div className="flex flex-col">
              <p>{t('documents_checked')}</p>
              <p className="text-sm text-text-secondary">{t('passport_video_copy')}</p>
            </div>
          </FormControlsWrapper>
          {/* FIXME: Artur. This option is removed from filter */}
          {/*<FormControlsWrapper type="left" classes="-ml-[9px] mb-3" onClick={handleJobTypeChange}>*/}
          {/*  <CustomCheckbox checked={filters.job_type === JobTypes.TEMPORARY} />*/}
          {/*  <p>{t('executors_ready_to_work')}</p>*/}
          {/*</FormControlsWrapper>*/}
          <FormControlsWrapper
            type="left"
            classes="-ml-[9px] mb-1.5"
            onClick={() => setFilters({ ...filters, photo: !filters.photo })}
          >
            <CustomCheckbox checked={filters.photo} />
            <p>{t('executors_with_photo')}</p>
          </FormControlsWrapper>
          <FormControlsWrapper
            type="left"
            classes="-ml-[9px]"
            onClick={() => setFilters({ ...filters, is_working_remotely: !filters.is_working_remotely })}
          >
            <CustomCheckbox checked={filters.is_working_remotely} />
            <div className="flex flex-col">
              <p>{t('works_remotely')}</p>
              <p className="text-sm text-text-secondary">{t('service_remotely')}</p>
            </div>
          </FormControlsWrapper>
        </div>
        <button onClick={handleReset} className="w-full mt-8 mx-auto uppercase text-primary-100">
          {t('clear_filters')}
        </button>
        <div className="mr-[21px]">
          <button
            onClick={handleSubmitData}
            type="submit"
            className="w-full mt-9  mb-4 pt-2 pb-[7px] bg-green-100 text-white rounded"
          >
            {t('show_profiles', { profiles })}
          </button>
        </div>
      </div>
    </div>
  );
}
