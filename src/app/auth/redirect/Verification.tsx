"use server";

import type { PocketbaseAuthMethods } from "@/lib/pocketbase.types";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import Pocketbase from "pocketbase";
import React from "react";

export default async function Validation({
	searchParams,
}: {
	searchParams: Promise<{
		state?: string;
		code?: string;
		scope?: string;
		authuser?: string;
		prompt?: string;
	}>;
}) {
	const { state, code } = await searchParams;
	const provider = JSON.parse(
		(await cookies()).get("auth_provider")?.value ?? "{}",
	) as PocketbaseAuthMethods | undefined;
	const parsedHeaders = await headers();

	const [protocol, host] = [
		parsedHeaders.get("x-forwarded-proto"),
		parsedHeaders.get("host"),
	];

	console.log(protocol, host);

	if (!state) {
		throw "No state in query params";
	}
	if (!code) {
		throw "No code in query params";
	}

	if (!provider) {
		throw "Auth provider cookie is no longer present - we don't know where you came from!";
	}

	const pb = new Pocketbase(process.env.POCKETBASE_URL);

	try {
		const authData = await pb
			.collection("users")
			.authWithOAuth2Code(
				provider.name,
				code,
				provider.codeVerifier,
				`${protocol}://${host}/auth/redirect`,
			);

		console.log(authData);
	} catch (err) {
		throw "Something went wrong";
	}
	redirect("/dashboard");
	return <p>Completed - redirecting...</p>;
}
