import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { Fragment } from 'preact';
import { Modal } from '@mui/material';
import PolicyContent from '@/pages/terms/vvvv-privacy-policy/components/Policy';
import { ChevronLeftSolid } from '@/components/Icons/Icons';

export const PrivacyPolicyBtn = () => {
  const { t } = useTranslation();
  const [openPrivacyPolicy, setOpenPrivacyPolicy] = useState(false);

  function closeModal() {
    setOpenPrivacyPolicy(false);
  }

  return (
    <Fragment>
      <button className="underline" onClick={() => setOpenPrivacyPolicy(true)}>
        {t('footer.confidentiality')}
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
        open={openPrivacyPolicy}
        onClose={closeModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="bg-white p-2.75">
          <button onClick={closeModal} className="flex items-center">
            <ChevronLeftSolid />
            <div className="text-base leading-7 ml-0.5 text-primary-100">{t('backward')}</div>
          </button>
          <PolicyContent />
        </div>
      </Modal>
    </Fragment>
  );
};
