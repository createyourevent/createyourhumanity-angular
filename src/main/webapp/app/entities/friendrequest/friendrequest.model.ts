import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';

export interface IFriendrequest {
  id?: string;
  requestDate?: dayjs.Dayjs | null;
  requestUserId?: string | null;
  info?: string | null;
  user?: IUser | null;
}

export class Friendrequest implements IFriendrequest {
  constructor(
    public id?: string,
    public requestDate?: dayjs.Dayjs | null,
    public requestUserId?: string | null,
    public info?: string | null,
    public user?: IUser | null
  ) {}
}

export function getFriendrequestIdentifier(friendrequest: IFriendrequest): string | undefined {
  return friendrequest.id;
}
