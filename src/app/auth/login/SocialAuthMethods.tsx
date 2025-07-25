"use server";
import type { PocketbaseAuthMethods } from "@/lib/pocketbase.types";
import { log } from "@/utils/log";
import { headers } from "next/headers";
import React from "react";
import OAuthMethod from "./OAuthMethods";

export default async function SocialAuthMethods() {
  const res = await fetch(
    `${process.env.POCKETBASE_URL}/api/collections/users/auth-methods`,
  ).catch(async (err) => {
    await log({ message: err, isError: true });
    throw err;
  });

  if (!res.ok) {
    await log({
      message: "Non-200 status code when fetching auth methods",
      status: res.status,
    });
    throw res.status;
  }

  const body = await res.json();
  const authMethods = body.authProviders as Array<PocketbaseAuthMethods>;

  const headersList = await headers();

  const mappedAuthMethods = authMethods.map((method) => {
    return {
      ...method,
      authUrl: `${method.authUrl}${headersList.get("x-forwarded-proto")}://${headersList.get("host")}/auth/redirect`,
    };
  });
  return (
    <>
      {mappedAuthMethods.map((authMethod) => {
        return <OAuthMethod authMethod={authMethod} key={authMethod.name} />;
      })}
    </>
  );
}
