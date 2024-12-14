"use server";

import type { PBAuthResponse, PocketbaseError } from "@/lib/pocketbase.types";
import { log } from "@/utils/log";
import { authDataToCookie } from "@/utils/pb";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Pocketbase from "pocketbase";
import {
	AuthFormFields,
	type LoginActionType,
	type SignupActionType,
} from "./types";

function validateEmail(email: string | undefined): string | undefined {
	if (!email) {
		return "No Email provided";
	}
	if (!email.includes("@")) {
		return 'must include one "@"';
	}
	if (!email.includes(".")) {
		return 'must include at least one "."';
	}
}

function validatePassword(password: string | undefined): string | undefined {
	if (!password) {
		return "must provide a password";
	}

	if (password.length < 8) {
		return "must be at least 8 characters";
	}
}

export async function signUp(
	previousState: SignupActionType,
	formData: FormData,
): Promise<SignupActionType> {
	const rawEmail = formData.get("email") as string | undefined;
	const rawPassword = formData.get("password") as string | undefined;
	const rawPasswordConfirmation = formData.get("password_confirm") as
		| string
		| undefined;

	const inputs: SignupActionType["inputs"] = {
		email: rawEmail,
		password: rawPassword,
		password_confirmation: rawPasswordConfirmation,
	};

	const errors: SignupActionType["errors"] = [
		{ field: AuthFormFields.EMAIL, message: validateEmail(rawEmail) },
		{ field: AuthFormFields.PASSWORD, message: validatePassword(rawPassword) },
		{
			field: AuthFormFields.PASSWORD_CONFIRMATION,
			message:
				rawPasswordConfirmation !== rawPassword
					? "does not match password"
					: undefined,
		},
	].filter((err) => err.message);

	if (errors.length > 0) {
		return {
			errors,
			inputs,
			isSuccessful: false,
		};
	}

	const email = rawEmail as string;
	const password = rawPassword as string;
	const passwordConfirmation = rawPasswordConfirmation as string;

	const pb = new Pocketbase(process.env.POCKETBASE_URL);

	try {
		const record = await pb.collection("users").create({
			username: email.split("@")[0],
			name: email.split("@")[0],
			email,
			emailVisibility: false,
			password: password,
			passwordConfirm: passwordConfirmation,
		});

		await pb.collection("users").requestVerification(email);
		await log({ message: "Email account signup", success: true });
	} catch (err) {
		const pocketbaseError = err as PocketbaseError;

		let errorMessage = "Something went wrong - please try again";

		if (pocketbaseError.response) {
			if (pocketbaseError.response.data.email) {
				errorMessage = `${pocketbaseError.response.data.email.message}`;
			}
			if (pocketbaseError.response.data.password) {
				errorMessage = `${pocketbaseError.response.data.password.message}`;
			}
		}
		await log({ message: "Email account signup", success: false });
		return {
			inputs,
			errors: [
				{
					field: AuthFormFields.EMAIL,
					message: errorMessage,
				},
			],
		};
	}

	return {
		inputs: {
			email: email,
			password: "",
			password_confirmation: "",
		},
		errors: [],
		isSuccessful: true,
	};
}

export async function emailLogin(
	previousState: LoginActionType,
	formData: FormData,
): Promise<LoginActionType> {
	const rawEmail = formData.get("email") as string | undefined;
	const rawPassword = formData.get("password") as string | undefined;
	const inputs: LoginActionType["inputs"] = {
		email: rawEmail,
		password: rawPassword,
	};

	if (!rawEmail || validateEmail(rawEmail)) {
		return {
			inputs,
			error: `Email ${validateEmail(rawEmail)}`,
		};
	}

	if (!rawPassword) {
		return {
			inputs,
			error: "Password cannot be empty",
		};
	}

	const pb = new Pocketbase(process.env.POCKETBASE_URL);

	try {
		const authData = (await pb
			.collection("users")
			.authWithPassword(rawEmail, rawPassword)) as PBAuthResponse;

		const expires = new Date();
		expires.setDate(expires.getDate() + 30);
		const cookieStore = await cookies();
		cookieStore.set("pb_auth", JSON.stringify(authDataToCookie(authData)), {
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			path: "/",
			expires,
		});
		await log({ message: "Email login", success: true });
	} catch (err) {
		await log({ message: "Email login", success: false });
		return {
			inputs,
			error: "Email and password do not match",
		};
	}

	redirect("/");
}
