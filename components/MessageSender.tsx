import { sendTextMessage } from "@/actions/actions";
import React, { useState } from "react";
import { LoadingSpinner } from "./Spinners";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MdAttachFile } from "react-icons/md";
import { IoMdImages } from "react-icons/io";
import { StoredMessage } from "@/lib/types";

function MessageSender({
  chatId,
  senderId,
  personId,

  newMessage,
}: {
  chatId: string;
  senderId: string;
  personId: string;

  newMessage: (messageSent: StoredMessage) => void;
}) {
  const [messageText, setMessageText] = useState<string>("");

  const [sending, setSending] = useState(false);

  const handleMessageSender = async () => {
    if (messageText === "") {
      return;
    }
    setSending(true);
    try {
      const result = await sendTextMessage({
        chatId,
        messageText,
        senderId,
        personId,
      });

      if (result.success) {
        // Handle success, and you can access the storedMessage
        // console.log("Message sent:", result.storedMessage);
        if (result.storedMessage) {
          newMessage(result.storedMessage);
        }
        setMessageText("");
      } else {
        // Handle failure
        console.log("Failed to send message");
      }
    } catch (error) {
      console.error("Error while sending message:", error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-4 border-t bg-gray-100 flex items-center gap-2">
      <Popover>
        <PopoverTrigger>
          <MdAttachFile
            size={36}
            className="mx-1 bg-gray-200 rounded-full p-2"
          />
        </PopoverTrigger>
        <PopoverContent className="w-auto h-auto p-2">
          <IoMdImages className="hover:cursor-pointer" size={100} />
          <p>This feature is not available right now</p>
        </PopoverContent>
      </Popover>
      <input
        placeholder="Type your message..."
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
        className="flex-1 p-1 text-sm rounded"
      />
      <button
        disabled={sending}
        onClick={() => handleMessageSender()}
        className="bg-green-500 text-white py-2 px-6 rounded"
      >
        {sending ? <LoadingSpinner /> : "Send"}
      </button>
    </div>
  );
}

export default MessageSender;
