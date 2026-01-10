'use server';

import { isBefore } from 'date-fns';
import { redirect } from 'next/navigation';
import { createTranslation } from '~/i18n/server';
import { type TimesheetConfig, type TimesheetTransferRequest } from '~/pocketbase/data.types';
import { serverSideAuth, superuserAuth } from '~/pocketbase/server';
import { TableNames } from '~/pocketbase/tables.types';
import log from '~/utils/log';

export default async function TransferRedemption(
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
    redirect(`/auth/login?redirect_uri=/transfer/${id}`);
  }

  try {
    if (!pb.authStore.record){
      throw new Error('Did not have an authStore model')
    }
    if (typeof pb.authStore.record.email !== 'string') {
      throw new Error('PB Auth store email was not a string')
    }

    // Ensure the person redeeming is the person that was nominated - Email not forwarded
    const transferRequest = await pb.collection<TimesheetTransferRequest>(TableNames.TimesheetTransferRequests).getFirstListItem(`transfer_code="${id}"`);
    if (transferRequest.user_email.toLowerCase() !== pb.authStore.record.email.toLowerCase()) {
      throw new Error('Tried to redeem code that was sent to another user');
    }

    // Check Expiry
    const expiryDate = new Date(transferRequest.expires_at);
    if (isBefore(expiryDate, new Date())){
      return (<div>
        <p>{ t('timesheet.[id].transfer.redemption.expired') }</p>
      </div>)
    }

    // Get existing timesheet
    const superuserPb = await superuserAuth();
    const timesheetConfig = await superuserPb.collection<TimesheetConfig>(TableNames.TimesheetConfig).getFirstListItem(`id="${transferRequest.timesheet}"`);
    const previousOwner = timesheetConfig.user;
    if (!timesheetConfig){
      throw new Error('Failed to get timesheet config after trying to accept invite')
    }

    if (previousOwner === pb.authStore.record.id) {
      throw new Error('The timesheet is already owned by the person trying to accept a transfer')
    }

    // Update
    await superuserPb.collection(TableNames.TimesheetConfig).update(transferRequest.timesheet, {
      owner: pb.authStore.record.id,
      sharedUsers: timesheetConfig.sharedUsers
        .filter((sharedUser) => sharedUser !== pb.authStore.record?.id)
        .filter((sharedUser) => sharedUser !== previousOwner)
        .concat(previousOwner)
    })

    await pb.collection(TableNames.TimesheetTransferRequests).delete(transferRequest.id);

    redirect(`/timesheet/${timesheetConfig.id}?transfer_success=true`);

  } catch(err){
    // @ts-expect-error Don't care
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    if (err?.digest?.startsWith('NEXT_REDIRECT')) {
      throw err;
    }

    log.error('Redeeming a transfer code', err);

    return (
      <div>
        <p>{ t('timesheet.[id].transfer.redemption.error') }</p>
      </div>
    )
  }

  return (
    <div>
      <p>{ t('timesheet.[id].transfer.redemption.loading') }</p>
    </div>
  )
}
