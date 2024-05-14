import Jobsite from './Jobsite';

export interface Role {
  _id: string;
  name: string;
}

interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: Role[];
  jobsites: Jobsite[]
}

export default User;
