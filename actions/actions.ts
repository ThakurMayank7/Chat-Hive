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
): Promise<UserData | null> {
  try {
    const docSnapshot = await adminDb
      .collection("users")
      .doc(participant)
      .get();

    if (docSnapshot.exists) {
      // Use type assertion to specify the type of the document data
      return docSnapshot.data() as UserData;
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
    const uniqueParticipants = Array.from(new Set(participants));
    const searchKeys: string[] = [];

    await Promise.all(
      uniqueParticipants.map(async (participant) => {
        try {
          const participantDetails = await getParticipantDetails(participant);

          if (participantDetails) {
            console.log("Processing participant:", participantDetails);

            if (participantDetails.name) {
              searchKeys.push(...generateSearchKeys(participantDetails.name));
            }
            if (participantDetails.email) {
              searchKeys.push(...generateSearchKeys(participantDetails.email));
            }
            searchKeys.push(participant);
          } else {
            console.warn(`No details found for participant: ${participant}`);
          }
        } catch (error) {
          console.error(`Error processing participant: ${participant}`, error);
        }
      })
    );

    const chatRef = adminDb.collection("chatMetaData").doc();
    console.log("Creating chat with ID:", chatRef.id);

    await chatRef.set({
      type: type,
      participants: uniqueParticipants,
      createdAt: Timestamp.now(),
    });

    await adminDb
      .collection("searchKeys")
      .doc(chatRef.id)
      .set({
        keys: Array.from(new Set(searchKeys)),
      });

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

function generateSearchKeys(parameter: string | undefined | null): string[] {
  if (!parameter) {
    console.warn(
      "generateSearchKeys received an invalid parameter:",
      parameter
    );
    return [];
  }

  const keys: string[] = [];
  const lowercaseParameter = parameter.toLowerCase().split(" ").join("");

  for (let i = 0; i < lowercaseParameter.length; i++) {
    for (let j = i + 1; j <= lowercaseParameter.length; j++) {
      keys.push(lowercaseParameter.substring(i, j));
    }
  }

  return keys;
}

// Result for "John":
// ["j", "jo", "joh", "john", "o", "oh", "ohn", "h", "hn", "n"]

export async function searchQuery(query: string): Promise<string[]> {
  try {
    const querySnapshot = await adminDb
      .collection("searchKeys")
      .where("keys", "array-contains", query.toLowerCase().split(" ").join(""))
      .get();

    return querySnapshot.docs.map((doc) => doc.id);
  } catch (error) {
    console.error("Search query error:", error);
    return [];
  }
}
