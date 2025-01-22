"use client";

import Logo from "@/icons/Logo";
import React from "react";
import { Separator } from "./ui/separator";
import { ChatPreviewDetails, FirebaseUser, UserData } from "@/lib/types";
import { ThreeDotsSpinner } from "./Spinners";
import ChatPreview from "./ChatPreview";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AddChat from "./AddChat";

interface SidebarProps {
  syncState: boolean;
  userData: UserData | null;
  user: FirebaseUser;
  loading: boolean;
}

function Sidebar({ syncState, userData, user }: SidebarProps) {
  return (
    <div className="w-80 flex flex-col border-r-2">
      <ScrollArea className="h-full w-full">
        <div className="sticky top-0 z-10 flex flex-col py-2">
          <div className="flex items-center justify-center h-16">
            <Logo />
          </div>

          <Separator />
          <div className="flex flex-row p-2">
            <Avatar className="border-2 border-black">
              <AvatarImage
                src={`${
                  user.photoURL
                    ? user.photoURL
                    : "https://github.com/shadcn.png"
                }
                `}
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-center justify-center ml-2">
              <span className="text-md font-serif">{user.displayName}</span>
            </div>
            <div className="ml-auto">
              <AddChat chats={userData?.chats===undefined?[]:userData.chats}
              uid={user.uid}
              />
            </div>
          </div>
          <Separator />
        </div>
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
      </ScrollArea>
    </div>
  );
}

export default Sidebar;
