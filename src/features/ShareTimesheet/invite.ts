'use server';

import { addMinutes } from 'date-fns';
import type Client from 'pocketbase';
import { v4 as uuidv4 } from 'uuid';
import { env } from '~/env';
import { createTranslation } from '~/i18n/server';
import { type User, type TimesheetConfig, type TimesheetShare } from '~/pocketbase/data.types';
import { superuserAuth } from '~/pocketbase/server';
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
}) {
  const inviteCode = uuidv4();
  const expiryTime = addMinutes(new Date(), 15);
  const { t } = await createTranslation('translation');

  try {
    const existing = await pb.collection<TimesheetShare>(TableNames.TimesheetShares).getFirstListItem(
      `user_email = "${email.toLowerCase()}"`
    )

    await pb.collection(TableNames.TimesheetShares).delete(existing.id);
  } catch {
    // Either none exist, or the removal call has failed. Let's see what .create will do
  }

  await pb.collection(TableNames.TimesheetShares).create({
    timesheet: timesheetId,
    user_email: email.toLowerCase(),
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

export async function removeUserAccess(pb: Client, {
  timesheetConfigId,
  sharedUserId
}: {
  timesheetConfigId: string;
  sharedUserId: string;
}){
  const existingConfg = await pb.collection<TimesheetConfig>(TableNames.TimesheetConfig).getOne(timesheetConfigId);

  if (!existingConfg.sharedUsers || existingConfg.sharedUsers.length === 0){
    return;
  }

  await pb.collection(TableNames.TimesheetConfig).update(timesheetConfigId, {
    sharedUsers: existingConfg.sharedUsers.filter((user) => user !== sharedUserId)
  })
}

export async function getAllSharedUsers(pb: Client, {
  timesheetConfigId,
}: {
  timesheetConfigId: string;
}){
  const result = await pb.collection<TimesheetConfig>(TableNames.TimesheetConfig).getOne(timesheetConfigId)

  const superuser = await superuserAuth();

  const filterString = result.sharedUsers.map((user) => `id="${user}"`).join(' || ');

  /**
   * This is dirty
   * Users aren't meant to be query-able and this works around the emailVisibility field in PB
   *
   * At this point though, a user wil have accepted an invite from another user, effectively
   * expressing consent that their Email can be shared.
   * To help the timesheet owners manage other users vs their own alt accounts (i.e. work account)
   * it's helpful for them to see the profile name + email in the list.
   */
  const users = await superuser.collection<User>(TableNames.User).getList(1, 10, {
    filter: filterString
  })

  return users.items.map((user) => {
    const [identifier, domain] = user.email.split('@');

    const maskedIdentifier = (identifier ?? '').slice(0, 3) + '*'.repeat((identifier?.length ?? 0) - 3);

    return {
      id: user.id,
      email: `${maskedIdentifier}@${domain}`,
      name: user.name
    }
  })
}
