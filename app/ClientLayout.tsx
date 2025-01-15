"use client";

import Login from "@/components/Login";
import Sidebar from "@/components/Sidebar";
import { ThreeDotsSpinner } from "@/components/Spinners";
import { useAuth } from "@/hooks/useAuth";
import React from "react";

function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { loading, user } = useAuth();

  if (!user && !loading) {
    return <Login />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <ThreeDotsSpinner />
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-row">
      <Sidebar />
      <div>{children}</div>
    </div>
  );
}

export default ClientLayout;
