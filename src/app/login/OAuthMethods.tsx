"use client";
import type { PocketbaseAuthMethods } from "@/lib/pocketbase.types";
import { setCookie } from "@/utils/cookies";
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
				setCookie("provider", JSON.stringify(authMethod));
				window.location.assign(authMethod.authUrl + "/auth/redirect");
				// window.location.assign(
				// 	`https://accounts.google.com/o/oauth2/auth?client_id=168555145740-a6uljgs68l2s26ddrcs89knbelvf9tvq.apps.googleusercontent.com&code_challenge=cGKVGCeZPWQcZ1NDsvzdzP37Sh8oEjSls0L1-tRZWjo&code_challenge_method=S256&response_type=code&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email&state=AUOb0G4qyonpkby0ZFjNq8uxnphELu&redirect_uri=/auth/redirect`,
				// );
			}}
		>
			{authMethod.displayName}
		</button>
	);
}
