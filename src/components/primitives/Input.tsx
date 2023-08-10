import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";
import { ChangeEvent } from "react";

const Gender = (props: {
  value: number;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}) => {
  function handleClick(event: ChangeEvent<HTMLInputElement>) {
    if (props.onChange) {
      props.onChange(event);
    }
  }

  return (
    <FormControl>
      <FormLabel id="demo-radio-buttons-group-label">Пол</FormLabel>
      <RadioGroup
        onChange={handleClick}
        value={props.value}
        aria-labelledby="demo-radio-buttons-group-label"
      >
        <FormControlLabel value={0} control={<Radio />} label="Мужчина" />
        <FormControlLabel value={1} control={<Radio />} label="Женщина" />
      </RadioGroup>
    </FormControl>
  );
};

export default Gender;
