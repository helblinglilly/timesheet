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

export type PBOAuthResponseGoogle = {
	id: string;
	name: string;
	/**
		@ignore
		Will be empty for OAuth users
		 */
	username: string;
	avatarUrl: string;
	accessToken: string;
	refreshToken: string;
	/**
    @type Date ISO 8601
    */
	expiry: string;
	isNew: boolean;
};

export type PBAuthResponse = {
	meta?: PBOAuthResponseGoogle;
	record: {
		avatar: string;
		collectionId: string;
		collectionName: string;
		created: string;
		email: string;
		emailVisibility: boolean;
		id: string;
		username: string;
		updated: string;
		verified: boolean;
	};
	token: string;
};
