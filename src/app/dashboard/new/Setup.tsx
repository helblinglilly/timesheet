"use client";

import { useRef, useState } from "react";
import OfficeHours from "./Hours";
import Kind from "./Kind";
import Name from "./Name";

export default function DashboardSetup() {
	const [screen, setScreen] = useState<"start" | "hours" | "name">("start");
	const kindRef = useRef<HTMLInputElement>(null);
	const minutesPerDayRef = useRef<number>(0);
	const daysPerWeekRef = useRef<number>(0);
	const lunchMinutesRef = useRef<number>(0);
	const nameRef = useRef<HTMLInputElement>(null);

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

				{screen === "hours" && (
					<OfficeHours
						action={(minutesPerDay, daysPerWeek, lunchMinutes) => {
							minutesPerDayRef.current = minutesPerDay;
							daysPerWeekRef.current = daysPerWeek;
							lunchMinutesRef.current = lunchMinutes;
							setScreen("name");
						}}
					/>
				)}
				{screen === "name" && (
					<Name
						copy={
							kindRef.current?.value === "office"
								? "What's the name of the company?"
								: "What do you want to call this gig?"
						}
					/>
				)}
			</div>
		</>
	);
}
