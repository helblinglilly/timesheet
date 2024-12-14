import { cookies } from "next/headers";

export async function getUserSession() {
	const allCookies = await cookies();

	const authCookie = allCookies.get("pb_auth");
	if (!authCookie) {
		return {
			isSignedIn: false,
		};
	}

	const values = JSON.parse(authCookie.value);
}
