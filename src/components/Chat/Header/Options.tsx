import React, { MouseEvent, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis, faAddressCard, faUserLargeSlash, faComment, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Fragment } from 'preact';
import { Box, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { uniteRoutes } from '@/utils/uniteRoute';
import { ClientRoutes } from '../../../../common/enums/api-routes';
import { useChatContext } from '@/contexts/chatContext';

export default function Options() {
  const { t } = useTranslation();
  const { userData } = useChatContext();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpenProfile = () => {
    if (!userData) return;
    router.push(uniteRoutes([ClientRoutes.CLIENT, ClientRoutes.CUSTOMER, userData.id]));
    handleClose();
  };

  return (
    <Fragment>
      <button onClick={handleClick}>
        <FontAwesomeIcon icon={faEllipsis} size="xl" className="text-primary-100" />
      </button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleOpenProfile}>
          <ListItemIcon>
            <FontAwesomeIcon icon={faAddressCard} size="lg" color="#000" width={25} />
          </ListItemIcon>
          <ListItemText>{t('chats_content.to_profile')}</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <FontAwesomeIcon icon={faUserLargeSlash} size="lg" color="#000" width={25} />
          </ListItemIcon>
          <ListItemText>{t('chats_content.block')}</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <div className="relative">
              <FontAwesomeIcon icon={faComment} size="lg" color="#000" width={25} />
              <Box
                sx={{
                  position: 'absolute',
                  width: '10px',
                  height: '10px',
                  backgroundColor: 'red',
                  right: '0',
                  top: '0',
                  borderRadius: '50%',
                }}
              ></Box>
            </div>
          </ListItemIcon>
          <ListItemText>
            <span>{t('chats_content.mark_unread')}</span>
          </ListItemText>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <FontAwesomeIcon icon={faTrash} size="lg" color="#000" width={25} />
          </ListItemIcon>
          <ListItemText>
            <span>{t('chats_content.delete_chat')}</span>
          </ListItemText>
        </MenuItem>
      </Menu>
    </Fragment>
  );
}
