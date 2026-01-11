import { env } from '~/env';

export function getDomainConfig() {
  const requiredEmailEnvVars = [
    env.SMTP_HOST,
    env.SMTP_PORT,
    env.SMTP_USER,
    env.SMTP_PASSWORD,
    env.EMAIL_SENDER
  ];
  const canSendEmails = requiredEmailEnvVars.every((value) => !!value);

  const requiredAdminEnvVars = [
    env.POCKETBASE_SUPERUSER_EMAIL,
    env.POCKETBASE_SUPERUSER_PASSWORD,
  ]
  const canPerformPBAdminActions = requiredAdminEnvVars.every((value) => !!value);

  return {
    canSendEmails,
    canPerformPBAdminActions,
    canTransferTimesheets: canSendEmails && canPerformPBAdminActions,
    canShareTimesheets: canSendEmails && canPerformPBAdminActions,
    hasFullSetup: canSendEmails && canPerformPBAdminActions,
  }
}

export type DomainConfig = ReturnType<typeof getDomainConfig>;
