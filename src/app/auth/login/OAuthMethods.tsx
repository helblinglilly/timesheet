"use client";

import Image from "next/image";
import { Button } from "~/components/ui/button";
import type { PocketbaseAuthMethods } from "~/pocketbase/builtin.types";
import { setCookieClient } from "~/utils/cookies";
import GoogleIcon from './google.svg';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconMap: Record<PocketbaseAuthMethods['name'], any> = {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  google: GoogleIcon
}

export default function OAuthMethod({
  authMethod,
}: { authMethod: PocketbaseAuthMethods }) {
  return (
    <Button
      key={authMethod.name}
      variant={'outline'}
      type="button"
      onClick={() => {
        setCookieClient("auth_provider", JSON.stringify(authMethod));
        window.location.assign(authMethod.authUrl);
      }}
    >
      <Image
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        src={iconMap[authMethod.name]}
        alt=""
        height={24}
        width={24}

      />
      {authMethod.displayName}
    </Button>
  );
}
