"use server";
import React from "react";

export default async function SocialAuthMethods() {
	const res = fetch(
		`${process.env.POCKETBASE_URL}/api/collections/users/auth-methods`,
	);
	const body = await (await res).json();
	const authMethods = body.authProviders as Array<{
		name: "google" | "github";
		displayName: "Google" | "Github";
		state: string;
		authUrl: string;
		codeVerifier: string;
		codeChallenge: string;
		codeChallengeMethod: string;
	}>;

	console.log(authMethods);

	return (
		<>
			{authMethods.map((authMethod) => {
				return (
					<a
						href={authMethod.authUrl}
						className="w-full h-12"
						key={authMethod.name}
					>
						<button className={`w-full p-4 ${authMethod.name}`} type="button">
							{authMethod.displayName}
						</button>
					</a>
				);
			})}
		</>
	);
}
