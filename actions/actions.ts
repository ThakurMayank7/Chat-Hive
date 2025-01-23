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
async function getParticipantDetails(
  participant: string
): Promise<FirebaseUser | null> {
  try {
    const docSnapshot = await adminDb
      .collection("users")
      .doc(participant)
      .get();

    if (docSnapshot.exists) {
      // Use type assertion to specify the type of the document data
      return docSnapshot.data() as FirebaseUser;
    } else {
      console.warn(`Document with ID ${participant} does not exist.`);
      return null;
    }
  } catch (error) {
    console.error("Error fetching user document:", error);
    return null;
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
    // Deduplicate participants to avoid redundant processing
    const uniqueParticipants = Array.from(new Set(participants));

    // Generate search keys for all participants
    const searchKeys: string[] = [];
    await Promise.all(
      uniqueParticipants.map(async (participant) => {
        const participantDetails: FirebaseUser | null =
          await getParticipantDetails(participant);

        if (participantDetails) {
          searchKeys.push(
            ...generateSearchKeys(participantDetails.displayName)
          );
          searchKeys.push(...generateSearchKeys(participantDetails.email));
          searchKeys.push(participantDetails.uid); // Add UID directly
        }
      })
    );

    // Create chat in Firestore
    const chatRef = adminDb.collection("chats").doc();
    await chatRef.set({
      type: type,
      participants: uniqueParticipants,
      createdAt: Timestamp.now(),
      searchKeys: Array.from(new Set(searchKeys)), // Deduplicate search keys
    } as ChatCreationDetails);

    // Update each participant's chats array
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

    return true;
  } catch (error) {
    console.error("Couldn't add new chat", error);
    return false;
  }
}

export async function searchQuery(query: string): Promise<string[]> {
  try {
    const querySnapshot = await adminDb
      .collection("chats")
      .where("searchKeys", "array-contains", query.toLowerCase)
      .get();

    const results: string[] = [];
    querySnapshot.forEach((doc) => {
      // all related chats are added here
      results.push(doc.id);
    });

    return results;
  } catch (error) {
    console.error(error);
    return [];
  }
}

function generateSearchKeys(parameter: string | undefined | null): string[] {
  if (!parameter) {
    console.warn("generateSearchKeys received an invalid parameter:", parameter);
    return [];
  }

  const keys: string[] = [];
  const lowercaseParameter = parameter.toLowerCase();

  for (let i = 0; i < lowercaseParameter.length; i++) {
    for (let j = i + 1; j <= lowercaseParameter.length; j++) {
      keys.push(lowercaseParameter.substring(i, j));
    }
  }

  return keys;
}

// Result for "John":
// ["j", "jo", "joh", "john", "o", "oh", "ohn", "h", "hn", "n"]
