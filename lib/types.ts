import { Timestamp } from "firebase-admin/firestore";

export interface UserData {
  name: string;
  email: string;
  profilePicture: string;
  groups: string[];
  chats: string[];
  createdAt: Timestamp;
}

export interface ChatMetadataPrivate {
  chatId: string;
  lastMessage: string;
  lastMessageAt: Timestamp;
  unseenMessages: number;
  participants: string[];
}

export interface Message {
  type: "image" | "text";
  imageRef?: string;
  text?: string;
  sendAt: Timestamp;
}

export interface FirebaseUser {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
}
