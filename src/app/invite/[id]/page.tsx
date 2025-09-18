'use server';

import { isBefore } from 'date-fns';
import { redirect } from 'next/navigation';
import { createTranslation } from '~/i18n/server';
import { type TimesheetConfig, type TimesheetShare } from '~/pocketbase/data.types';
import { serverSideAuth, superuserAuth } from '~/pocketbase/server';
import { TableNames } from '~/pocketbase/tables.types';
import log from '~/utils/log';

export default async function InviteRedemption(
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  },
) {
  const { t } = await createTranslation();
  const { id } = await params;

  const pb = await serverSideAuth();

  if (!pb.authStore.isValid) {
    redirect(`/auth/login?redirect_uri=/invite/${id}`);
  }

  try {
    if (!pb.authStore.record){
      throw new Error('Did not have an authStore model')
    }

    const invite = await pb.collection<TimesheetShare>(TableNames.TimesheetShares).getFirstListItem(`invite_code="${id}"`);
    const expiryDate = new Date(invite.expires_at);

    if (isBefore(expiryDate, new Date())){
      return (<div>
        <p>{ t('timesheet.[id].share.redemption.expired') }</p>
      </div>)
    }

    const superuserPb = await superuserAuth();
    const timesheetConfig = await superuserPb.collection<TimesheetConfig>(TableNames.TimesheetConfig).getFirstListItem(`id="${invite.timesheet}"`);


    if (!timesheetConfig){
      throw new Error('Failed to get timesheet config after trying to accept invite')
    }

    if (timesheetConfig.sharedUsers.includes(pb.authStore.record.id)){
      throw new Error('This timesheet is already shared with this user');
    }

    if (timesheetConfig.user === pb.authStore.record.id){
      throw new Error('This timesheet is owned by the account that wants to accept the invite');
    }

    await superuserPb.collection(TableNames.TimesheetConfig).update(invite.timesheet, {
      sharedUsers: [
        ...new Set([
          ...timesheetConfig.sharedUsers,
          pb.authStore.record.id
        ])
      ]
    })

    await pb.collection(TableNames.TimesheetShares).delete(invite.id);

    redirect('/dashboard');

  } catch(err){
    // @ts-expect-error Don't care
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    if (err?.digest?.startsWith('NEXT_REDIRECT')) {
      throw err;
    }

    log.error('Redeeming an invite', err);

    return (
      <div>
        <p>{ t('timesheet.[id].share.redemption.error') }</p>
      </div>
    )
  }

  return (
    <div>
      <p>{ t('timesheet.[id].share.redemption.loading') }</p>
    </div>
  )
}
