"use client";

import { createUser, testing } from "@/actions/actions";
import { signInWithGoogle } from "@/firebase/auth";
import GoogleIcon from "@/icons/GoogleLogo";
import Logo from "@/icons/Logo";
import { FirebaseUser } from "@/lib/types";
import React, { useState } from "react";

function Login() {
  const handleSignIn = async () => {
    console.log("signing in started");
    setSigning(true);
    await signInWithGoogle().then(async (user) => {
      console.log("creating user in database");
      await createUser({
        uid: user.uid,
        displayName: user.displayName || "",
        email: user.email || "",
        photoURL: user.photoURL || "",
      } as FirebaseUser);
      testing();
      setSigning(false);
    });
  };

  const [signing, setSigning] = useState<boolean>(false);

  if (signing) {
    return (
      <div className="h-screen w-screen">
        <h1>Signing In in process...</h1>
        <p>
          If it does not work{" "}
          <button
            className="bg-gray-300 rounded p-1"
            onClick={() => setSigning(false)}
          >
            Try Again
          </button>
        </p>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="border-2 border-black rounded p-8 bg-gray-100">
        <Logo />
        <h1 className="font-serif text-center text-lg">Welcome to Task Hive</h1>
        <br />
        <div className="flex flex-col items-center">
          <h2 className="text-sm">Sign In With Google to continue :</h2>
          <br />
          <button
            className="w-fit border border-black rounded-full hover:bg-gray-200 bg-white"
            onClick={() => handleSignIn()}
          >
            <div className="flex flex-row items-center justify-center gap-4 mx-4 my-1">
              <GoogleIcon />
              <span>Sign In</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
