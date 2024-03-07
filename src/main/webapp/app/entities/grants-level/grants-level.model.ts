import dayjs from 'dayjs/esm';
import { IUser } from '../user/user.model';

export interface IGrantsLevel {
  id?: string;
  map?: string | null;
  created?: dayjs.Dayjs | null;
  modified?: dayjs.Dayjs | null;
  user? : IUser | null;
}

export class GrantsLevel implements IGrantsLevel {
  constructor(public id?: string, public map?: string | null, public created?: dayjs.Dayjs | null, public modified?: dayjs.Dayjs | null, public user?: IUser | null) {}
}

export function getGrantsLevelIdentifier(grantsLevel: IGrantsLevel): string | undefined {
  return grantsLevel.id;
}
