import { Timestamp } from "firebase-admin/firestore";

export interface UserData {
  name: string;
  email: string;
  profilePicture: string;
  groups: string[];
  chats: string[];
  createdAt: Timestamp;
}

export interface ChatsMetadataPrivate {
  chatId: string;
  name: string;
  lastMessage: string;
  lastMessageAt: string;
  pfp:string;
  unseenMessages:number;
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