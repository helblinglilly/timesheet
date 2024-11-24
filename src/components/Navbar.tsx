import Link from "next/link";
import React from "react";
import Icon from "./Icon";

export default function Navbar() {
	const links = [
		{
			name: "Home",
			href: "/",
		},
		{
			name: "Login",
			href: "/login",
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
								className="bg-violet-100 hover:bg-violet-200 dark:bg-transparent dark:hover:bg-violet-400 h-12 rounded-md px-4"
							>
								{name}
							</button>
						</Link>
					);
				})}
			</div>
			<button
				type="button"
				className="bg-violet-100 hover:bg-violet-200 dark:bg-transparent dark:hover:bg-violet-400 h-12 rounded-md px-4"
			>
				<div className="inline-flex gap-2">
					<Icon name="sun" />
					<b className="text-lg">/</b>
					<Icon name="moon" />
				</div>
			</button>
		</nav>
	);
}
