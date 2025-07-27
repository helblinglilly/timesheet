"use client";

import type { PocketbaseAuthMethods } from "~/pocketbase/builtin.types";
import { setCookieClient } from "~/utils/cookies";

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
