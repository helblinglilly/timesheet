export type PocketbaseError = {
	url: string;
	code: number;
	message: string;
	response: {
		data: Record<
			string,
			{
				code: string;
				message: string;
			}
		>;
	};
};
