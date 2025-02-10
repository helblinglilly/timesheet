"use client";

import InputWithLabel from "@/components/Inputs/InputWithLabel";
import InputHourMinutes from "@/components/Inputs/Time/HourMinutes";
import { useState } from "react";

export default function OfficeHours({
	action,
}: {
	action: (
		minutesPerDay: number,
		daysPerWeek: number,
		lunchMinutes: number,
	) => void;
}) {
	const [minutesPerDay, setMinutesPerDay] = useState(0);
	const [daysPerWeek, setDaysPerWeek] = useState(5);
	const [lunchMinutes, setLunchMinutes] = useState(30);

	return (
		<>
			<h3 className="text-3xl font-bold text-center">
				What are your hours like?
			</h3>

			<h4 className="text-xl font-bold text-center">
				How much do you work on a typical day?
			</h4>

			<div className="flex justify-center">
				<InputHourMinutes onInput={setMinutesPerDay} />
			</div>

			<h4 className="text-xl font-bold text-center">
				How many days do you work per week?
			</h4>
			<div className="flex justify-center">
				<InputWithLabel
					labelText="days"
					type="number"
					step={0.5}
					min={0.5}
					max={7}
					defaultValue={5}
					onInput={(e) => {
						setDaysPerWeek(Number(e.currentTarget.value));
					}}
				/>
			</div>

			<h4 className="text-xl font-bold text-center">
				How long are your breaks?
			</h4>
			<div className="flex justify-center">
				<InputWithLabel
					labelText="minutes"
					type="number"
					step={1}
					min={0}
					defaultValue={30}
					onInput={(e) => {
						setLunchMinutes(Number(e.currentTarget.value));
					}}
				/>
			</div>

			<div className="pt-8">
				<p className="text-center">
					That puts you at <b>{(minutesPerDay * daysPerWeek) / 60}</b>{" "}
					hours/week
				</p>
				<p className="text-center">
					and <b>{(lunchMinutes * daysPerWeek) / 60}</b> hours/week in breaks
				</p>
			</div>

			<button
				type="button"
				onClick={() => {
					action(minutesPerDay, daysPerWeek, lunchMinutes);
				}}
				className="h-12 rounded-md bg-violet-100 hover:bg-violet-300 dark:bg-violet-400 dark:hover-bg-violet-500 dark:text-black"
			>
				Next
			</button>
		</>
	);
}
