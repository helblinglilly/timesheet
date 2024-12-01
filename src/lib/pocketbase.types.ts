export type PocketbaseError = {
	url: string;
	code: number;
	message: string;
	response: {
		data: Record<
			string,
			{
				code: string;
				message: string;
			}
		>;
	};
};

export type PocketbaseAuthMethods = {
	name: "google" | "github";
	displayName: "Google" | "Github";
	state: string;
	authUrl: string;
	codeVerifier: string;
	codeChallenge: string;
	codeChallengeMethod: string;
};
