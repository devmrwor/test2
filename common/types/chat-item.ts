import { SenderType } from '../enums/messages';

export interface ChatMessage {
  id: number;
  chat_id: number;
  type: SenderType;
  sender_id: number;
  text: string;
  seen: boolean;
  show_to: number | null;
  created_at: Date;
  updated_at: Date;
}
