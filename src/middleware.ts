import { serverSideAuth } from "@/utils/pb/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest, response: NextResponse) {
	const isAuthenticated = (await serverSideAuth()).authStore.isValid;

	if (!isAuthenticated) {
		return NextResponse.redirect(new URL("/auth/login", request.url));
	}
}

export const config = {
	matcher: ["/dashboard", "/dashboard/:path*"],
};
