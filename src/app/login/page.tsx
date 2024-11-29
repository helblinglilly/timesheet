import EmailLogin from "@/components/EmailLogin";
import React, { Suspense } from "react";
import SocialAuthMethods from "./socialAuth";

export default function Login() {
	return (
		<div>
			<EmailLogin />

			<Suspense fallback={<p>Loading auth methods</p>}>
				<SocialAuthMethods />
			</Suspense>
		</div>
	);
}
