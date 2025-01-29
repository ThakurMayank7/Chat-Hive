"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { ThreeDotsSpinner } from "./Spinners";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { addNewPrivateChat, checkExistingUser } from "@/actions/actions";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircle } from "lucide-react";
import { ChatData, UserData } from "@/lib/types";

function AddChat({
  uid,
  chatData,
  userData,
}: {
  uid: string;
  chatData: ChatData[];
  userData: UserData | null;
}) {
  const [open, setOpen] = useState<boolean>(false);

  const [adding, setAdding] = useState<boolean>(false);

  const [field, setField] = useState<string>("");

  const [alert, setAlert] = useState<boolean>(false);

  const [alertMessage, setAlertMessage] = useState<string>("");

  const handleAddNewChat = async () => {
    if (!field) {
      setAlertMessage("Enter Something First!");
      setAlert(true);
      return;
    }

    if (!userData) {
      setAlertMessage(
        "Please Try Again!\nIf issue persists, reload this Page!"
      );
      setAlert(true);
      return;
    }

    if (userData.email === field || uid === field) {
      setAlertMessage(
        "This is your email or userId!\nKindly Enter a different userId or email!"
      );
      setAlert(true);
      return;
    }

    //checking if chat with that user already exists
    if (
      chatData.filter(
        (data) =>
          data.personData.userId === field ||
          data.personData.data.email === field
      ).length !== 0
    ) {
      setAlertMessage("A Chat with this person already exists!");
      setAlert(true);
      return;
    }
    setAdding(true);

    try {
      // Check if the user exists
      const result = await checkExistingUser(field);
      if (result === "not found" || result === "error") {
        setAlertMessage("This User Does Not Exist");
        setAlert(true);
        toast(
          <span className="text-red-500">
            User not found or an error occurred!
          </span>
        );
        return;
      }
      console.log(result);
      // Add a new chat
      const chatAdded = await addNewPrivateChat({
        participants: [uid, result],
        type: "private",
      });

      if (chatAdded) {
        toast(<span className="text-green-500">New Chat Added!</span>);
        setField("");
      } else {
        toast(
          <span className="text-red-500">
            Some Error Occurred while adding new Chat!
          </span>
        );
      }
    } catch (error) {
      console.error("Error while adding new chat:", error);
      toast(<span className="text-red-500">Unexpected error occurred!</span>);
    } finally {
      setAdding(false);
    }
  };

  return (
    <Dialog
      modal={false}
      open={open}
      onOpenChange={(isOpen) => setOpen(isOpen)}
    >
      <DialogTrigger asChild onClick={() => setOpen(true)}>
        <AiOutlinePlusCircle
          className="hover:cursor-pointer h-16 w-16 sm:h-12 sm:w-12"
          color="teal"
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg w-full bg-white p-6 rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle>Add New Chat</DialogTitle>
          {!adding && (
            <DialogDescription>
              Enter the Email or User ID of your friend:
            </DialogDescription>
          )}
        </DialogHeader>
        {adding ? (
          <div className="flex w-full h-full items-center justify-center">
            <ThreeDotsSpinner />
          </div>
        ) : (
          <>
            <input
              className="p-2 border-2"
              type="text"
              value={field}
              onChange={(e) => {
                setField(e.target.value);
                if (alert) {
                  setAlert(false);
                  setAlertMessage("");
                }
              }}
              placeholder="Email or User ID"
            />
            {alert && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{alertMessage}</AlertDescription>
              </Alert>
            )}
            <button
              className="bg-gray-900 hover:bg-gray-700 text-lg hover:font-semibold rounded text-white"
              type="submit"
              onClick={() => handleAddNewChat()}
            >
              Add
            </button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default AddChat;
