import type { PBAuthResponse } from "@/lib/pocketbase.types";
import type { RecordAuthResponse, RecordModel } from "pocketbase";

export function authDataToCookie(
	authData: PBAuthResponse | RecordAuthResponse<RecordModel>,
) {
	return {
		token: authData.token,
		record: {
			id: authData.record.id,
			avatar: authData.meta?.avatarUrl || authData.record.avatar,
			email: authData.record.email,
			name: authData.record.username || authData.meta?.name,
		},
	};
}
