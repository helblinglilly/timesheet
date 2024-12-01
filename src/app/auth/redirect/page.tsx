import type { PageComponentProps } from "@/app/types";
import React, { Suspense } from "react";
import Verification from "./Verification";

export default function AuthRedirect({ searchParams }: PageComponentProps) {
	return (
		<Suspense fallback={<p>Signging in...</p>}>
			<Verification searchParams={searchParams} />
		</Suspense>
	);
}
