"use client";

import { ChatData, StoredMessage } from "@/lib/types";
import React, { useEffect, useRef, useState } from "react";
import ChatMessage from "./ChatMessage";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import MessageSender from "./MessageSender";
import { LoadingSpinner } from "./Spinners";

interface ChatProps {
  chatData: ChatData | null;
  userId: string;
  newMessage: StoredMessage | null;
}

function Chat({ chatData, userId, newMessage }: ChatProps) {
  const MAX_STORED_MESSAGES: number = 10000;

  const MAX_MESSAGES: number = 100;

  const [storedMessages, setStoredMessages] = useState<StoredMessage[]>([]);

  const [messages, setMessages] = useState<StoredMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [initialLoading, setInitialLoading] = useState<boolean>(true);

  const initialLoadingRef = useRef<boolean>(initialLoading);

  const [scrollDown, setScrollDown] = useState<boolean>(false);

  useEffect(() => {
    initialLoadingRef.current = initialLoading;
  }, [initialLoading]);

  useEffect(() => {
    console.log("called");
    if (newMessage) {
      console.log("New message received:", newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setScrollDown(true);
    }
  }, [newMessage]);

  useEffect(() => {
    if (!chatData || !initialLoadingRef.current) {
      return;
    }

    const fetchInitialMessages = async () => {
      try {
        const initialMessageQuery = query(
          collection(db, "chats", "private", chatData.metadata.chatId),
          orderBy("sendAt", "desc"),
          limit(MAX_MESSAGES)
        );

        const initialMessagesSnapshot = await getDocs(initialMessageQuery);

        if (!initialMessagesSnapshot.empty) {
          const fetchedMessages = initialMessagesSnapshot.docs.map((doc) => ({
            message: {
              ...doc.data(),
            },
            messageId: doc.id,
          })) as StoredMessage[];

          console.log(fetchedMessages);
          setMessages(fetchedMessages.reverse());
          setStoredMessages(fetchedMessages.reverse());
        }
      } catch (error) {
        console.error("Error fetching initial messages:", error);
      } finally {
        setInitialLoading(false);
        setScrollDown(true);
      }
    };

    fetchInitialMessages();
  }, [chatData, setMessages, setInitialLoading]);

  useEffect(() => {
    if (scrollDown && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      setScrollDown(false);
    }
  }, [scrollDown]);

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
      {initialLoading && <LoadingSpinner />}

      <div
        className="flex-1 p-4 overflow-y-auto"
        ref={scrollRef}
        style={{ scrollBehavior: "smooth" }}
      >
        {messages.map((msg, index) => (
          <ChatMessage key={index} userId={userId} message={msg.message} />
        ))}
      </div>

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
