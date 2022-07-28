import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';

export interface IGroup {
  id?: string;
  name?: string | null;
  created?: dayjs.Dayjs | null;
  owner?: IUser | null;
  users?: IUser[] | null;
}

export class Group implements IGroup {
  constructor(public id?: string, public name?: string | null, public created?: dayjs.Dayjs | null, public owner?: IUser | null, public users?: IUser[] | null) {
    this.users = [];
  }
}

export function getGroupIdentifier(group: IGroup): string | undefined {
  return group.id;
}
