"use client";

import { ChatData, StoredMessage } from "@/lib/types";
import React, { useEffect, useRef, useState } from "react";
import ChatMessage from "./ChatMessage";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
} from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import MessageSender from "./MessageSender";
import { LoadingSpinner } from "./Spinners";

interface ChatProps {
  chatData: ChatData | null;
  userId: string;
  newMessage: StoredMessage | null;
}

function Chat({ chatData, userId, newMessage }: ChatProps) {
  const MESSAGES_PER_PAGE: number = 25;
  const SCROLL_THRESHOLD: number = 100;

  const [messages, setMessages] = useState<StoredMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [scrollDown, setScrollDown] = useState<boolean>(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const initialLoadingRef = useRef<boolean>(initialLoading);
  const lastMessageRef = useRef<unknown>(null);
  const [prevScrollHeight, setPrevScrollHeight] = useState<number>(0);

  // Add a debounce timeout ref
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // Add a ref to track if we're currently fetching
  const isFetchingRef = useRef<boolean>(false);

  useEffect(() => {
    initialLoadingRef.current = initialLoading;
  }, [initialLoading]);

  useEffect(() => {
    if (newMessage) {
      setMessages((prevMessages) => {
        const messageExists = prevMessages.some(
          (msg) => msg.messageId === newMessage.messageId
        );
        if (messageExists) return prevMessages;
        return [...prevMessages, newMessage];
      });
      setScrollDown(true);
    }
  }, [newMessage]);

  useEffect(() => {
    if (!chatData || !initialLoadingRef.current) return;

    const fetchInitialMessages = async () => {
      try {
        setLoading(true);

        const initialMessageQuery = query(
          collection(db, "chats", "private", chatData.metadata.chatId),
          orderBy("sendAt", "desc"),
          limit(MESSAGES_PER_PAGE)
        );

        const initialMessagesSnapshot = await getDocs(initialMessageQuery);

        if (!initialMessagesSnapshot.empty) {
          const fetchedMessages = initialMessagesSnapshot.docs.map((doc) => ({
            message: { ...doc.data() },
            messageId: doc.id,
          })) as StoredMessage[];

          setMessages(fetchedMessages.reverse());
          lastMessageRef.current = initialMessagesSnapshot.docs[0];
          setHasMore(initialMessagesSnapshot.docs.length === MESSAGES_PER_PAGE);
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error fetching initial messages:", error);
      } finally {
        setLoading(false);
        setInitialLoading(false);
        setScrollDown(true);
      }
    };

    fetchInitialMessages();
  }, [chatData]);

  const loadMoreMessages = async () => {
    if (!hasMore || loading || !chatData || isFetchingRef.current) return;

    try {
      isFetchingRef.current = true;
      setLoading(true);

      if (scrollRef.current) {
        setPrevScrollHeight(scrollRef.current.scrollHeight);
      }

      const nextMessagesQuery = query(
        collection(db, "chats", "private", chatData.metadata.chatId),
        orderBy("sendAt", "desc"),
        startAfter(lastMessageRef.current),
        limit(MESSAGES_PER_PAGE)
      );

      const nextMessagesSnapshot = await getDocs(nextMessagesQuery);

      if (!nextMessagesSnapshot.empty) {
        const fetchedMessages = nextMessagesSnapshot.docs.map((doc) => ({
          message: { ...doc.data() },
          messageId: doc.id,
        })) as StoredMessage[];

        setMessages((prevMessages) => {
          const existingMessageIds = new Set(
            prevMessages.map((msg) => msg.messageId)
          );
          const uniqueNewMessages = fetchedMessages.filter(
            (msg) => !existingMessageIds.has(msg.messageId)
          );
          return [...uniqueNewMessages.reverse(), ...prevMessages];
        });

        lastMessageRef.current = nextMessagesSnapshot.docs[0];
        setHasMore(nextMessagesSnapshot.docs.length === MESSAGES_PER_PAGE);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching more messages:", error);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  };

  const handleScroll = () => {
    if (!scrollRef.current || loading || !hasMore) return;

    const { scrollTop } = scrollRef.current;

    // Clear any existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Set a new timeout
    scrollTimeoutRef.current = setTimeout(() => {
      if (scrollTop < SCROLL_THRESHOLD && !isFetchingRef.current) {
        loadMoreMessages();
      }
    }, 150); // Debounce time of 150ms
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current && prevScrollHeight > 0) {
      scrollRef.current.scrollTop =
        scrollRef.current.scrollHeight - prevScrollHeight;
      setPrevScrollHeight(0);
    }
  }, [messages, prevScrollHeight]);

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
      <div className="p-4 border-b bg-gray-100">
        <Avatar className="border-2 border-black">
          <AvatarImage
            src={
              chatData.personData.data.profilePicture ||
              "https://github.com/shadcn.png"
            }
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
        onScroll={handleScroll}
        style={{ scrollBehavior: "smooth" }}
      >
        {loading && (
          <div className="flex justify-center py-2">
            <LoadingSpinner />
          </div>
        )}
        {messages.map((msg) => (
          <ChatMessage
            key={msg.messageId}
            userId={userId}
            message={msg.message}
          />
        ))}
      </div>

      <MessageSender
        personId={chatData.personData.userId}
        senderId={userId}
        chatId={chatData.metadata.chatId}
      />
    </div>
  );
}

export default Chat;
