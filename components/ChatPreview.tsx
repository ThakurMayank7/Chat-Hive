import { ChatPreviewDetails } from "@/lib/types";
import React from "react";

function ChatPreview({ chatPreview }: { chatPreview: ChatPreviewDetails }) {
  return <div>{chatPreview.name}</div>;
}

export default ChatPreview;
