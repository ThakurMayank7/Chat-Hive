"use client";

import { ChatData, Message } from "@/lib/types";
import React, { useEffect } from "react";
import ChatMessage from "./ChatMessage";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import MessageSender from "./MessageSender";

interface ChatProps {
  chatData: ChatData | null;
  userId: string;
  newMessage: Message | null;
}

function Chat({ chatData, userId, newMessage }: ChatProps) {
  const [messages, setMessages] = React.useState<Message[]>([]);

  useEffect(() => {
    if (!chatData?.metadata) {
      return;
    }

    if (chatData.metadata) {
      // Reference to the 'messages' subcollection of a specific chat
      const messagesRef = collection(
        db,
        "chats",
        "private",
        chatData.metadata.chatId
      );

      // Optional: Query messages ordered by timestamp (or you can query by other fields)
      const q = query(messagesRef, orderBy("sendAt", "asc")); // Or use any custom query here

      // Get the documents
      const fetchMessages = async () => {
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const messagesData: Message[] = snapshot.docs.map(
            (doc) => doc.data() as Message
          );
          setMessages(messagesData); // Set the retrieved messages
        } else {
          console.log("No messages found.");
        }
      };

      fetchMessages();
    }
  }, []);

  useEffect(() => {
    console.log('called');
    if (newMessage) {
      console.log("New message received:", newMessage);
      // Use functional update to ensure the latest state is used
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    }
  }, [newMessage]);

  if (!chatData) {
    return <span>Some error occurred</span>;
  }

  return (
    <div className="flex flex-col h-full w-full bg-white border rounded-md">
      {/* Header */}
      <div className="p-4 border-b bg-gray-100">
        <Avatar className="border-2 border-black">
          <AvatarImage
            src={`${
              chatData.personData.data.profilePicture
                ? chatData.personData.data.profilePicture
                : "https://github.com/shadcn.png"
            }
                `}
          />
          <AvatarFallback>
            {chatData.personData.data.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <ChatMessage key={index} userId={userId} message={msg} />
        ))}
      </ScrollArea>

      {/* Input Area */}
      <MessageSender
        personId={chatData.personData.userId}
        senderId={userId}
        chatId={chatData.metadata.chatId}
      />
    </div>
  );
}

export default Chat;
