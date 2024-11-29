export enum AuthFormFields {
	EMAIL = "Email",
	PASSWORD = "Password",
	PASSWORD_CONFIRMATION = "Password Confirmation",
}

export type SignupActionType = {
	errors: Array<{
		field: AuthFormFields;
		message: string | undefined;
	}>;
	inputs: {
		email: string | undefined;
		password: string | undefined;
		password_confirmation?: string | undefined;
	};
	isSuccessful?: boolean;
};

export const initialSignupState: SignupActionType = {
	errors: [],
	inputs: {
		email: undefined,
		password: undefined,
		password_confirmation: undefined,
	},
};

export type LoginActionType = {
	error?: string;
	inputs: {
		email: string | undefined;
		password: string | undefined;
	};
};

export const initialLoginState: LoginActionType = {
	inputs: {
		email: undefined,
		password: undefined,
	},
};
