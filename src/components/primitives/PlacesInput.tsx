// @ts-nocheck
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { LocationIcon } from '../Icons/Icons';
import throttle from '@/utils/throttle';
import { Autocomplete, TextField, InputAdornment } from '@mui/material';
import Script from 'next/script';
import { useTranslation } from 'next-i18next';

const autocompleteService = { current: null };

export const PlacesInput = ({
  placeholder,
  queryCountries,
  inputValue,
  onChange,
  iconColor = '#b0b0b0',
  filledInput = false,
  ...props
}) => {
  const { t } = useTranslation();
  const [value, setValue] = useState(inputValue || null);
  const [options, setOptions] = useState([]);
  const loaded = useRef(false);
  const apiKey = process.env.NEXT_PUBLIC_PLACES_API_KEY;

  const fetch = useMemo(
    () =>
      throttle((request, callback) => {
        autocompleteService.current.getPlacePredictions(request, callback);
      }, 200),
    []
  );

  // const truncateValue = (value, maxLength) => {
  //   if (value.length > maxLength) {
  //     return value.slice(0, maxLength) + '...';
  //   }
  //   return value;
  // };

  useEffect(() => {
    let active = true;

    if (!autocompleteService.current && window.google) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
    }
    if (!autocompleteService.current) {
      return undefined;
    }

    if (inputValue === '') {
      setOptions(value ? [value] : []);
      return undefined;
    }

    fetch(
      {
        input: inputValue,
        types: ['address'],
        componentRestrictions: { country: queryCountries },
      },
      (results) => {
        if (active) {
          let newOptions = [];

          if (value) {
            newOptions = [value];
          }

          if (results) {
            newOptions = [...newOptions, ...results];
          }

          setOptions(newOptions);
        }
      }
    );

    return () => {
      active = false;
    };
  }, [inputValue, queryCountries, value, fetch]);

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`}
        onLoad={() => {
          loaded.current = true;
        }}
      />
      <Autocomplete
        id="google-map-demo"
        getOptionLabel={(option) => (typeof option === 'string' ? option : option.description)}
        filterOptions={(x) => x}
        placeholder="Search for a city"
        popupIcon={null}
        options={options}
        autoComplete
        includeInputInList
        filterSelectedOptions
        value={value}
        onChange={(event, newValue) => {
          setOptions(newValue ? [newValue, ...options] : options);
          setValue(newValue);
        }}
        onInputChange={(event, newInputValue) => {
          onChange(newInputValue);
        }}
        renderInput={(params) => (
          <TextField
            {...props}
            {...params}
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <LocationIcon fill={iconColor} />
                </InputAdornment>
              ),
            }}
            variant="outlined"
            placeholder={t(placeholder)}
            fullWidth
          />
        )}
        sx={{
          '.MuiInputBase-input': {
            paddingRight: '40px !important',
          },
          '.MuiAutocomplete-endAdornment': {
            top: '5px',
            right: '12px !important',
          },
          '.MuiAutocomplete-inputRoot': {
            padding: '0 !important',
          },
          '.MuiAutocomplete-input': {
            paddingTop: '6px !important',
            paddingBottom: '6px !important',
          },
          '.MuiButtonBase-root': {
            marginTop: '-2px',
          },
          '.MuiInputAdornment-positionStart': {
            marginLeft: '10px',
          },
          '.MuiOutlinedInput-root': {
            backgroundColor: filledInput ? '#f3f3f3' : 'transparent',
            // color: filledInput ? '#33a1c9' : '#000',
          },
        }}
      />
    </>
  );
};
