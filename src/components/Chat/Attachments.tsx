import React, { MouseEvent, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandshake, faPlus, faCamera, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { Fragment } from 'preact';
import { ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useSession } from 'next-auth/react';
import { useChatContext } from '@/contexts/chatContext';
import { ApiOrdersRoutes, ApiRoutes } from '../../../common/enums/api-routes';
import { uniteApiRoutes } from '@/utils/uniteRoute';
import { toast } from 'react-toastify';

interface AttachmentsProps {
  disabled?: boolean;
}

export default function Attachments({ disabled = false }: AttachmentsProps) {
  const { t } = useTranslation();
  const { chat, addMessage } = useChatContext();
  const { data } = useSession();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const userId = data?.user.id;

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    event.preventDefault();
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAgree = async () => {
    try {
      handleClose();
      if (!chat) return;
      const res = await fetch(uniteApiRoutes([ApiRoutes.ORDERS, chat.order_id, chat.id, ApiOrdersRoutes.AGREE]), {
        method: 'POST',
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error);
      }
      const message = await res.json();
      addMessage(message);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <Fragment>
      <button onClick={handleClick}>
        <FontAwesomeIcon icon={faPlus} size="xl" className="text-primary-100" />
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
        {chat && userId === chat?.customer_id && (
          <MenuItem onClick={handleAgree}>
            <ListItemIcon>
              <FontAwesomeIcon icon={faHandshake} size="lg" color="#000" width={25} />
            </ListItemIcon>
            <ListItemText>{t('chats_content.agreed')}</ListItemText>
          </MenuItem>
        )}
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <FontAwesomeIcon icon={faCamera} size="lg" color="#000" width={25} />
          </ListItemIcon>
          <ListItemText>{t('chats_content.send_photo')}</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <FontAwesomeIcon icon={faLocationDot} size="lg" color="#000" width={25} />
          </ListItemIcon>
          <ListItemText>
            <span>{t('chats_content.meet_point')}</span>
          </ListItemText>
        </MenuItem>
      </Menu>
    </Fragment>
  );
}
