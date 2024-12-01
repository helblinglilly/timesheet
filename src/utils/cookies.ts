"use client";

export const setCookie = (
	name: string,
	value: string,
	overrideOptions?: {
		expires?: Date;
		path?: string;
		SameSite?: "Lax";
		"max-age"?: number;
	},
) => {
	let expires = new Date();
	expires.setDate(expires.getDate() + 90);

	if (overrideOptions?.expires) {
		expires = overrideOptions.expires;
	}

	const options = {
		path: "/",
		expires: overrideOptions?.expires ?? expires,
		SameSite: "Lax",
		...overrideOptions,
	};

	let updatedCookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

	for (const [key, value] of Object.entries(options)) {
		updatedCookie += `; ${key}=${value}`;
	}
	document.cookie = updatedCookie;
};
