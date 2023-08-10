import { BackHeader } from '../primitives/BackHeader/BackHeader';
import { useTranslation } from 'next-i18next';
import { socialMedia } from '../../../common/constants/social-media';
import { ChevronLeft } from '../Icons/Icons';
import { useClientContext } from '@/contexts/clientContext';

export const SocialMedia = () => {
	const { t } = useTranslation();
	const { setShowSocialMedia } = useClientContext();

	const handleBack = () => {
		setShowSocialMedia(false);
	};

	return (
		<>
			<BackHeader heading='social_media' onClick={handleBack} />
			{/* <p>{t('link_social_media')}</p> */}
			<p className='max-w-[267px] mt-2.25 text-text-secondary'>
				Привяжите соцсети, чтобы быстрее заходить с других устройств.
			</p>
			<div className='mt-7.5'>
				{socialMedia.map((item) => (
					<div className='flex mb-7.5 justify-between'>
						<div className='flex items-center'>
							{item.icon}
							<div className='ml-[12.62px]'>{item.name}</div>
						</div>
						<button className='flex items-center'>
							<p className='mr-3 text-primary-100'>{t('connect')}</p>
							<div className='rotate-180 text-text-secondary'>
								<ChevronLeft fill='currentColor' />
							</div>
						</button>
					</div>
				))}
			</div>
		</>
	);
};
