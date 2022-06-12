import { Model } from "app/search/search-by-user/search-by-user.component";
import { IFormulaData } from "../formula-data/formula-data.model";
import { IFriends } from "../friends/friends.model";

export interface IUser {
  id?: string;
  login?: string;
  firstName?: string | null,
  lastName?: string | null,
  imageUrl?: string | null,
  formulaData?: IFormulaData
  friends?: IFriends[];
  model?: Model[];
}

export class User implements IUser {
  constructor(public id: string, public login: string, public firstName: string | null, public lastName: string | null, public imageUrl: string | null, public formulaData: IFormulaData, public model: Model[], friends?: IFriends[]) {
    this.model = [];
  }
}

export function getUserIdentifier(user: IUser): string | undefined {
  return user.id;
}
