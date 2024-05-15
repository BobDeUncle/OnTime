import Role from './Role';

interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: Role[];
}

export default User;
