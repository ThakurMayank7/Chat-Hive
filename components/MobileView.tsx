"use client";

import Logo from "@/icons/Logo";
import { ChatData, FirebaseUser, StoredMessage, UserData } from "@/lib/types";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Search from "./Search";
import { Separator } from "./ui/separator";
import ChatPreview from "./ChatPreview";
import { ThreeDotsSpinner } from "./Spinners";
import { ScrollArea } from "./ui/scroll-area";
import Chat from "./Chat";
import AddChat from "./AddChat";

interface MobileViewProps {
  syncState: boolean;
  userData: UserData | null;
  user: FirebaseUser;
  loading: boolean;
  selectChat: (chatId: string | null) => void;
  selectedChat: string | null;
  chatData: ChatData[];
  newMessage: StoredMessage | null;
  sentMessageUpdate: (messageSent: StoredMessage) => void;
  closeChat: VoidFunction;
}

function MobileView({
  chatData,
  syncState,
  userData,
  user,
  selectChat,
  selectedChat,
  newMessage,
  sentMessageUpdate,
  closeChat,
}: MobileViewProps) {
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [searching, setSearching] = useState<boolean>(false);

  return (
    <div className="h-full w-full flex flex-col">
      {selectedChat ? (
        <div className="h-full w-full">
          <Chat
            closeChat={() => closeChat()}
            selectedChat={selectedChat}
            sentMessageUpdate={(sent) => sentMessageUpdate(sent)}
            newMessage={newMessage}
            chatData={
              chatData.find((chat) => chat.metadata.chatId === selectedChat) ||
              null
            }
            userId={user.uid}
          />
        </div>
      ) : (
        <>
          {/* Top Section (Fixed Height) */}
          <div className="h-fit w-full">
            <div className="flex flex-row items-center px-2 pt-2">
              <div className="h-16 hover:cursor-pointer">
                <Logo />
              </div>
              <div className="ml-auto">
                <Avatar className="border-2 border-black">
                  <AvatarImage
                    src={`${
                      user.photoURL
                        ? user.photoURL
                        : "https://github.com/shadcn.png"
                    }`}
                  />
                  <AvatarFallback>
                    {user.displayName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
            {!selectedChat && (
              <Search
                chatData={chatData}
                userId={user.uid}
                setSearching={(searching: boolean) => setSearching(searching)}
                setSearchResults={(queryResults: string[]) =>
                  setSearchResults(queryResults)
                }
              />
            )}
            <Separator />
          </div>
          <ScrollArea className="flex-1">
            {syncState && <ThreeDotsSpinner />}

            {!syncState &&
              userData &&
              !searching &&
              userData.chats.map((chat: string) => {
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
            {searchResults &&
              searchResults.length > 0 &&
              searching &&
              searchResults
                .filter((result) => userData?.chats.includes(result))
                .map((chat: string) => {
                  return (
                    <ChatPreview
                      chatData={
                        chatData.find(
                          (data) => data.metadata.chatId === chat
                        ) || null
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
        </>
      )}
      <div className="absolute flex h-screen w-screen">
        <div className="mt-auto mr-auto mb-6 ml-6">
          <AddChat uid={user.uid} chatData={chatData} userData={userData} />
        </div>
      </div>
    </div>
  );
}

export default MobileView;
