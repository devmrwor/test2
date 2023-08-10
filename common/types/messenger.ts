export interface Messenger {
  id: number;
  name: string;
  show_others?: boolean;
}

export interface MessengerItem {
  messenger: Messenger;
  nicknameOrNumber: string;
  profileId?: number;
}
