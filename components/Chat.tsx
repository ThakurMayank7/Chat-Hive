import { ChatMetadataPrivate, Message } from "@/lib/types";
import React from "react";
import ChatMessage from "./ChatMessage";
import { Timestamp } from "firebase/firestore";

interface ChatProps {
  chatMetaData: ChatMetadataPrivate | null;
  userId:string;  
}

function Chat({ chatMetaData,userId }: ChatProps) {
  if (!chatMetaData) {
    return null;
  }

  return <div>{chatMetaData.chatId}
  <ChatMessage userId={userId} message={
    {
      type:"text",
      text:"Hello",
      sendAt:Timestamp.now(),
      sender:userId,
    }as Message
  }/>
  <ChatMessage userId={userId} message={
    {
      type:"text",
      text:"Hello, I am Mayank Singh. I study in Amity University, Noida. I am a 1st year student.ChatMessage userId={userId} message=ChatMessage userId={userId} message=ChatMessage userId={userId} message=ChatMessage userId={userId} message=ChatMessage userId={userId} message= ",
      sendAt:Timestamp.now(),
      sender:userId,
    }as Message
  }/>
  <ChatMessage userId={userId} message={
    {
      type:"text",
      text:"Hello, I am Mayank Singh. I study in Amity University, Noida. I am a 1st year student.ChatMessage userId={userId} message=ChatMessage userId={userId} message=ChatMessage userId={userId} message=ChatMessage userId={userId} message=ChatMessage userId={userId} message=",
      sendAt:Timestamp.now(),
      sender:"as",
    }as Message
  }/>
  </div>;
}

export default Chat;
