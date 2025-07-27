"use server";

import { cookies } from "next/headers";
import Pocketbase from "pocketbase";
import { env } from "~/env";
import { authDataToCookie } from "~/pocketbase/auth";
import type { PBAuthResponse } from "~/pocketbase/builtin.types";
import log from "~/utils/log";

export async function handleOAuthRedirect(formData: FormData) {
  const state = formData.get("state") as string | null;
  const code = formData.get("code") as string | null;

  const cookieStore = await cookies();

  try {
    if (!state) throw new Error("No state in query params");
    if (!code) throw new Error("No code in query params");

    const provider = JSON.parse(cookieStore.get("auth_provider")?.value?.toString() ?? "{}") as {
      name: string;
      codeVerifier: string;
    };

    if (!provider.name || !provider.codeVerifier) {
      throw new Error("Auth provider cookie is no longer present - we don't know where you came from!");
    }

    const pb = new Pocketbase(env.POCKETBASE_URL);

    const authData = (await pb
      .collection("users")
      .authWithOAuth2Code(
        provider.name,
        code,
        provider.codeVerifier,
        `${env.NEXT_PUBLIC_HOST}/auth/redirect`
      )) as PBAuthResponse;

    if (authData.meta?.isNew) {
      try {
        await pb.collection("users").update(authData.record.id, {
          name: authData.meta.name,
        });
      } catch (err) {
        log.error("Failed to set username after OAuth login", err);
      }
    }

    const expires = new Date();
    expires.setDate(expires.getDate() + 30);

    cookieStore.set(
      "pb_auth",
      JSON.stringify(authDataToCookie(authData)),
      {
        sameSite: "lax",
        path: "/",
        expires,
      }
    );

    cookieStore.delete("auth_provider");

    return { success: true, message: "Success!" };
  } catch (err) {
    log.error("OAuth error", err);
    return { success: false, message: "Authentication failed. Please try again" };
  }
}
