import { serverSideAuth } from "@/utils/pb/server";

export default async function NewTimesheet() {
	async function formAction(formData: FormData) {
		"use server";
		const pb = await serverSideAuth();

		// const [name, dailyWorkMinutes, workingDays, dailyUnpaidBreakMinutes] = [
		// 	formData.get("name"),
		// 	formData.get("dailyWorkMinutes"),
		// 	formData.get("workingDays"),
		// 	formData.get("dailyBreakMinutes"),
		// ];

		// console.log(pb.authStore.record);
		// await pb.collection("timesheet").create({
		// 	name,
		// 	user: pb.authStore.record?.id,
		// 	dailyWorkMinutes,
		// 	workingDays,
		// 	dailyUnpaidBreakMinutes,
		// });
	}

	return (
		<main>
			<h1 className="text-3xl font-bold">New Timesheet</h1>

			<form action={formAction} className="flex flex-col md:flex-row p-8">
				<div className="flex gap-4">
					<label htmlFor="name">Name</label>
					<input name="name" type="string" minLength={1} required />
				</div>

				<div className="flex gap-4">
					<label htmlFor="workingDays">Workdays</label>
					<input
						name="workingDays"
						type="number"
						min={0}
						max={7}
						defaultValue={5}
					/>
				</div>

				<div className="flex gap-4">
					<label htmlFor="dailyWorkMinutes">Weekly Minutes</label>
					<input
						name="dailyWorkMinutes"
						type="number"
						min={1}
						max={168}
						defaultValue={40}
						required
					/>
				</div>

				<div className="flex gap-4">
					<label htmlFor="dailyBreakMinutes">Daily break minutes</label>
					<input
						name="dailyBreakMinutes"
						type="number"
						min={0}
						max={1440}
						defaultValue={30}
					/>
				</div>
				<button type="submit">Submit</button>
			</form>
		</main>
	);
}
