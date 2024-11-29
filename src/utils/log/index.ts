import newrelicLog from "./newrelic";

export async function log(
	details: {
		message: string;
	} & { [key: string]: unknown },
) {
	if (typeof window === "undefined") {
		newrelicLog({
			...details,
			runtime: "server",
		});
	} else {
		await fetch("/api/log", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ ...details, runtime: "client" }),
		});
	}
}
