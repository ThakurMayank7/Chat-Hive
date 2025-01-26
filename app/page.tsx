"use client";

import Login from "@/components/Login";
import Sidebar from "@/components/Sidebar";
import { ThreeDotsSpinner } from "@/components/Spinners";
import { db } from "@/firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";
import { ChatData, ChatMetadata, UserData } from "@/lib/types";
import { onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import Chat from "@/components/Chat";
import { getLatestMessage } from "@/lib/clientFunctions";

export default function Home() {
  const { loading, user } = useAuth();

  const [userData, setUserData] = useState<UserData>();

  const [syncing, setSyncing] = useState<boolean>(false);

  const [selectedChat, setSelectedChat] = useState<string | null>(null);

  const [initialized, setInitialized] = useState<boolean>(false);

  const [chatData, setChatData] = useState<ChatData[]>([]);

  useEffect(() => {
    if (user && !loading) {
      setSyncing(true);

      const unsubscribe = onSnapshot(
        doc(db, "users", user.uid),
        async (snapshot) => {
          try {
            if (!snapshot.exists()) {
              console.warn("No userData found for the user.");
              setSyncing(false);
              return;
            }

            const userDataSynced: UserData = snapshot.data() as UserData;
            setUserData(userDataSynced);

            console.log("Fetching information for chats", userDataSynced.chats);

            // Parallelize fetching chat data
            const chatPromises = userDataSynced.chats.map(async (chatId) => {
              // Skip if chat data for this chatId already exists
              if (chatData.some((chat) => chat.metadata.chatId === chatId)) {
                return null; // Skip this chat
              }

              // Fetch metadata for the chat
              const metadataSnapshot = await getDoc(
                doc(db, "chatMetaData", chatId)
              );
              if (!metadataSnapshot.exists()) {
                console.warn(`No metadata found for chatId: ${chatId}`);
                return null;
              }

              const metadata: ChatMetadata =
                metadataSnapshot.data() as ChatMetadata;

              // Fetch the latest message for the chat
              const latestMessage = await getLatestMessage(chatId);

              // Get the ID of the other participant in the chat
              const personId =
                metadata.participants.find(
                  (participant) => participant !== user.uid
                ) || null;

              if (!personId) {
                console.warn(`No participant found for chatId: ${chatId}`);
                return null;
              }

              // Check if personData is already in chatData
              const existingPersonData = chatData.find(
                (chat) => chat.personData.userId === personId
              )?.personData.data;

              // Fetch person data if not already available
              const personData =
                existingPersonData ||
                ((
                  await getDoc(doc(db, "users", personId))
                ).data() as UserData | null);

              if (!personData) {
                console.warn(`No userData found for personId: ${personId}`);
                return null;
              }

              // Return the new chat data
              return {
                metadata,
                latestMessage,
                personData: {
                  userId: personId,
                  data: personData,
                },
              } as ChatData;
            });

            // Resolve all chat promises and filter out nulls
            const newChats = (await Promise.all(chatPromises)).filter(
              (chat): chat is ChatData => chat !== null
            );

            // Update state with new chats
            setChatData((prevData) => [...prevData, ...newChats]);
          } catch (error) {
            console.error("Error fetching chat data:", error);
          } finally {
            setSyncing(false);
          }
        },
        (error) => {
          console.error("Error fetching user data:", error);
          setSyncing(false);
        }
      );

      // const syncUnsubscribe = onSnapshot(
      //   doc(db, "syncRequests", user.uid),
      //   async (snapshot) => {
      //     if (snapshot.exists() && initialized) {
      //       const data = snapshot.data();

      //       const request: string = data.update;

      //       try {
      //         const metadataSnapshot = await getDoc(
      //           doc(db, "chatMetaData", request)
      //         );

      //         if (metadataSnapshot.exists()) {
      //           const metadata = metadataSnapshot.data() as ChatMetadata;
      //           setChatsMetadata((prev) => {
      //             if (prev.some((chat) => chat.chatId === metadata?.chatId)) {
      //               return prev.map((chat) =>
      //                 chat.chatId === metadata?.chatId ? metadata : chat
      //               );
      //             } else {
      //               return [...prev, metadata as ChatMetadata];
      //             }
      //           });
      //         }
      //       } catch (e) {
      //         console.error(e);
      //       }
      //     } else if (!initialized) {
      //       setInitialized(true);
      //     } else {
      //       console.warn("No chatsMetadata found for the user.");
      //     }
      //     setSyncing(false);
      //   },
      //   (error) => {
      //     console.error("Error fetching chats metadata:", error);
      //     setSyncing(false);
      //   }
      // );

      return () => {
        unsubscribe();
        // syncUnsubscribe();
      };
    }
  }, [user, loading]);

  if (!user && !loading) {
    return <Login />;
  }

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <ThreeDotsSpinner />
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-row">
      <Sidebar
        chatData={chatData}
        selectedChat={selectedChat}
        selectChat={(chatId) => setSelectedChat(chatId)}
        syncState={syncing}
        userData={userData || null}
        user={{
          uid: user.uid || "",
          displayName: user.displayName || "",
          email: user.email || "",
          photoURL: user.photoURL || "",
        }}
        loading={loading}
      />
      <div className="flex items-center justify-center h-full w-full">
        {selectedChat ? (
          <Chat
            chatData={
              chatData.find((chat) => chat.metadata.chatId === selectedChat) ||
              null
            }
            userId={user.uid}
          />
        ) : (
          <span className="text-3xl text-gray-500">
            Select a chat to start messaging
          </span>
        )}
      </div>
    </div>
  );
}
