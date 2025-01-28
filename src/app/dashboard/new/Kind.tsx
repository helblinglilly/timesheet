"use client";

export default function DashboardSetup({
	action,
}: { action: (value: "office" | "freelance") => void }) {
	return (
		<>
			<div className="grid gap-4">
				<h2 className="text-3xl font-bold text-center">
					What are you keeping track of?
				</h2>

				<div className="flex flex-col md:flex-row gap-2 w-full justify-center pb-2">
					<input
						type="radio"
						id="office"
						name="kind"
						value="office"
						className="appearance-none"
						onChange={() => action("office")}
					/>
					<label
						htmlFor="office"
						className="w-full grid h-32 bg-violet-400 active:bg-violet-500 hover:bg-violet-500 hover:cursor-pointer rounded-md p-4 content-center text-center text-black gap-2"
					>
						<p className="text-xl font-semibold">🏣 Office job</p>
						<p>
							Match your hours with your contract to make sure you don't work
							too much or too little
						</p>
					</label>

					<input
						type="radio"
						id="freelance"
						name="kind"
						value="freelance"
						className="appearance-none"
						onChange={() => action("freelance")}
					/>
					<label
						htmlFor="freelance"
						className="w-full grid h-32 bg-violet-400 active:bg-violet-500 hover:bg-violet-500 hover:cursor-pointer rounded-md p-4 content-center text-center text-black gap-2"
					>
						<p className="text-center text-xl font-semibold">
							🎒 Freelance gig
						</p>
						<p>
							Keep track of your hours worked so you can invoice your clients.
							Work anytime you like
						</p>
					</label>
				</div>
			</div>
		</>
	);
}
