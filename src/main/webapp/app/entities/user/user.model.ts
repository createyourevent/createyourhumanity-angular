export interface IUser {
  id?: string;
  login?: string;
  firstName?: string | null,
  lastName?: string | null,
  imageUrl?: string | null
}

export class User implements IUser {
  constructor(public id: string, public login: string, public firstName: string | null, public lastName: string | null, public imageUrl: string | null) {}
}

export function getUserIdentifier(user: IUser): string | undefined {
  return user.id;
}
