import type { PBAuthResponse } from "@/lib/pocketbase.types";

export function authDataToCookie(authData: PBAuthResponse) {
	return {
		token: authData.token,
		record: {
			avatar: authData.meta?.avatarUrl || authData.record.avatar,
			email: authData.record.email,
			name: authData.record.username || authData.meta?.name,
		},
	};
}
