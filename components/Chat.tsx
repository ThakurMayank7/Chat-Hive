import { ChatMetadataPrivate } from "@/lib/types";
import React from "react";

interface ChatProps {
  chatMetaData: ChatMetadataPrivate | null;
}

function Chat({ chatMetaData }: ChatProps) {
  if (!chatMetaData) {
    return null;
  }

  return <div>{chatMetaData.chatId}</div>;
}

export default Chat;
