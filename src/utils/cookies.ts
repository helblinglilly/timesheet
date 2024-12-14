"use client";

export const setCookieClient = (
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

export const getCookieClient = (name: string) => {
	if (typeof document === "undefined") {
		return undefined;
	}
	const matches = document.cookie.match(
		new RegExp(
			// biome-ignore lint/style/useTemplate: Behaves differently with template strings
			"(?:^|; )" +
				name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") +
				"=([^;]*)",
		),
	);
	return matches ? decodeURIComponent(matches[1]) : undefined;
};
