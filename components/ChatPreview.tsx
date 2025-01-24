import { ChatMetadataPrivate, FirebaseUser, UserData } from "@/lib/types";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { BsThreeDots } from "react-icons/bs";
import { ThreeDotsSpinner } from "./Spinners";

function ChatPreview({
  metadata,
  selectedChat,
  clicked,
  participantDetails,
}: {
  metadata: ChatMetadataPrivate;
  selectedChat: string | null;
  clicked: (chatId: string) => void;
  user: FirebaseUser;
  participantDetails: { data: UserData; id: string };
}) {
  return (
    <div
      className={`border-b-2 hover:cursor-pointer ${
        selectedChat === metadata?.chatId ? "bg-gray-200" : "bg-gray-100"
      }`}
      onClick={() => clicked(metadata.chatId)}
    >
      {participantDetails ? (
        <div className="flex items-center p-2 space-x-2">
          <Avatar className="border-2 border-black">
            <AvatarImage src={participantDetails.data.profilePicture.trim()} />
            <AvatarFallback>
              {participantDetails.data.name?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex justify-between items-center">
              <span className="font-medium">
                {participantDetails.data.name}
              </span>
              <div className="flex items-center space-x-2">
                {metadata.unseenMessages > 0 && (
                  <span className="bg-green-500 text-white text-xs rounded-full px-2 py-0.5">
                    {metadata.unseenMessages}
                  </span>
                )}
                <BsThreeDots className="text-gray-500" />
              </div>
            </div>

            <div className="flex justify-between text-xs text-gray-500">
              <span className="truncate max-w-[200px]">
                {metadata.lastMessage}
              </span>
              <span>{metadata.lastMessageAt.toDate().toISOString()}</span>
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
