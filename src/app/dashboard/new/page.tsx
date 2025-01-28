import { serverSideAuth } from "@/utils/pb/server";
import Form from "next/form";
import DashboardSetup from "./Setup";

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
		<main className="grid justify-center pt-4 md:pt-8">
			<Form action={formAction} className="flex flex-col md:flex-row p-8">
				<DashboardSetup />
			</Form>
		</main>
	);
}
