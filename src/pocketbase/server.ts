"use server";

import { cookies } from "next/headers";
import Pocketbase from "pocketbase";
import { env } from "~/env";
import type { PBAuthResponse } from "./builtin.types";

export async function serverSideAuth() {
  const pb = new Pocketbase(env.POCKETBASE_URL);

  const allCookies = await cookies();
  const pbCookie = allCookies.get("pb_auth");

  if (pbCookie) {
    const data = JSON.parse(pbCookie.value) as PBAuthResponse;
    pb.authStore.save(data.token, data.record || data.meta);
  }

  return pb;
}
