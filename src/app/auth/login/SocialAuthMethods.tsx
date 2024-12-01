"use server";
import type { PocketbaseAuthMethods } from "@/lib/pocketbase.types";
import { headers } from "next/headers";
import React from "react";
import OAuthMethod from "./OAuthMethods";

export default async function SocialAuthMethods() {
	const res = fetch(
		`${process.env.POCKETBASE_URL}/api/collections/users/auth-methods`,
	);
	const body = await (await res).json();
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
