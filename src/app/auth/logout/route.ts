import { type NextRequest, NextResponse } from "next/server";
import { serverSideAuth } from "~/pocketbase/server";

export async function GET(request: NextRequest) {
  const pb = await serverSideAuth();

  const url = request.nextUrl.clone();
  url.pathname = "/auth/login";
  url.search = "";
  const response = NextResponse.redirect(url);

  pb.authStore.clear();
  // Set a cookie on the response
  response.cookies.delete("pb_auth");

  return response;
}
