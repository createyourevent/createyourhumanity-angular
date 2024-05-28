import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';

export interface IFormulaData {
  id?: string;
  map?: { [key: string]: string };
  created?: dayjs.Dayjs | null;
  modified?: dayjs.Dayjs | null;
  user?: IUser | null;
}

export class FormulaData implements IFormulaData {
  constructor(
    public id?: string,
    public map?: { [key: string]: string },
    public created?: dayjs.Dayjs | null,
    public modified?: dayjs.Dayjs | null,
    public user?: IUser | null
  ) {}
}

export function getFormulaDataIdentifier(formulaData: IFormulaData): string | undefined {
  return formulaData.id;
}
