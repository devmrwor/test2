import { styled } from '@mui/material/styles';
import Checkbox, { CheckboxProps } from '@mui/material/Checkbox';

const CustomIcon = styled('span')(({ theme }) => ({
  borderRadius: 4,
  width: 16,
  height: 16,
  boxShadow: 'none',
  border: '1px solid #949494',
  backgroundColor: 'rgba(255, 255, 255, 1)',
  '.Mui-focusVisible &': {
    outline: '2px solid #0f89ff',
    outlineOffset: 6,
  },
  'input:hover ~ &': {
    border: '1px solid #33a1c9',
  },
  'input:active ~ &': {
    border: '1px solid #33a1c9',
  },
  'input:disabled ~ &': {
    border: '1px solid #e2e2e2',
  },
}));

const CustomCheckedIcon = styled(CustomIcon)({
  backgroundColor: '#33a1c9',
  border: '1px solid #33a1c9',
  '&:before': {
    display: 'block',
    width: 16,
    height: 16,
    backgroundImage:
      "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-424.36 -1979.77 16 16'%3E%3Cpath" +
      " fill-rule='evenodd' clip-rule='evenodd' d='M-411.993-1976.507c.295.352.295.923 0 1.274l-6.05 7.199c-.296.351-.775.351-1.071 0l-3.025-3.6a1.026 1.026 0 0 1 0-1.273c.296-.352.776-.352 1.071 0l2.491 2.961 5.515-6.561c.296-.351.776-.351 1.069 0Z' fill='%23fff'/%3E%3C/svg%3E\")",
    content: '""',
  },
  'input:hover ~ &': {
    border: '1px solid #2c8db0',
    backgroundColor: '#2c8db0',
  },
  'input:active ~ &': {
    border: '1px solid #2c8db0',
    backgroundColor: '#2c8db0',
  },
  'input:disabled ~ &': {
    border: '1px solid #e2e2e2',
    backgroundColor: '#e2e2e2',
  },
});

// Inspired by blueprintjs
export function CustomCheckbox(props: CheckboxProps) {
  return (
    <Checkbox
      disableRipple
      color="default"
      checkedIcon={<CustomCheckedIcon />}
      icon={<CustomIcon />}
      inputProps={{ 'aria-label': 'Checkbox' }}
      {...props}
    />
  );
}
