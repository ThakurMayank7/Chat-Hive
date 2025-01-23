import { ChatPreviewDetails } from "@/lib/types";
import React from "react";

function ChatPreview({ chatPreview }: { chatPreview: ChatPreviewDetails }) {
  return <div>{chatPreview.chatId}</div>;
}

export default ChatPreview;
