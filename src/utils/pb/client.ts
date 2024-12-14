"use client";

import Pocketbase from "pocketbase";
import { useEffect, useState } from "react";
import { getCookieClient } from "../cookies";

export function usePocketbase() {
	const [pb, setPb] = useState<Pocketbase>(
		new Pocketbase(process.env.POCKETBASE_URL),
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: Used by getCookieClient
	useEffect(() => {
		// Check if we are in a browser environment
		if (typeof document !== "undefined") {
			const pbCookie = getCookieClient("pb_auth");
			const newPb = new Pocketbase(process.env.POCKETBASE_URL);

			if (pbCookie) {
				const data = JSON.parse(pbCookie ?? "{}");
				newPb.authStore.save(data.token, data.record || data.meta);
			} else {
				newPb.authStore.clear();
			}
			setPb(newPb);
		}
	}, [typeof document !== "undefined" ? document.cookie : null]);

	return pb;
}
