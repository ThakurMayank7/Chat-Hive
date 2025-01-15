"use server";

import { adminDb } from "@/firebase/admin";
import { UserData } from "@/lib/types";
import { Timestamp } from "firebase-admin/firestore";
import { User } from "firebase/auth";

export async function signInHandler(user: User) {
    console.log("signing in user: " + user.uid);
  try {
    const userSnapshot = await adminDb.collection("users").doc(user.uid).get();
    if (
      !userSnapshot.exists &&
      user.displayName &&
      user.email &&
      user.photoURL
    ) {
      const detailedUser: UserData = {
        name: user.displayName,
        email: user.email,
        profilePicture: user.photoURL,
        status: { state: "Offline", lastOnline: Timestamp.now() },
        groups: [],
        chats: [],
        createdAt: Timestamp.now(),
      };
      adminDb.collection("users").doc(user.uid).set(detailedUser);
    }
  } catch (e) {
    console.error(e);
  }
}
