import WritableInput from "@/components/Inputs/Time/Text";
import type React from "react";
import { forwardRef } from "react";

interface NameProps extends React.HTMLProps<HTMLInputElement> {
	copy: string;
}

const Name = forwardRef<HTMLInputElement, NameProps>(({ copy }, ref) => {
	return (
		<div className="flex flex-col gap-4">
			<h2 className="text-3xl font-bold">{copy}</h2>
			<WritableInput ref={ref} />
		</div>
	);
});

export default Name;
