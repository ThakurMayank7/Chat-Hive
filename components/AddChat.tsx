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

function AddChat({ uid }: { uid: string }) {
  const [open, setOpen] = useState<boolean>(false);

  const [adding, setAdding] = useState<boolean>(false);

  const [field, setField] = useState<string>("");

  const handleAddNewChat = async () => {
    if (!field) return;

    setAdding(true);

    try {
      // Check if the user exists
      const result = await checkExistingUser(field);
      if (result === "not found" || result === "error") {
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
          className="hover:cursor-pointer"
          size={42}
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
              onChange={(e) => setField(e.target.value)}
              placeholder="Email or User ID"
            />
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
