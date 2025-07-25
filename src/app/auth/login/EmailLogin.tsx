"use client";

import React, { useActionState, useEffect, useRef, useState } from "react";
import { emailLogin, signUp } from "./actions";
import { initialLoginState, initialSignupState } from "./types";

export default function EmailLogin() {
  const [isSignUp, setIsSignUp] = useState(false);

  const [signupState, signUpAction, isSignupPending] = useActionState(
    signUp,
    initialSignupState,
  );
  const [loginState, loginAction, isLoginPending] = useActionState(
    emailLogin,
    initialLoginState,
  );

  useEffect(() => {
    if (emailRef.current && signupState.inputs.email) {
      emailRef.current.value = signupState.inputs.email;
    }

    if (passwordRef.current && signupState.inputs.password) {
      passwordRef.current.value = signupState.inputs.password;
    }

    if (
      confirmPasswordRef.current &&
			signupState.inputs.password_confirmation
    ) {
      confirmPasswordRef.current.value =
				signupState.inputs.password_confirmation;
    }
  }, [signupState]);

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <h1 className="text-2xl font-bold">Let&apos;s get you started</h1>
      {signupState.isSuccessful && (
        <p className="isSuccess">Account created - you can now sign in</p>
      )}
      {signupState.errors.map((err) => {
        return (
          <p key={err.message} className="isError">
            {err.field} {err.message}
          </p>
        );
      })}
      {loginState.error && <p className="isError">{loginState.error}</p>}
      <form
        className="grid gap-4"
        action={isSignUp ? signUpAction : loginAction}
      >
        <input
          className="bg-gray-100 p-4 rounded-sm"
          type="text"
          placeholder="joe_bloggs@gmail.com"
          ref={emailRef}
          name="email"
          required
        />

        <input
          className="bg-gray-100 p-4 rounded-sm"
          type="password"
          placeholder="Password1!"
          ref={passwordRef}
          name="password"
          required
        />
        <input
          className={`bg-gray-100 p-4 rounded-sm ${isSignUp ? "" : "hidden"}`}
          type="password"
          placeholder="Password1!"
          ref={confirmPasswordRef}
          name="password_confirm"
        />

        <div className="w-full justify-around inline-flex gap-4">
          <button
            className="px-2 py-4 w-full bg-gray-200 rounded-md dark:text-black"
            type={isSignUp ? "submit" : "button"}
            onClick={(e) => {
              if (!isSignUp) {
                e.preventDefault();
                setIsSignUp(true);
              }
            }}
          >
            {isSignupPending ? "Signing up..." : "Sign up"}
          </button>
          <button
            className="px-2 py-4 w-full bg-violet-400 hover:bg-violet-500 rounded-md"
            type="submit"
          >
            {isLoginPending ? "Logging in..." : "Login"}
          </button>
        </div>
      </form>
    </>
  );
}
