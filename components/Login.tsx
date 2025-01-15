"use client";

import { signInWithGoogle } from "@/firebase/auth";
import GoogleIcon from "@/icons/GoogleLogo";
import Logo from "@/icons/Logo";
import React from "react";

function Login() {
  const handleSignIn = () => {
    signInWithGoogle();
  };

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
            onClick={handleSignIn}
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
