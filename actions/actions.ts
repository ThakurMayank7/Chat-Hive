"use server";

import { adminDb } from "@/firebase/admin";
import { FirebaseUser, UserData } from "@/lib/types";
import { Timestamp } from "firebase-admin/firestore";

export async function testing() {
  console.log("testing");

  try {
    await adminDb.collection("users").doc("test").set({
      name: "test",
      email: "test@test.com",
      profilePicture: "test",
      status: "test",
      groups: [],
      chats: [],
    });
  } catch (e) {
    console.error(e);
  }
}

export async function createUser(user: FirebaseUser) {
  console.log("creating user in database: " + user.uid);
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
