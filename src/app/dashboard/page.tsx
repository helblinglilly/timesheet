import { serverSideAuth } from "@/utils/pb/server";
import React from "react";

export default async function Dashboard() {
	const pb = await serverSideAuth();

	return <p>Hello {JSON.stringify(pb.authStore)}</p>;
}
