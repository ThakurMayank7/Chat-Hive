"use client";

import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { Message } from "./types";
import { db } from "@/firebase/firebaseConfig";

export async function getLatestMessage(
  chatId: string
): Promise<Message | null> {
  try {
    const messagesCollection = collection(db, "chats", "private", chatId);

    // Create a query to fetch the latest message
    const messagesQuery = query(
      messagesCollection,
      orderBy("sendAt", "desc"),
      limit(1)
    );

    // Execute the query
    const querySnapshot = await getDocs(messagesQuery);

    // Return the latest message data if available
    if (!querySnapshot.empty) {
      const latestMessage = querySnapshot.docs[0].data() as Message;
      return latestMessage;
    }

    console.log("No messages found for chatId:", chatId);
    return null;
  } catch (error) {
    console.error("Error retrieving the latest message:", error);
    throw error;
  }
}
