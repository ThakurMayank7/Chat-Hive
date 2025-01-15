"use client";

import Logo from "@/icons/Logo";
import React, { useEffect, useState } from "react";
import { Separator } from "./ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { UserData } from "@/lib/types";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";

function Sidebar() {
  const { user, loading } = useAuth();

  const [userData, setUserData] = useState<UserData>();

  const [syncing, setSyncing] = useState<boolean>(false);

  useEffect(() => {
    if (user && !loading) {
      setSyncing(true);

      const unsubscribe = onSnapshot(
        doc(db, "users", user.uid),
        async (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data();

            setUserData(data as UserData);
          } else {
            console.warn("No userData found for the user.");
          }
          setSyncing(false);
        },
        (error) => {
          console.error("Error fetching user data:", error);
          setSyncing(false);
        }
      );
      return () => unsubscribe();
    }
  }, [user, loading]);

  return (
    <div className="w-80 flex flex-col border-r-2">
      <div className="flex items-center justify-center h-16">
        <Logo />
      </div>
      {syncing?"true":"false"}
      {userData?userData.name:""}
      <Separator />
    </div>
  );
}

export default Sidebar;
