import newrelicLog from "@/utils/log/newrelic";
import type { NextApiRequest, NextApiResponse } from "next";

export const runtime = "edge";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	if (req.method !== "POST") {
		res.setHeader("Allow", ["POST"]);
		res.status(405).end(`Method ${req.method} Not Allowed`);
		return;
	}

	try {
		newrelicLog(req.body);
	} catch (err) {
		console.log("Failure sending logs to NR", err);
		res.status(500).send("");
		return;
	}
	res.status(200).send("");
}
