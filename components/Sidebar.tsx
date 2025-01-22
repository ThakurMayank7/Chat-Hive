"use client";

import Logo from "@/icons/Logo";
import React from "react";
import { Separator } from "./ui/separator";
import { ChatPreviewDetails, FirebaseUser, UserData } from "@/lib/types";
import { ThreeDotsSpinner } from "./Spinners";
import ChatPreview from "./ChatPreview";

interface SidebarProps {
  syncState: boolean;
  userData: UserData | null;
  user: FirebaseUser;
  loading: boolean;
}

function Sidebar({ syncState, userData }: SidebarProps) {
  return (
    <div className="w-80 flex flex-col border-r-2">
      <div className="flex items-center justify-center h-16">
        <Logo />
      </div>
      <Separator />
      {userData?.name}
      {syncState && <ThreeDotsSpinner />}
      {!syncState &&
        userData &&
        userData.chats.map((chat: string) => {
          return (
            <ChatPreview
              chatPreview={
                {
                  chatId: chat,
                  name: "",
                  lastMessage: "",
                  lastMessageAt: "",
                  type: "private",
                } as ChatPreviewDetails
              }
              key={chat}
            />
          );
        })}
    </div>
  );
}

export default Sidebar;
