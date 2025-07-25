import { authDataToCookie } from "@/utils/pb";
import { serverSideAuth } from "@/utils/pb/server";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(_request: NextRequest) {
  const pb = await serverSideAuth();

  const successfulResponse = new NextResponse(null, { status: 200 });
  try {
    const authData = await pb.collection("users").authRefresh();

    const expires = new Date();
    expires.setDate(expires.getDate() + 30);

    successfulResponse.cookies.set(
      "pb_auth",
      JSON.stringify(authDataToCookie(authData)),
      {
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        expires,
      },
    );

    return successfulResponse;
  } catch {
    return new NextResponse(null, { status: 401 });
  }
}
