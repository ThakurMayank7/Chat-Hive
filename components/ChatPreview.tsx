import { ChatPreviewDetailsPrivate } from "@/lib/types";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { BsThreeDots } from "react-icons/bs";

function ChatPreview({
  chatPreview,
  selectedChat,
  clicked,
}: {
  chatPreview: ChatPreviewDetailsPrivate;
  selectedChat: string | null;
  clicked: (chatId: string) => void;
}) {
  const test: ChatPreviewDetailsPrivate = {
    chatId: "123",
    name: "Mayank Singh",
    lastMessage: "Hello, This is Mayank. Student at Amity Noida",
    lastMessageAt: "26/06/2008",
    pfp: "https://github.com/shadcn.png",
    unseenMessages: 6,
  };

  return (
    <div
      className={`border-b-2 hover:cursor-pointer ${
        selectedChat === test.chatId ? "bg-gray-200" : "bg-gray-100"
      }`}
      onClick={() => clicked(test.chatId)}
    >
      <div className="flex items-center p-2 space-x-2">
        <Avatar className="border-2 border-black">
          <AvatarImage src={test.pfp.trim()} />
          <AvatarFallback>
            {test.name?.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex justify-between items-center">
            <span className="font-medium">{test.name}</span>
            <div className="flex items-center space-x-2">
              {test.unseenMessages > 0 && (
                <span className="bg-green-500 text-white text-xs rounded-full px-2 py-0.5">
                  {test.unseenMessages}
                </span>
              )}
              <BsThreeDots className="text-gray-500" />
            </div>
          </div>

          <div className="flex justify-between text-xs text-gray-500">
            <span className="truncate max-w-[200px]">{test.lastMessage}</span>
            <span>{test.lastMessageAt}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatPreview;
