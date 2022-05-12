import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';

export interface IFriends {
  id?: string;
  connectDate?: dayjs.Dayjs | null;
  friendId?: string | null;
  user?: IUser | null;
}

export class Friends implements IFriends {
  constructor(public id?: string, public connectDate?: dayjs.Dayjs | null, public friendId?: string | null, public user?: IUser | null) {}
}

export function getFriendsIdentifier(friends: IFriends): string | undefined {
  return friends.id;
}
