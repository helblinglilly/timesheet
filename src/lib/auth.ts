import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function validateAuthentication() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("pb_auth");

  if (!authCookie) {
    redirect("/auth/login");
  }

  const res = await fetch("/auth/me");
  if (res.status === 200) {
    return true;
  }

  return false;
}
