export interface PocketbaseError {
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
}

export interface PocketbaseAuthMethods {
  name: 'google';
  displayName: 'Google' | 'Github';
  state: string;
  authUrl: string;
  codeVerifier: string;
  codeChallenge: string;
  codeChallengeMethod: string;
}

export interface PBOAuthResponseGoogle {
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
}

export interface PBAuthResponse {
  meta?: PBOAuthResponseGoogle;
  record: {
    avatar: string;
    collectionId: string;
    collectionName: string;
    created: string;
    email: string;
    emailVisibility: boolean;
    id: string;
    name: string;
    updated: string;
    verified: boolean;
  };
  token: string;
}
