interface Role {
  _id: string;
  name: string;
}

export interface CustomJwtPayload {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: Role[];
}

