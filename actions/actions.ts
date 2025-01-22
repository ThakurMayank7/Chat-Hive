"use server";

import { adminDb } from "@/firebase/admin";
import { ChatCreationDetails, FirebaseUser, UserData } from "@/lib/types";
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

export async function addNewChat({
  type,
  participants,
}: {
  type: string;
  participants: string[];
}): Promise<boolean> {
  if (!type || !participants || participants.length === 0) {
    console.error("Chat type or participants not provided");
    return false;
  }

  try {
    const chatRef = adminDb.collection("chats").doc();
    await chatRef.set({
      type: type,
      participants: participants,
      createdAt: Timestamp.now(),
    } as ChatCreationDetails);

    for (const participant of participants) {
      await adminDb
        .collection("users")
        .doc(participant)
        .set(
          {
            chats: FieldValue.arrayUnion(chatRef.id),
          },
          { merge: true }
        );
    }

    return true;
  } catch (error) {
    console.error("Couldn't add new chat", error);
    return false;
  }
}
