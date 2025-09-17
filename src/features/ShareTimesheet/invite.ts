'use server';

import { addMinutes } from 'date-fns';
import type Client from 'pocketbase';
import { v4 as uuidv4 } from 'uuid';
import { env } from '~/env';
import { createTranslation } from '~/i18n/server';
import { TableNames } from '~/pocketbase/tables.types';
import { sendEmail } from '~/utils/email';

export async function inviteUser(pb: Client, {
  timesheetId,
  timesheetName,
  email
}: {
  timesheetId: string,
  timesheetName: string,
  email: string
}){
  const inviteCode = uuidv4();
  const expiryTime = addMinutes(new Date(), 15);
  const { t } = await createTranslation('translation');

  await pb.collection(TableNames.TimesheetShares).create({
    timesheet: timesheetId,
    user_email: email,
    invite_code: inviteCode,
    expires_at: expiryTime.toISOString()
  })

  await sendEmail({
    to: email,
    subject: t('timesheet.[id].share.invite_email.subject', { name: timesheetName }),
    html: t('timesheet.[id].share.invite_email.body', {
      name: timesheetName,
      link: `${env.NEXT_PUBLIC_HOST}/invite/${inviteCode}`
    }),
  })
}
