import type React from "react";

export default function WritableInput({
  ...inputProps
}: React.HTMLProps<HTMLInputElement>) {
  return (
    <input
      {...inputProps}
      className={`rounded-md py-1.5 px-2 text-gray-700 placeholder:text-gray-400 focus:outline-none ${inputProps.className}`}
    />
  );
}
