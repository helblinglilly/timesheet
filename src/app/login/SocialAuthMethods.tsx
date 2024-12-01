"use server";
import type { PocketbaseAuthMethods } from "@/lib/pocketbase.types";
import React from "react";
import OAuthMethod from "./OAuthMethods";

export default async function SocialAuthMethods() {
	const res = fetch(
		`${process.env.POCKETBASE_URL}/api/collections/users/auth-methods`,
	);
	const body = await (await res).json();
	const authMethods = body.authProviders as Array<PocketbaseAuthMethods>;

	return (
		<>
			{authMethods.map((authMethod) => {
				return <OAuthMethod authMethod={authMethod} key={authMethod.name} />;
			})}
		</>
	);
}
