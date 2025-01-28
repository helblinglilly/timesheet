import { useEffect, useRef, useState } from "react";
import InputWithLabel from "../InputWithLabel";

export default function InputHourMinutes({
	onInput,
}: { onInput: (totalMinutes: number) => void }) {
	const inputHourRef = useRef<HTMLInputElement>(null);
	const inputMinuteRef = useRef<HTMLInputElement>(null);

	const [totalMinutes, setTotalMinutes] = useState(7 * 60 + 30);

	useEffect(() => {
		onInput(totalMinutes);
	}, [totalMinutes, onInput]);

	return (
		<div className="inline-flex gap-2">
			<InputWithLabel
				type="number"
				defaultValue={7}
				labelText="hours"
				step={1}
				min={0}
				max={24}
				ref={inputHourRef}
				onInput={(e) => {
					const hours = Number(e.currentTarget.value);
					setTotalMinutes(hours * 60 + Number(inputMinuteRef.current?.value));
				}}
			/>

			<InputWithLabel
				type="number"
				defaultValue={30}
				labelText="minutes"
				step={1}
				min={0}
				max={59}
				ref={inputMinuteRef}
				onInput={(e) => {
					const minutes = Number(e.currentTarget.value);
					setTotalMinutes(Number(inputHourRef.current?.value) * 60 + minutes);
				}}
			/>
		</div>
	);
}
