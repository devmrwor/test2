export type EmailTypes = {
  id: number;
  value: string;
};

export type PhoneTypes = {
  id: number;
  value: string;
};

export type MessengerTypes = {
  messenger: {
    id: number;
    name: string;
  };
  nicknameOrNumber: string;
};
