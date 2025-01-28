"use client";

import { useRef, useState } from "react";
import OfficeHours from "./Hours";
import Kind from "./Kind";

export default function DashboardSetup() {
	const [screen, setScreen] = useState<"start" | "hours">("start");
	const kindRef = useRef<HTMLInputElement>(null);

	return (
		<>
			<input hidden name="kind" ref={kindRef} />
			<div className="grid gap-4">
				{["start"].some((a) => a === screen) && (
					<Kind
						action={(value) => {
							if (kindRef.current) {
								kindRef.current.value = value;
								setScreen("hours");
							}
						}}
					/>
				)}

				{screen === "hours" && <OfficeHours />}
			</div>
		</>
	);
}
