"use client";

import Login from "@/components/Login";
import Sidebar from "@/components/Sidebar";
import { ThreeDotsSpinner } from "@/components/Spinners";
import { db } from "@/firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";
import { ChatMetadataPrivate, UserData } from "@/lib/types";
import { onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import Chat from "@/components/Chat";

export default function Home() {
  const { loading, user } = useAuth();

  const [userData, setUserData] = useState<UserData>();

  const [syncing, setSyncing] = useState<boolean>(false);

  const [selectedChat, setSelectedChat] = useState<string | null>(null);

  const [chatsMetadata, setChatsMetadata] = useState<ChatMetadataPrivate[]>([]);

  const [initialized, setInitialized] = useState<boolean>(false);

  const [participantsDetails, setParticipantsDetails] = useState<
    { data: UserData; id: string }[]
  >([]);

  useEffect(() => {
    if (user && !loading) {
      setSyncing(true);

      const unsubscribe = onSnapshot(
        doc(db, "users", user.uid),
        async (snapshot) => {
          if (snapshot.exists()) {
            const userDataSynced: UserData = snapshot.data() as UserData;

            setUserData(userDataSynced);
            console.log("fetching metadata for chats", userDataSynced.chats);
            for (const chatId of userDataSynced.chats) {
              if (!chatsMetadata.some((chat) => chat.chatId === chatId)) {
                const metadataSnapshot = await getDoc(
                  doc(db, "chatMetaData", chatId)
                );

                if (metadataSnapshot.exists()) {
                  const metadata =
                    metadataSnapshot.data() as ChatMetadataPrivate;
                  console.log(metadata);
                  setChatsMetadata((prev) => {
                    if (prev.some((chat) => chat.chatId === metadata?.chatId)) {
                      return prev.map((chat) =>
                        chat.chatId === metadata?.chatId ? metadata : chat
                      );
                    } else {
                      return [...prev, metadata as ChatMetadataPrivate];
                    }
                  });
                }
              }
            }
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

      const syncUnsubscribe = onSnapshot(
        doc(db, "syncRequests", user.uid),
        async (snapshot) => {
          if (snapshot.exists() && initialized) {
            const data = snapshot.data();

            const request: string = data.update;

            try {
              const metadataSnapshot = await getDoc(
                doc(db, "chatMetaData", request)
              );

              if (metadataSnapshot.exists()) {
                const metadata = metadataSnapshot.data() as ChatMetadataPrivate;
                setChatsMetadata((prev) => {
                  if (prev.some((chat) => chat.chatId === metadata?.chatId)) {
                    return prev.map((chat) =>
                      chat.chatId === metadata?.chatId ? metadata : chat
                    );
                  } else {
                    return [...prev, metadata as ChatMetadataPrivate];
                  }
                });
              }
            } catch (e) {
              console.error(e);
            }
          } else if (!initialized) {
            setInitialized(true);
          } else {
            console.warn("No chatsMetadata found for the user.");
          }
          setSyncing(false);
        },
        (error) => {
          console.error("Error fetching chats metadata:", error);
          setSyncing(false);
        }
      );

      return () => {
        unsubscribe();
        syncUnsubscribe();
      };
    }
  }, [user, loading]);

  useEffect(() => {
    if (chatsMetadata && chatsMetadata.length > 0 && user && !loading) {
      const sync = async () => {
        for (const mData of chatsMetadata) {
          for (const participant of mData.participants) {
            if (
              !participantsDetails.some((p) => p.id === participant) &&
              participant !== user.uid
            ) {
              const snapshot = await getDoc(doc(db, "users", participant));
              if (snapshot.exists()) {
                const data = snapshot.data() as UserData;
                setParticipantsDetails((prev) => [
                  ...prev,
                  { data: data, id: participant },
                ]);
              }
            }
          }
        }
      };
      sync();
    }
  }, [chatsMetadata]);

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
        participantsDetails={participantsDetails}
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
      <div className="flex-1 h-full w-full">
        {selectedChat ? (
          <Chat
            chatMetaData={
              chatsMetadata.find((chat) => chat.chatId === selectedChat) || null
            }
          />
        ) : (
          <div className="flex items-center justify-center h-full w-full">
            <span className="text-3xl text-gray-500">
              Select a chat to start messaging
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
