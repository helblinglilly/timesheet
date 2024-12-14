import type { PBAuthResponse } from "@/lib/pocketbase.types";
import { log } from "@/utils/log";
import { authDataToCookie } from "@/utils/pb";
import { type NextRequest, NextResponse } from "next/server";
import Pocketbase from "pocketbase";

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;

	const [state, code] = [searchParams.get("state"), searchParams.get("code")];
	const [protocol, host] = [
		request.headers.get("x-forwarded-proto"),
		request.headers.get("host"),
	];
	const provider = JSON.parse(
		request.cookies.get("auth_provider")?.value ?? "{}",
	);

	if (!state) {
		throw "No state in query params";
	}
	if (!code) {
		throw "No code in query params";
	}

	if (!provider) {
		throw "Auth provider cookie is no longer present - we don't know where you came from!";
	}

	const pb = new Pocketbase(process.env.POCKETBASE_URL);

	try {
		const authData = (await pb
			.collection("users")
			.authWithOAuth2Code(
				provider.name,
				code,
				provider.codeVerifier,
				`${protocol}://${host}/auth/redirect`,
			)) as PBAuthResponse;

		if (authData.meta?.isNew) {
			console.log(authData);
			try {
				await pb.collection("users").update(authData.record.id, {
					name: authData.meta.name,
				});
			} catch (err) {
				log({
					message: "Failed to set username after OAuth login",
					error: err,
				});
			}
		}

		const url = request.nextUrl.clone();
		url.pathname = "/dashboard";
		url.search = "";
		const response = NextResponse.redirect(url);

		const expires = new Date();
		expires.setDate(expires.getDate() + 30);
		// Set a cookie on the response
		response.cookies.set(
			"pb_auth",
			JSON.stringify(authDataToCookie(authData)),
			{
				secure: process.env.NODE_ENV === "production",
				sameSite: "lax",
				path: "/",
				expires,
			},
		);

		response.cookies.delete("auth_provider");

		return response;
	} catch (err) {
		log({ message: `${err}` });
		throw "Something went wrong";
	}
}
