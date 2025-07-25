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
    try {
      await fetch("/api/log", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...details, runtime: "client" }),
      });
    } catch (err) {
      console.log("Failed to send log message to internal API endpoint", err);
    }
  }
}
