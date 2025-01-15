import { Timestamp } from "firebase-admin/firestore";

export interface UserData {
  name: string;
  email: string;
  profilePicture: string;
  status: { state: "Online" | "Offline"; lastOnline: Timestamp };
  groups: string[];
  chats: string[];
  createdAt: Timestamp;
}

export interface ChatPreview {
  chatId: string;
  name?: string; //if this is a group chat
  lastMessage: string;
  lastMessageAt: string;
  type: "group" | "private";
}

export interface Message {
  type: "image" | "text";
  imageRef?: string;
  text?: string;
}
