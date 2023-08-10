import { useTranslation } from 'next-i18next';
import { messengers } from '../../../common/constants/messengers';
import { TextField, MenuItem, Select, Box } from '@mui/material';
import { Messenger, MessengerItem } from '../../../common/types/messenger';
import { CustomCheckbox } from '../Checkbox/Checkbox';
import { BaseButton } from '../Buttons/BaseButton';
import { AddCircleIconBig, Bin, DropdownIcon } from '../Icons/Icons';
import { useDeferredValue, useEffect } from 'react';
import { IconButtonWrap } from '../Buttons/IconButtonWrap';
import { IsRequiredInput } from '../primitives/IsRequiredInput';

interface IMessengerProps {
  values: MessengerItem[];
  onChange: (values: MessengerItem[]) => void;
  disableAdding?: boolean;
  required?: boolean;
}

export const Messengers = ({ values, onChange, disableAdding = false, required = true }: IMessengerProps) => {
  const { t } = useTranslation();
  const deferredValues = useDeferredValue(values);

  useEffect(() => {
    if (!values?.length) {
      onChange([{ messenger: messengers[0], nicknameOrNumber: '' }]);
    }
  }, []);

  const addMessenger = () => {
    onChange([...values, { messenger: messengers[0], nicknameOrNumber: '' }]);
  };

  const deleteMessenger = (index: number) => {
    const updatedMessengers = values.filter((_, i) => i !== index);
    onChange(updatedMessengers);
  };

  return (
    <div>
      <div className="flex justify-between">
        <IsRequiredInput
          text="messengers"
          caption="messenger_caption"
          required={required}
          filled={deferredValues.some((el) => el.nicknameOrNumber !== '')}
        />
        <BaseButton Icon={AddCircleIconBig} onClick={addMessenger} />
      </div>
      <div>
        <div className="flex flex-col items-center w-full space-y-3">
          {values.map((selected, index) => (
            <div key={index} className="flex w-full items-center">
              <Box
                // className="w-messenger"
                sx={{
                  '& .MuiInputBase-root': {
                    borderRadius: '4px 0 0 4px !important',
                    minWidth: '120px',
                  },
                }}
              >
                <Select
                  size="small"
                  IconComponent={DropdownIcon}
                  value={selected.messenger.name}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '4px 0 0 4px',
                    },
                    '& .MuiInputBase-input': {
                      paddingTop: '6px',
                      paddingBottom: '6px',
                    },
                    '.MuiOutlinedInput-notchedOutline': {
                      borderRightColor: 'transparent',
                      borderRightWidth: '0',
                    },
                    '& .MuiSelect-icon': { top: 15, right: 14 },
                  }}
                  onChange={(event) => {
                    const updatedMessengers = [...values];
                    if (!updatedMessengers[index]) {
                      onChange([
                        {
                          messenger: messengers.find((messenger) => event.target.value === messenger.name) as Messenger,
                          nicknameOrNumber: '',
                        },
                      ]);
                      return;
                    }
                    updatedMessengers[index].messenger = messengers.find(
                      (messenger) => event.target.value === messenger.name
                    ) as Messenger;
                    onChange(updatedMessengers);
                  }}
                  fullWidth
                  variant="outlined"
                >
                  {messengers.map((messenger) => (
                    <MenuItem key={messenger.id} value={messenger.name}>
                      {messenger.name}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
              <TextField
                placeholder="+420"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '0 4px 4px 0',
                  },
                  '& .MuiInputBase-input': {
                    paddingTop: '6px',
                    paddingBottom: '6px',
                  },
                }}
                value={selected.nicknameOrNumber}
                size="small"
                onChange={(event) => {
                  const updatedMessengers = [...values];
                  if (!updatedMessengers[index]) {
                    onChange([{ messenger: messengers[0], nicknameOrNumber: event.target.value }]);
                    return;
                  }
                  updatedMessengers[index].nicknameOrNumber = event.target.value;
                  onChange(updatedMessengers);
                }}
                variant="outlined"
                fullWidth
                className="grow"
              />
              {index > 0 && (
                <IconButtonWrap icon={<Bin />} classes="ml-4.5 text-[18px]" onClick={() => deleteMessenger(index)} />
              )}
            </div>
          ))}
        </div>
        {((disableAdding && values.length && values.length <= 1) || '') && (
          <div className="flex items-center mt-1 relative -left-2">
            <CustomCheckbox onClick={addMessenger} />
            <p className="ml-2">{t('add_more_messenger')}</p>
          </div>
        )}
      </div>
    </div>
  );
};
