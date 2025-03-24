import WritableInput from "@/components/Inputs/Time/Text";
import type React from "react";
import { forwardRef, useRef, useState } from "react";

interface NameProps {
	copy: string;
	action: (name: string) => void;
}

const Name = ({ copy, action }: NameProps) => {
	const nameRef = useRef<HTMLInputElement>(null);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	return (
		<div className="flex flex-col gap-4">
			<h2 className="text-3xl font-bold">{copy}</h2>
			<WritableInput
				ref={nameRef}
				className="w-full"
				placeholder="Company name ltd"
			/>

			<button
				type="button"
				className="h-12 rounded-md bg-violet-100 hover:bg-violet-300 dark:bg-violet-400 dark:hover-bg-violet-500 dark:text-red"
				onClick={() => {
					const value = nameRef.current?.value ?? "";

					if (value.length > 1) {
						action(value);
						setErrorMessage(null);
					} else {
						setErrorMessage("Name cannot be empty");
					}
				}}
			>
				Finish
			</button>

			{errorMessage && <p className="text-red-600">{errorMessage}</p>}
		</div>
	);
};

export default Name;
