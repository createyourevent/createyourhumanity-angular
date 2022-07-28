import { Model } from "app/search/search-by-user/search-by-user.component";
import { IFormulaData } from "../formula-data/formula-data.model";
import { IFriends } from "../friends/friends.model";
import { Group } from "../group/group.model";

export interface IUser {
  id?: string;
  login?: string;
  firstName?: string | null,
  lastName?: string | null,
  imageUrl?: string | null,
  description?: string;
  formulaData?: IFormulaData
  friends?: IFriends[];
  model?: Model[];
  groups?: Group[];
}

export class User implements IUser {
  constructor(public id: string, public login: string, public firstName: string | null, public lastName: string | null, public imageUrl: string | null, public description: string, public formulaData: IFormulaData, public model: Model[],public friends?: IFriends[], public groups?: Group[]) {
    this.model = [];
  }
}

export function getUserIdentifier(user: IUser): string | undefined {
  return user.id;
}
