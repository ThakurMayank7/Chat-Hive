import Logo from "@/icons/Logo";
import React from "react";
import { Separator } from "./ui/separator";

function Sidebar() {
  return (
    <div className="w-80 flex flex-col border-r-2">
      <div className="flex items-center justify-center h-16">
        <Logo />
      </div>
      <Separator />
    </div>
  );
}

export default Sidebar;
