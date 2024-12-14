"use client";

import { usePocketbase } from "@/utils/pb/client";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function AuthButton() {
	const { authStore } = usePocketbase();
	const [isSignedIn, setIsSignedIn] = useState(false);

	useEffect(() => {
		setIsSignedIn(authStore.isValid);
	}, [authStore]);

	const href = isSignedIn ? "/auth/logout" : "/auth/login";

	return (
		<Link href={href} key={href}>
			<button
				type="button"
				className="bg-violet-100 hover:bg-violet-300 dark:bg-violet-400 dark:hover:bg-violet-500 dark:text-white h-12 rounded-md px-4"
			>
				{isSignedIn ? "Logout" : "Login"}
			</button>
		</Link>
	);
}
