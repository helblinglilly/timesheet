import Link from "next/link";
import React from "react";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
	const links = [
		{
			name: "Home",
			href: "/",
		},
		{
			name: "Login",
			href: "/auth/login",
		},
	];
	return (
		<nav className="w-full inline-flex justify-between p-4 bg-zinc-800 dark:bg-zinc-950">
			<div className="flex gap-4">
				{links.map(({ name, href }) => {
					return (
						<Link href={href} key={href}>
							<button
								type="button"
								className="bg-violet-100 hover:bg-violet-300 dark:bg-violet-400 dark:hover:bg-violet-500 dark:text-white h-12 rounded-md px-4"
							>
								{name}
							</button>
						</Link>
					);
				})}
			</div>
			<ThemeToggle />
		</nav>
	);
}
