"use client";

import Logo from "@/icons/Logo";
import React from "react";
import { Separator } from "./ui/separator";
import { FirebaseUser, UserData } from "@/lib/types";
import { ThreeDotsSpinner } from "./Spinners";

interface SidebarProps {
  syncState: boolean;
  userData: UserData | null;
  user: FirebaseUser;
  loading: boolean;
}

function Sidebar({ syncState, userData }: SidebarProps) {
  return (
    <div className="w-80 flex flex-col border-r-2">
      <div className="flex items-center justify-center h-16">
        <Logo />
      </div>
      <Separator />
      {userData?.name}
      {syncState && <ThreeDotsSpinner />}
    </div>
  );
}

export default Sidebar;
