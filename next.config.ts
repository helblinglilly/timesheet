import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	async headers() {
		return [
			{
				source: "/(.*)",
				headers: [
					{
						key: "Content-Security-Policy",
						value:
							"default-src 'self'; script-src 'self' https://js-agent.newrelic.com 'unsafe-inline' 'unsafe-eval'; connect-src 'self' https://bam.eu01.nr-data.net; img-src 'self'; style-src 'self' 'unsafe-inline';",
					},
				],
			},
		];
	},
	/* other config options here */
};

export default nextConfig;
