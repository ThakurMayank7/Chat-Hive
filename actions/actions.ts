"use server";

import { adminDb } from "@/firebase/admin";
import {
  ChatMetadata,
  FirebaseUser,
  Message,
  StoredMessage,
  UserData,
} from "@/lib/types";
import { FieldValue, Timestamp } from "firebase-admin/firestore";

export async function createUser(user: FirebaseUser) {
  console.log("Creating user in database: " + user.uid);
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
        groups: [],
        chats: [],
        createdAt: Timestamp.now(),
      };

      // Wait for the document to be set
      await adminDb.collection("users").doc(user.uid).set(detailedUser);
      console.log("User created successfully in database:", user.uid);
    } else {
      console.log("User already exists or missing required data:", user.uid);
    }
  } catch (e) {
    console.error("Error creating user:", e);
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

export async function addNewPrivateChat({
  participants,
}: {
  type: string;
  participants: string[];
}): Promise<boolean> {
  if (!participants || participants.length === 0) {
    console.error("Chat type or participants not provided");
    return false;
  }

  try {
    const uniqueParticipants = Array.from(new Set(participants));

    const chatRef = adminDb.collection("chatMetaData").doc();
    console.log("Creating chat with ID:", chatRef.id);

    const chatMetadata: ChatMetadata = {
      createdAt: Timestamp.now(),

      chatId: chatRef.id,
      participants: uniqueParticipants,
      unseenMessages: uniqueParticipants.map((participant) => ({
        userId: participant,
        unseenMessagesCount: 0,
      })),
    };

    await chatRef.set(chatMetadata);

    await Promise.all(
      uniqueParticipants.map((participant) =>
        adminDb
          .collection("users")
          .doc(participant)
          .set(
            {
              chats: FieldValue.arrayUnion(chatRef.id),
            },
            { merge: true }
          )
      )
    );

    console.log("Chat successfully created with ID:", chatRef.id);
    return true;
  } catch (error) {
    console.error("Couldn't add new chat:", error);
    return false;
  }
}

export async function sendTextMessage({
  chatId,
  messageText,
  senderId,
  personId,
}: {
  personId: string;
  senderId: string;
  chatId: string;
  messageText: string;
}): Promise<{ success: boolean; storedMessage?: StoredMessage }> {
  try {
    // Create the message object
    const message: Message = {
      type: "text",
      sender: senderId,
      text: messageText,
      sendAt: Timestamp.now(),
      seenBy: [], // Adjust as necessary
    };

    // Add the message to Firestore and get the document reference
    const messageRef = await adminDb
      .collection("chats")
      .doc("private")
      .collection(chatId)
      .add(message);

    // Create the StoredMessage object with Firestore document ID
    const storedMessage: StoredMessage = {
      message: {
        ...message,
        sendAt:
          message.sendAt instanceof Timestamp
            ? message.sendAt.toDate()
            : new Date(),
      }, // Spread the original message fields
      messageId: messageRef.id, // Add the document ID
    };

    // Send the stored message update request
    await sendNewMessageUpdateRequest(personId, storedMessage, chatId);

    // Return success status and the stored message
    return { success: true, storedMessage };
  } catch (e) {
    console.error("Error sending message:", e);

    // Return failure status with no stored message
    return { success: false };
  }
}

export async function sendNewMessageUpdateRequest(
  uid: string,
  message: StoredMessage,
  chatId: string
) {
  try {
    await adminDb.collection("updateRequests").doc(uid).set({
      update: "new_message",
      chatId,
      message,
    });
  } catch (error) {
    console.error("Error sending message update request:", error);
  }
}
