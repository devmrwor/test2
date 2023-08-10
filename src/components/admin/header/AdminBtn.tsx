import { ProfileIcon } from '@/components/Icons/Icons';
import { useTranslation } from 'next-i18next';
import { Fragment } from 'preact';
import { ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import React, { useState, MouseEvent } from 'react';
import { faPersonWalkingArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function AdminBtn(props: { onClick?: () => void }) {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    if (props.onClick) props.onClick();
    setAnchorEl(null);
  };
  return (
    <Fragment>
      <button
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        className="flex flex-col items-center justify-center py-1 px-2 hover:bg-primary-900"
      >
        <ProfileIcon size="large" color="white" />
        <p className="text-white ">{t('user_profile')}</p>
      </button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <MenuItem onClick={handleClose} className="flex gap-1" sx={{ paddingRight: '45px' }}>
          <FontAwesomeIcon color="#949494" icon={faPersonWalkingArrowRight} />
          {t('admin_exit')}
        </MenuItem>
      </Menu>
    </Fragment>
  );
}
