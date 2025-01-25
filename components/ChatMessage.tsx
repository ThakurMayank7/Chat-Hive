import { Message } from "@/lib/types";
import React from "react";

interface ChatMessageProps {
  userId: string;
  message: Message;
}

function ChatMessage({ userId, message }: ChatMessageProps) {
  if (message.type === "text") {
    return (
      <div
        className={`flex items-start gap-3 mb-4 ${
          userId === message.sender ? "justify-end" : "justify-start"
        }`}
      >
        {/* Message Container */}
        <div
          className={`
            max-w-[75%] px-4 py-2 rounded-lg 
            ${
              userId === message.sender
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-black"
            }
          `}
        >
          <p className="break-words">{message.text}</p>

          <div
            className={`
                text-xs mt-1 
                ${userId === message.sender ? "text-blue-100" : "text-gray-500"}
              `}
          >
            {message.sendAt.toDate().toLocaleTimeString()}
          </div>
        </div>
      </div>
    );
  }

  if (message.type === "image") {
    return null;
  }

  return null;
}

export default ChatMessage;
