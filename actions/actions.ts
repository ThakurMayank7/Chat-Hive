"use server";

import { adminDb } from "@/firebase/admin";
import { FirebaseUser, UserData } from "@/lib/types";
import { FieldValue, Timestamp } from "firebase-admin/firestore";

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

export async function checkExistingUser(query: string): Promise<string> {
  try {
    const docRef = adminDb.collection("users").doc(query);
    const docSnapshot = await docRef.get();

    if (docSnapshot.exists) {
      return docSnapshot.id;
    }

    const querySnapshot = await adminDb
      .collection("users")
      .where("email", "==", query)
      .get();

    if (!querySnapshot.empty) {
      const matchingDoc = querySnapshot.docs[0];
      return matchingDoc.id;
    }

    return "not found";
  } catch (e) {
    console.error(e);
    return "error";
  }
}

export async function addNewChat(
  chats: string[],
  uid: string
): Promise<boolean> {
  if (!chats) {
    console.error("chats not provided");
    return false;
  }
  try {
    await adminDb
      .collection("users")
      .doc(uid)
      .set(
        {
          chats: FieldValue.arrayUnion(chats),
        },
        { merge: true }
      );

    return true;
  } catch (error) {
    console.error("Could'nt add new chat", error);
    return false;
  }
}
