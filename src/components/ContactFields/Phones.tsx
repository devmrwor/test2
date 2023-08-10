import { Phone } from '../../../common/types/individual';
import { useState, useEffect, ChangeEvent, useDeferredValue } from 'react';
import { AddCircleIconBig, Bin } from '../Icons/Icons';
import { IconButtonWrap } from '../Buttons/IconButtonWrap';
import { BaseButton } from '../Buttons/BaseButton';
import { TextField } from '@mui/material';
import { IsRequiredInput } from '../primitives/IsRequiredInput';

interface IPhoneProps {
  values: Phone[];
  onChange: (values: Phone[]) => void;
}

export const Phones = ({ values, onChange }: IPhoneProps) => {
  const defaultValue = values.length === 0 ? [{ id: 0, value: '' }] : values;
  const [nextId, setNextId] = useState(defaultValue[defaultValue.length - 1].id);
  const [phones, setPhones] = useState(defaultValue);
  const deferredPhones = useDeferredValue(phones);

  const handleAddPhone = () => {
    setPhones((prevPhones) => {
      const newId = nextId + 1;
      setNextId(newId);
      const newPhone = { id: newId, value: '' };
      return [...prevPhones, newPhone];
    });
  };

  const handleDeletePhone = (id: number) => {
    setPhones((prevPhones) => prevPhones.filter((phone) => phone.id !== id));
  };

  useEffect(() => {
    onChange(deferredPhones);
  }, [deferredPhones]);

  return (
    <div>
      <div className="flex justify-between items-center">
        <IsRequiredInput text="phones" caption="without_spaces" filled={phones.length > 0 && phones[0]?.value !== ''} />
        <BaseButton Icon={AddCircleIconBig} onClick={handleAddPhone} />
      </div>
      {phones.map((el, i) => (
        <div className="mb-5.75 flex" key={i}>
          <TextField
            fullWidth
            value={el.value}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setPhones((prev) =>
                prev.map((phone) => (phone.id === el.id ? { ...phone, value: event?.target?.value } : phone))
              )
            }
            variant="outlined"
            placeholder="+420123456789"
            size="small"
            InputLabelProps={{ shrink: true }}
            sx={{
              '& .MuiInputBase-input': {
                paddingTop: '6px',
                paddingBottom: '6px',
              },
            }}
          />
          {i > 0 && (
            <IconButtonWrap icon={<Bin />} classes="ml-4.5 text-[18px]" onClick={() => handleDeletePhone(el.id)} />
          )}
        </div>
      ))}
    </div>
  );
};
