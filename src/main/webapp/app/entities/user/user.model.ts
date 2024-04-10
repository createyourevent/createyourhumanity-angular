import { Grants } from "app/core/enums/grants";

export interface IUser {
  id?: string;
  login?: string;
  firstName?: string | null,
  lastName?: string | null,
  imageUrl?: string | null,
  formData?: string | null,
  grants?: string | null,
}

export class User implements IUser {
  constructor(public id: string, public login: string, public firstName: string | null, public lastName: string | null, public imageUrl: string | null, public formData: string | null, public grants: string | null) {
    this.id = id? id : "";
    this.login = login? login : "";
    this.firstName = firstName? firstName : "";
    this.lastName = lastName? lastName : "";
    this.imageUrl = imageUrl? imageUrl : "";
    this.formData = formData? formData : "";
    this.grants = grants? grants : "";
  }
}

export function getUserIdentifier(user: IUser): string | undefined {
  return user.id;
}
