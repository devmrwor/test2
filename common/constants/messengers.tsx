import {
  FacebookIcon,
  InstagramIcon,
  TelegramIcon,
  TwitterIcon,
  WhatsAppIcon,
} from "@/components/Icons/Icons";
import { Messenger } from "../types/messenger";

export const messengers: Messenger[] = [
  { id: 1, name: "Telegram" },
  { id: 2, name: "WhatsApp" },
  { id: 3, name: "Facebook" },
  { id: 4, name: "Instagram" },
  { id: 5, name: "Twitter" },
];

export const messengersIcons: Record<string, any> = {
  Telegram: <TelegramIcon />,
  Instagram: <InstagramIcon />,
  WhatsApp: <WhatsAppIcon />,
  Twitter: <TwitterIcon />,
  Facebook: <FacebookIcon />,
};
