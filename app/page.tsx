"use client";

import Login from "@/components/Login";
import Sidebar from "@/components/Sidebar";
import { ThreeDotsSpinner } from "@/components/Spinners";
import { db } from "@/firebase/firebaseConfig";
import { doc } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";
import { ChatsMetadataPrivate, UserData } from "@/lib/types";
import { onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";

export default function Home() {
  const { loading, user } = useAuth();

  const [userData, setUserData] = useState<UserData>();

  const [syncing, setSyncing] = useState<boolean>(false);

  const [selectedChat, setSelectedChat] = useState<string | null>(null);

  const [chatsMetadata, setChatsMetadata] = useState<ChatsMetadataPrivate[]>(
    []
  );

  const [activeListeners, setActiveListeners] = useState<Set<string>>(
    new Set()
  );
  const [chatListeners, setChatListeners] = useState<{
    [key: string]: () => void;
  }>({});

  useEffect(() => {
    if (user && !loading) {
      setSyncing(true);

      const unsubscribe = onSnapshot(
        doc(db, "users", user.uid),
        async (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data();

            setUserData(data as UserData);
          } else {
            console.warn("No userData found for the user.");
          }
          setSyncing(false);
        },
        (error) => {
          console.error("Error fetching user data:", error);
          setSyncing(false);
        }
      );
      return () => unsubscribe();
    }
  }, [user, loading]);

  useEffect(() => {
    if (!userData?.chats) return;

    const currentChatIds = new Set(userData.chats);
    const currentListeners = new Set(activeListeners);

    // Remove listeners for chats no longer in userData
    Object.keys(chatListeners).forEach((chatId) => {
      if (!currentChatIds.has(chatId)) {
        chatListeners[chatId]();
        delete chatListeners[chatId];
        currentListeners.delete(chatId);
      }
    });

    // Add listeners for new chats
    userData.chats.forEach((chatId) => {
      if (!currentListeners.has(chatId)) {
        const unsubscribe = onSnapshot(
          doc(db, "chatsMetadata", chatId),
          (snapshot) => {
            const data = snapshot.data();
            if (data) {
              const metadata: ChatsMetadataPrivate = {
                chatId,
                name: data.name ?? "",
                lastMessage: data.lastMessage ?? "",
                lastMessageAt: data.lastMessageAt ?? "",
                pfp: data.pfp ?? "",
                unseenMessages: data.unseenMessages ?? 0,
              };

              setChatsMetadata((prev) => {
                const chatIndex = prev.findIndex(
                  (chat) => chat.chatId === chatId
                );

                if (chatIndex === -1) {
                  return [...prev, metadata];
                }

                const updatedChats = [...prev];
                updatedChats[chatIndex] = {
                  ...updatedChats[chatIndex],
                  ...metadata,
                };

                return updatedChats;
              });
            }
          },
          (error) => {
            console.error(`Error in chat ${chatId} listener:`, error);
          }
        );

        setChatListeners((prev) => ({
          ...prev,
          [chatId]: unsubscribe,
        }));
        currentListeners.add(chatId);
      }
    });

    setActiveListeners(currentListeners);

    return () => {
      Object.values(chatListeners).forEach((unsub) => unsub());
    };
  }, [userData?.chats]);

  if (!user && !loading) {
    return <Login />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <ThreeDotsSpinner />
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-row">
      <Sidebar
        chatsMetadata={chatsMetadata}
        selectedChat={selectedChat}
        selectChat={(chatId) => setSelectedChat(chatId)}
        syncState={syncing}
        userData={userData || null}
        user={{
          uid: user?.uid || "",
          displayName: user?.displayName || "",
          email: user?.email || "",
          photoURL: user?.photoURL || "",
        }}
        loading={loading}
      />
      <div>
        {selectedChat}

        {chatsMetadata.map((chat) => {
          return (
            <div key={chat.chatId}>
              <h1>{chat.name}</h1>
              <p>{chat.lastMessage}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
