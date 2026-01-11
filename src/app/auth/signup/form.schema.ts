import type { Namespace, TFunction } from 'i18next';
import z from 'zod';

const minPasswordLength = 8;

export const formSchema = (t: TFunction<Namespace, undefined>) =>
  z.object({
    email: z.email(),
    password: z.string()
      .min(minPasswordLength, {
        message: t('authentication.signup.fields.password.requirements.minLength', {
          number: minPasswordLength
        }) })
      .refine(
        (password) => /[A-Z]/.test(password), // At least one uppercase
        { message: t('authentication.signup.fields.password.requirements.uppercase') }
      )
      .refine(
        (password) => /[0-9]/.test(password), // At least one number
        { message: t('authentication.signup.fields.password.requirements.number') }
      )
      .refine(
        (password) => /[^A-Za-z0-9]/.test(password), // At least one special char
        { message: t('authentication.signup.fields.password.requirements.special_char') }
      ),
    passwordConfirm: z.string().min(minPasswordLength, {
      message: t('authentication.signup.fields.password.requirements.match'),
    }),
  })
    .refine((data) => data.password === data.passwordConfirm, {
      message: t('authentication.signup.fields.password.requirements.match'),
      path: ['passwordConfirm']
    });
