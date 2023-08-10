import { ChatMessage } from './chat-item';
import { IUser } from './user';

export interface Chat {
  id: number;
  messages: ChatMessage[];
  executor_id: number;
  customer_id: number;
  order_id: number;
  executor: IUser;
  customer: IUser;
  created_at: Date;
  updated_at: Date;
}

export interface ClientChat extends Omit<Chat, 'messages'> {
  messages: Record<string, ChatMessage[]>;
}
