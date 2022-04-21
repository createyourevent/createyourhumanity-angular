import dayjs from 'dayjs/esm';

export interface IMindmap {
  id?: string;
  text?: string | null;
  modified?: dayjs.Dayjs | null;
}

export class Mindmap implements IMindmap {
  constructor(public id?: string, public text?: string | null, public modified?: dayjs.Dayjs | null) {}
}

export function getMindmapIdentifier(mindmap: IMindmap): string | undefined {
  return mindmap.id;
}
