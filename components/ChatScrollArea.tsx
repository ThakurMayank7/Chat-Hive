import React from "react";
import { ScrollArea } from "./ui/scroll-area";

function ChatScrollArea({ children }: { children: React.ReactNode }) {
  return (
    <ScrollArea className="h-full w-full">
      <div className="flex flex-col-reverse space-y-reverse space-y-4 p-4">
        {children}
      </div>
    </ScrollArea>
  );
}

export default ChatScrollArea;
