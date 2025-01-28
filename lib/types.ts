import { Timestamp } from "firebase-admin/firestore";

export interface UserData {
  name: string;
  email: string;
  profilePicture: string;
  groups: string[];
  chats: string[];
  createdAt: Timestamp;
}

export interface ChatMetadata {
  chatId: string;
  createdAt: Timestamp;
  participants: string[];
  unseenMessages: {
    userId: string;
    unseenMessagesCount: number;
  }[];
}

export interface ChatData {
  metadata: ChatMetadata;
  latestMessage: Message;
  personData: {
    userId: string;
    data: UserData;
  };
}

export interface Message {
  type: "image" | "text";
  imageRef?: string;
  text?: string;
  sendAt: Timestamp;
  sender: string;
  seenBy: string[];
}

export interface FirebaseUser {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
}

export interface MessageUpdate {
  update: "new_message";
  chatId: string;
  message: Message;
}
