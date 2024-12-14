"use server";

import type { PBAuthResponse } from "@/lib/pocketbase.types";
import { cookies } from "next/headers";
import Pocketbase from "pocketbase";

export async function serverSideAuth() {
	const pb = new Pocketbase(process.env.POCKETBASE_URL);

	const allCookies = await cookies();
	const pbCookie = allCookies.get("pb_auth");

	if (pbCookie) {
		const data = JSON.parse(pbCookie.value) as PBAuthResponse;
		pb.authStore.save(data.token, data.record || data.meta);
	}

	return pb;
}
