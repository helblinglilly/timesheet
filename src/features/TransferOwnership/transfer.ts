'use server';

import { addMinutes } from 'date-fns';
import type Client from 'pocketbase';
import { v4 as uuidv4 } from 'uuid';
import { env } from '~/env';
import { createTranslation } from '~/i18n/server';
import type { TimesheetTransferRequest } from '~/pocketbase/data.types';
import { TableNames } from '~/pocketbase/tables.types';
import { sendEmail } from '~/utils/email';

export async function inviteOwnership(pb: Client, {
  timesheetId,
  timesheetName,
  email
}: {
  timesheetId: string,
  timesheetName: string,
  email: string
}){
  const transferCode = uuidv4();
  const expiryTime = addMinutes(new Date(), 15);
  const { t } = await createTranslation('translation');

  try {
    const existing = await pb.collection<TimesheetTransferRequest>(TableNames.TimesheetTransferRequests).getFirstListItem(
      `user_email = "${email.toLowerCase()}"`
    )

    await pb.collection(TableNames.TimesheetTransferRequests).delete(existing.id);
  } catch {
    // Either none exist, or the removal call has failed. Let's see what .create will do
  }

  await pb.collection(TableNames.TimesheetTransferRequests).create({
    timesheet: timesheetId,
    user_email: email,
    transfer_code: transferCode,
    expires_at: expiryTime.toISOString()
  })

  await sendEmail({
    to: email,
    subject: t('timesheet.[id].transfer.transfer_email.subject', { name: timesheetName }),
    html: t('timesheet.[id].transfer.transfer_email.body', {
      name: timesheetName,
      link: `${env.NEXT_PUBLIC_HOST}/transfer/${transferCode}`
    }),
  })
}
