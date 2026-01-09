import type { RecordAuthResponse, RecordModel } from 'pocketbase';
import type { PBAuthResponse } from './builtin.types';

export function authDataToCookie(
  authData: PBAuthResponse | RecordAuthResponse<RecordModel>,
) {
  const avatar = `${authData.meta?.avatarUrl ?? authData.record.avatar}`;
  const name = `${authData.meta?.name}`;

  return {
    token: authData.token,
    record: {
      id: authData.record.id,
      email: `${authData.record.email}`,
      avatar,
      name,
    },
  };
}
