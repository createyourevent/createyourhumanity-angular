import dayjs from 'dayjs/esm';

export interface IKeyTable {
  id?: string;
  key?: string | null;
  created?: dayjs.Dayjs | null;
  modified?: dayjs.Dayjs | null;
}

export class KeyTable implements IKeyTable {
  constructor(public id?: string, public key?: string | null, public created?: dayjs.Dayjs | null, public modified?: dayjs.Dayjs | null) {}
}

export function getKeyTableIdentifier(keyTable: IKeyTable): string | undefined {
  return keyTable.id;
}
