import {
	TwitterIcon,
	FacebookIcon,
	GoogleIcon,
	TelegramIcon,
	WhatsAppIcon,
	InstagramIcon,
} from '@/components/Icons/Icons';
const iconColor = '#949494';

export const socialMedia = [
	{ name: 'Twitter', icon: <TwitterIcon fill={iconColor} width={27} height={27} /> },
	{ name: 'Facebook', icon: <FacebookIcon fill={iconColor} width={27} height={27} /> },
	{ name: 'Google', icon: <GoogleIcon fill={iconColor} /> },
	{ name: 'Telegram', icon: <TelegramIcon fill={iconColor} width={30} height={30} /> },
	{ name: 'WhatsApp', icon: <WhatsAppIcon fill={iconColor} width={28} height={28} /> },
	{ name: 'Instagram', icon: <InstagramIcon fill={iconColor} width={30} height={30} /> },
];
