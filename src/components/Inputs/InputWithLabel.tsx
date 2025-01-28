import type React from "react";
import { forwardRef, useId } from "react";
import WritableInput from "./Time/Text";

interface InputWithLabelProps extends React.HTMLProps<HTMLInputElement> {
	labelText?: string;
}

const InputWithLabel = forwardRef<HTMLInputElement, InputWithLabelProps>(
	(inputProps, ref) => {
		const { labelText = "hours", ...rest } = inputProps;
		const id = useId();

		return (
			<div className="flex items-center rounded-md bg-white outline-gray-300 w-fit">
				<WritableInput {...rest} ref={ref} />
				<label
					htmlFor={id}
					className="text-base pr-2 text-gray-500 select-none sm:text-sm/6"
				>
					{labelText}
				</label>
			</div>
		);
	},
);

export default InputWithLabel;
