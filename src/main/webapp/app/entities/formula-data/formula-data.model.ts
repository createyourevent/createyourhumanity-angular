import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';

export interface IFormulaData {
  id?: string;
  map?: string | null;
  grant?: string | null;
  visible?: string | null;
  created?: dayjs.Dayjs | null;
  modified?: dayjs.Dayjs | null;
  user?: IUser | null;
}

export class FormulaData implements IFormulaData {
  constructor(
    public id?: string,
    public map?: string | null,
    public grant?: string | null,
    public visible?: string | null,
    public created?: dayjs.Dayjs | null,
    public modified?: dayjs.Dayjs | null,
    public user?: IUser | null
  ) {}
}

export function getFormulaDataIdentifier(formulaData: IFormulaData): string | undefined {
  return formulaData.id;
}
