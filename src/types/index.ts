export interface UserAvatar {
  src: string;
}

export interface User {
  id: string;
  name: string;
  avatar: UserAvatar;
}

export interface Users {
  [key: string]: User;
}

export interface Message {
  id: string;
  text: string;
  timestamp: string;
  status: string;
  userId: string;
}

export type AddMessage = (message: Message) => void;
