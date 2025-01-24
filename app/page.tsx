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

  const [selectedChat,setSelectedChat] = useState<string | null>(null);

  const [chatsMetadata, setChatsMetadata] = useState<ChatsMetadataPrivate[]>([]);

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

},[userData?.chats])

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
      <div>{selectedChat}</div>
    </div>
  );
}
