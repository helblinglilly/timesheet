import EmailLogin from "@/components/EmailLogin";
import React, { Suspense } from "react";
import SocialAuthMethods from "./SocialAuthMethods";

export default function Login() {
	const expectedAuthMethods = ["github", "google"];

	return (
		<div className="p-4 w-full flex justify-center">
			<div className="grid gap-4 w-full md:w-[50%] max-w-[600px]">
				<EmailLogin />

				<Suspense
					fallback={
						<div className="animate-pulse grid gap-4">
							{expectedAuthMethods.map((method) => {
								return (
									<div
										key={method}
										className={`p-4 h-14 animate-pulse text-center ${method}`}
									>
										Loading
									</div>
								);
							})}
						</div>
					}
				>
					<SocialAuthMethods />
				</Suspense>
			</div>
		</div>
	);
}
