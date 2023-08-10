import styled from '@emotion/styled';
import { Switch } from '@mui/material';

const IOSSwitch = styled(Switch)`
  width: 42px;
  height: 26px;
  padding: 0;
  //margin-right: 8px;

  & .MuiSwitch-switchBase {
    padding: 0;
    margin: 2px;
    transition-duration: 300ms;
    
    &.Mui-checked {
      transform: translateX(16px);
      color: #fff;
      
      &.MuiSwitch-track {
        background-color: #65C466;
        opacity: 1;
        border: 0;
      },
    },
    &.Mui-focusVisible .MuiSwitch-thumb {
      color: #33cf4d;
      border: 6px solid #fff;
    },
    & .Mui-disabled .MuiSwitch-thumb {
      color: grey;
    }
  },
  & .MuiSwitch-thumb {
    box-sizing: border-box;
    width: 22px;
    height: 22px;
  },
  & .MuiSwitch-track {
    border-radius: 13px;
    background-color: #E9E9EA;
    opacity: 1;
    transition-property: background-color;
    transition-duration: 500ms;
    
  },
  & .Mui-disabled + .MuiSwitch-track {
     opacity: 0.5;
  },
`;

export default IOSSwitch;
