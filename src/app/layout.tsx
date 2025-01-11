import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import type React from "react";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import { AuthProvider } from "@/context/AuthContext";

const interSans = localFont({
	src: "./fonts/Inter/Inter-VariableFont_opsz,wght.ttf",
	variable: "--font-inter-sans",
	weight: "100 900",
});
const interMono = localFont({
	src: "./fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
	weight: "100 900",
});

export const metadata: Metadata = {
	title: "Timesheet",
	description: "Keep track of your work hours",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${interSans.variable} ${interMono.variable} antialiased`}
			>
				<Script
					id="new-relic-browser-snippet"
					strategy="beforeInteractive"
					src={"/newrelic.js"}
				/>

				<AuthProvider>
					<Navbar />
					{children}
				</AuthProvider>
			</body>
		</html>
	);
}
