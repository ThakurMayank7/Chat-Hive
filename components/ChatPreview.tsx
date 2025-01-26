import { ChatData, FirebaseUser } from "@/lib/types";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { BsThreeDots } from "react-icons/bs";
import { ThreeDotsSpinner } from "./Spinners";

function ChatPreview({
  chatData,
  selectedChat,
  clicked,
  user,
}: {
  selectedChat: string | null;
  clicked: (chatId: string) => void;
  chatData: ChatData | null;
  user: FirebaseUser;
}) {
  if (!chatData) {
    return null;
  }

  return (
    <div
      className={`border-b-2 hover:cursor-pointer ${
        selectedChat === chatData.metadata.chatId
          ? "bg-gray-200"
          : "bg-gray-100"
      }`}
      onClick={() => clicked(chatData.metadata.chatId)}
    >
      {chatData.personData ? (
        <div className="flex items-center p-2 space-x-2">
          <Avatar className="border-2 border-black">
            <AvatarImage src={chatData.personData.data.profilePicture.trim()} />
            <AvatarFallback>
              {chatData.personData.data.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex justify-between items-center">
              <span className="font-medium">
                {chatData.personData.data.name}
              </span>
              <div className="flex items-center space-x-2">
                {chatData.metadata.unseenMessages.find(
                  (msg) => msg.userId === chatData.personData.userId
                )?.unseenMessagesCount ||
                  (0 > 0 && (
                    <span className="bg-green-500 text-white text-xs rounded-full px-2 py-0.5">
                      {
                        chatData.metadata.unseenMessages.find(
                          (msg) => msg.userId === chatData.personData.userId
                        )?.unseenMessagesCount
                      }
                    </span>
                  ))}
                <BsThreeDots className="text-gray-500" />
              </div>
            </div>

            <div className="flex justify-between text-xs text-gray-500">
              <span className="truncate max-w-[200px]">
                {chatData.latestMessage.text}
              </span>
              <span>
                {chatData.latestMessage.sendAt.toDate().toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <ThreeDotsSpinner />
        </div>
      )}
    </div>
  );
}

export default ChatPreview;
