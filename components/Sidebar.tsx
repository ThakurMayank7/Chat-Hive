"use client";

import Logo from "@/icons/Logo";
import React, { useState } from "react";
import { Separator } from "./ui/separator";
import { ChatData, FirebaseUser, UserData } from "@/lib/types";
import { ThreeDotsSpinner } from "./Spinners";
import ChatPreview from "./ChatPreview";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AddChat from "./AddChat";
import Search from "./Search";
import { HiDotsVertical } from "react-icons/hi";

interface SidebarProps {
  syncState: boolean;
  userData: UserData | null;
  user: FirebaseUser;
  loading: boolean;
  selectChat: (chatId: string | null) => void;
  selectedChat: string | null;
  chatData: ChatData[];
}

function Sidebar({
  chatData,
  syncState,
  userData,
  user,
  selectChat,
  selectedChat,
}: SidebarProps) {
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [searching, setSearching] = useState<boolean>(false);

  return (
    <div className="w-80 flex flex-col border-r-2 h-full">
      <ScrollArea className="h-full w-full">
        <div className="sticky top-0 z-10 flex flex-col py-2">
          <div
            className="flex items-center justify-center h-16 hover:cursor-pointer"
            onClick={() => selectChat(null)}
          >
            <Logo />
          </div>
          <Separator />
          <div className="flex flex-row p-2 items-center">
            <HiDotsVertical size={30} />
            <Avatar className="border-2 border-black">
              <AvatarImage
                src={`${
                  user.photoURL
                    ? user.photoURL
                    : "https://github.com/shadcn.png"
                }
                `}
              />
              <AvatarFallback>
                {user.displayName?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-center justify-center ml-2">
              <span className="text-md font-serif">{user.displayName}</span>
            </div>
            <div className="ml-auto">
              <AddChat uid={user.uid} chatData={chatData} userData={userData} />
            </div>
          </div>
          <Separator />
          <Search
            chatData={chatData}
            userId={user.uid}
            setSearching={(searching: boolean) => setSearching(searching)}
            setSearchResults={(queryResults: string[]) =>
              setSearchResults(queryResults)
            }
          />
        </div>
        {syncState && <ThreeDotsSpinner />}

        {!syncState &&
          userData &&
          !searching &&
          userData.chats.map((chat: string) => {
            return (
              <ChatPreview
                chatData={
                  chatData.find((data) => data.metadata.chatId === chat) || null
                }
                selectedChat={selectedChat}
                clicked={(chatId) => selectChat(chatId)}
                user={user}
                key={chat}
              />
            );
          })}
        {searchResults &&
          searchResults.length > 0 &&
          searching &&
          searchResults
            .filter((result) => userData?.chats.includes(result))
            .map((chat: string) => {
              return (
                <ChatPreview
                  chatData={
                    chatData.find((data) => data.metadata.chatId === chat) ||
                    null
                  }
                  selectedChat={selectedChat}
                  clicked={(chatId) => selectChat(chatId)}
                  user={user}
                  key={chat}
                />
              );
            })}
        {searching && searchResults.length === 0 && (
          <p>No Search Results Found</p>
        )}
      </ScrollArea>
    </div>
  );
}

export default Sidebar;
