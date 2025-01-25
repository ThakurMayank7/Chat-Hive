import { sendTextMessage } from "@/actions/actions";
import React, { useState } from "react";

function MessageSender({
  chatId,
  senderId,
}: {
  chatId: string;
  senderId: string;
}) {
  const [messageText, setMessageText] = useState<string>("");

  const [sending, setSending] = useState(false);

  const handleMessageSender = async () => {
    setSending(true);
    try {
      const result = await sendTextMessage({
        chatId,
        messageText,
        senderId,
      });

      if (result) {
        console.log("Message sent successfully");
        setMessageText("");
      } else {
        console.log("Message sending failed");
      }
    } catch (error) {
      console.error("Error while sending message:", error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-4 border-t bg-gray-100 flex items-center gap-2">
      <input
        placeholder="Type your message..."
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
        className="flex-1 p-1 text-sm rounded"
      />
      <button
        onClick={() => handleMessageSender()}
        className="bg-green-500 text-white py-2 px-6 rounded"
      >
        Send
      </button>
    </div>
  );
}

export default MessageSender;
