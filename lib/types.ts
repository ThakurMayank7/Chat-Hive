import { Timestamp } from "firebase-admin/firestore";

export interface UserData {
  name: string;
  email: string;
  profilePicture: string;
  groups: string[];
  chats: string[];
  createdAt: Timestamp;
}

export interface ChatPreviewDetails {
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
  sendAt: Timestamp;
}

export interface FirebaseUser {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
}

export interface ChatCreationDetails {
  participants: string[];
  type:"private"|"group";
  createdAt:Timestamp;
  searchKeys:string[];
}