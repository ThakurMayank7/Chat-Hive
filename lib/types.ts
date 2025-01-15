export interface User {
  name: string;
  email: string;
  profilePicture: string;
  status: { state: "Online" | "Offline"; lastOnline: string };
  groups: string[];
  chats: string[];
  createdAt: string;
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
