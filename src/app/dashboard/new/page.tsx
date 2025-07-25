/* eslint-disable react/jsx-no-bind */
import { serverSideAuth } from "@/utils/pb/server";
import Form from "next/form";
import { redirect } from "next/navigation";
import DashboardSetup from "./Setup";

export default async function NewTimesheet() {
  async function formAction(formData: FormData) {
    "use server";
    const pb = await serverSideAuth();

    const [kind, name, minutesPerDay, daysPerWeek, lunchMinutes] = [
      formData.get("kind"),
      formData.get("name"),
      formData.get("minutesPerDay"),
      formData.get("daysPerWeek"),
      formData.get("lunchMinutes"),
    ];

    await pb.collection("timesheet").create({
      user: pb.authStore.record?.id,
      kind,
      name,
      minutesPerDay,
      daysPerWeek,
      lunchMinutes,
    });

    redirect("/dashboard");
  }


  return (
    <main className="grid justify-center pt-4 md:pt-8">
      <Form
        action={formAction}
        className="flex flex-col md:flex-row p-8"
      >
        <DashboardSetup />
      </Form>
    </main>
  );
}
