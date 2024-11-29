"use server";

export default async function newrelicLog(
	details: {
		message: string;
	} & { [key: string]: unknown },
) {
	console.dir({
		timestamp: new Date().toISOString(),
		...details,
	});

	try {
		await fetch(
			`https://log-api.eu.newrelic.com/log/v1?Api-Key=${process.env.NEWRELIC_LICENSE_KEY}`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					appName: "timesheet",
					...details,
				}),
			},
		);
	} catch (err) {
		console.log(err);
	}
}