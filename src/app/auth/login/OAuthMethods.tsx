"use client";
import type { PocketbaseAuthMethods } from "@/lib/pocketbase.types";
import { setCookieClient } from "@/utils/cookies";
import React from "react";

export default function OAuthMethod({
  authMethod,
}: { authMethod: PocketbaseAuthMethods }) {
  return (
    <button
      key={authMethod.name}
      className={`w-full h-14 p-4 text-center ${authMethod.name}`}
      type="button"
      onClick={() => {
        setCookieClient("auth_provider", JSON.stringify(authMethod));
        window.location.assign(authMethod.authUrl);
      }}
    >
      {authMethod.displayName}
    </button>
  );
}
