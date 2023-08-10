import { TextField, MenuItem, InputAdornment, Select } from '@mui/material';
import { Messenger, MessengerItem } from '../../../common/types/messenger';
import { messengers } from '../../../common/constants/messengers';
import { FormControlsWrapper } from '../FormControlsWrapper/FormControlsWrapper';
import { Label } from '../primitives/Label/Label';
import { useTranslation } from 'next-i18next';
import { CustomCheckbox } from '../Checkbox/Checkbox';
import { AddButton } from '../Buttons';
import { DropdownIcon } from '../Icons/Icons';

interface MessengerListProps {
  value: MessengerItem[];
  disableAdding?: boolean;
  onChange: (value: MessengerItem[]) => void;
}

const MessengerList: React.FC<MessengerListProps> = ({ value, disableAdding = false, onChange }) => {
  const { t } = useTranslation();

  const addMessenger = () => {
    onChange([...value, { messenger: messengers[0], nicknameOrNumber: '' }]);
  };

  return (
    <div>
      <FormControlsWrapper>
        <Label text={t('messenger')} isRequired caption={t('messenger_caption')} />
        {!disableAdding && <AddButton onClick={addMessenger} />}
      </FormControlsWrapper>

      <div className="flex flex-col items-center w-full space-y-3">
        {(value.length ? value : [{ nicknameOrNumber: '', messenger: messengers[0] }]).map((selected, index) => (
          <div key={index} className="flex w-full">
            <TextField
              placeholder="+420"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '4px 0 0 4px',
                },
              }}
              value={selected.nicknameOrNumber}
              size="small"
              onChange={(event) => {
                const updatedMessengers = [...value];
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
            <div className="w-messenger">
              <Select
                size="small"
                IconComponent={DropdownIcon}
                value={selected.messenger.name}
                sx={{
                  '& .MuiSelect-icon': { top: 17, right: 10 },
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '4px 0 0 4px',
                  },
                  '.MuiOutlinedInput-notchedOutline': {
                    borderLeftColor: 'transparent',
                    borderLeftWidth: '0',
                  },
                }}
                onChange={(event) => {
                  const updatedMessengers = [...value];
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
            </div>
          </div>
        ))}
      </div>
      {((disableAdding && value.length && value.length <= 1) || '') && (
        <div className="flex items-center mt-1 relative -left-2">
          <CustomCheckbox onClick={addMessenger} />
          <p className="ml-2">{t('add_more_messenger')}</p>
        </div>
      )}
    </div>
  );
};

export default MessengerList;
