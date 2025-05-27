import { User as FirebaseUser } from "firebase/auth";

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

export interface Reaction {
  emoji: string;
  userId: string;
}

export interface MessageReactions {
  [key: string]: Reaction[];
}

export interface Message {
  id: string;
  text: string;
  timestamp: string;
  status: string;
  userId: string;
  reactions?: MessageReactions;
}

export interface ResolvedMessage extends Message {
  __user: User | null;
  __isFirstOfTheDay: boolean;
}

export type CreateUser = (user: FirebaseUser, name: string, avatarSrc: string) => Promise<User>;

export type AddMessage = (message: ResolvedMessage) => void;

export type Login = (name: string, avatarSrc: string) => void;

export type Logout = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;

export type SetUser = React.Dispatch<React.SetStateAction<User | null>>

export type FindUserById = (userId: string) => Promise<User | null>;

export type FindOrInsertUser = (user: FirebaseUser) => Promise<User>;

export type ToggleReaction = (messageId: string, emoji: string) => void;