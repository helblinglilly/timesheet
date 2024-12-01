"use client";

import React, { useEffect, useState } from "react";
import Icon from "../Icon";

export default function ThemeToggle() {
	const [isDarkMode, setIsDarkMode] = useState(false);

	useEffect(() => {
		if (localStorage.getItem("theme") === "dark") {
			document.documentElement.classList.add("dark");
			setIsDarkMode(true);
		}
	}, []);

	const toggleTheme = () => {
		if (document.documentElement.classList.contains("dark")) {
			document.documentElement.classList.remove("dark");
			localStorage.setItem("theme", "light");
			setIsDarkMode(false);
		} else {
			document.documentElement.classList.add("dark");
			localStorage.setItem("theme", "dark");
			setIsDarkMode(true);
		}
	};

	return (
		<button
			type="button"
			className="bg-violet-100 hover:bg-violet-300 dark:bg-violet-400 dark:hover:bg-violet-500 h-12 rounded-md px-4"
			onClick={toggleTheme}
		>
			<div className="inline-flex gap-2">
				<Icon name="sun" />
				<b className="text-lg dark:text-black">/</b>
				<Icon name="moon" />
			</div>
		</button>
	);
}
