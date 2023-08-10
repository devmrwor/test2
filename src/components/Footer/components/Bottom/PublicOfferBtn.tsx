import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { Fragment } from 'preact';
import { Modal } from '@mui/material';
import { ChevronLeftSolid } from '@/components/Icons/Icons';
import PublicOfferContent from '@/pages/terms/publicOffer/PublicOffer';

export const PublicOfferBtn = () => {
  const { t } = useTranslation();
  const [openPublicOffer, setOpenPublicOffer] = useState(false);

  function closeModal() {
    setOpenPublicOffer(false);
  }

  return (
    <Fragment>
      <button className="underline" onClick={() => setOpenPublicOffer(true)}>
        {t('footer.public_offer')}
      </button>
      <Modal
        sx={{
          position: 'fixed',
          overflow: 'scroll',
          // top: '-16px',
          // bottom: '-25px',
          height: '100vh',
          display: 'block',
          backgroundColor: 'white',
        }}
        open={openPublicOffer}
        onClose={closeModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="bg-white p-2.75">
          <button onClick={closeModal} className="flex items-center">
            <ChevronLeftSolid />
            <div className="text-base leading-7 ml-0.5 text-primary-100">{t('backward')}</div>
          </button>
          <PublicOfferContent />
        </div>
      </Modal>
    </Fragment>
  );
};
