import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';

export interface IUserMindmap {
  id?: string;
  text?: string | null;
  modified?: dayjs.Dayjs | null;
  user?: IUser | null;
}

export class UserMindmap implements IUserMindmap {
  constructor(public id?: string, public text?: string | null, public modified?: dayjs.Dayjs | null, public user?: IUser | null) {}
}

export function getUserMindmapIdentifier(userMindmap: IUserMindmap): string | undefined {
  return userMindmap.id;
}
