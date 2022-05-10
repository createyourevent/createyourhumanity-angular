import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';

export interface IUserDetails {
  id?: string;
  dob?: dayjs.Dayjs | null;
  created?: dayjs.Dayjs | null;
  modified?: dayjs.Dayjs | null;
  user?: IUser | null;
}

export class UserDetails implements IUserDetails {
  constructor(
    public id?: string,
    public dob?: dayjs.Dayjs | null,
    public created?: dayjs.Dayjs | null,
    public modified?: dayjs.Dayjs | null,
    public user?: IUser | null
  ) {}
}

export function getUserDetailsIdentifier(userDetails: IUserDetails): string | undefined {
  return userDetails.id;
}
