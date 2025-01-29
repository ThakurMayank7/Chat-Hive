import { Message } from "@/lib/types";
import { Timestamp } from "firebase/firestore";
import Image from "next/image";
import React from "react";
import { IoCheckmarkOutline, IoCheckmarkDoneSharp } from "react-icons/io5";

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
        <div
          className={`max-w-[75%] px-4 py-2.5 rounded-2xl shadow-sm ${
            userId === message.sender
              ? "bg-blue-600 text-white rounded-tr-sm"
              : "bg-gray-100 text-gray-800 rounded-tl-sm"
          }`}
        >
          <p className="break-words text-sm leading-relaxed">{message.text}</p>

          <div
            className={`flex items-center gap-2 w-full text-xs mt-1.5 ${
              userId === message.sender
                ? "text-blue-200 text-right"
                : "text-gray-500 text-left"
            }`}
          >
            {message.sender !== userId && (
              <div className="flex items-center">
                {message.seenBy.find((id) => id === userId) ? (
                  <IoCheckmarkDoneSharp className="text-gray-600" size={16} />
                ) : (
                  <IoCheckmarkOutline className="text-gray-400" size={14} />
                )}
              </div>
            )}

            <span
              className={`${
                userId === message.sender ? "ml-auto" : "mr-auto"
              } opacity-75`}
            >
              {message.sendAt instanceof Timestamp
                ? message.sendAt.toDate().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (message.type === "image") {
    return (
      <div
        className={`flex items-start gap-3 mb-4 ${
          userId === message.sender ? "justify-end" : "justify-start"
        }`}
      >
        {/* Image Container */}
        <div
          className={`max-w-[75%] px-4 py-2 rounded-lg ${
            userId === message.sender
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-black"
          }`}
        >
          {/* Message Image */}
          {message.imageRef && (
            <Image
              src={message.imageRef}
              alt="Message Attachment"
              className="rounded-md mb-2 max-w-full h-auto"
            />
          )}

          {/* Timestamp and Seen Status */}
          <div
            className={`flex w-full text-xs mt-1 ${
              userId === message.sender
                ? "text-blue-100 text-right"
                : "text-gray-500 text-left"
            }`}
          >
            {/* Checkmark Icon */}
            {message.seenBy.find((id) => id === userId) ? (
              <IoCheckmarkDoneSharp color="black" size={48} />
            ) : (
              <IoCheckmarkOutline color="black" />
            )}

            {/* Timestamp */}
            <span className={userId === message.sender ? "ml-auto" : "mr-auto"}>
              {message.sendAt && message.sendAt instanceof Timestamp
                ? message.sendAt.toDate().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "N/A"}{" "}
              {/* Fallback to "N/A" if sendAt is missing or not a valid Timestamp */}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default ChatMessage;
