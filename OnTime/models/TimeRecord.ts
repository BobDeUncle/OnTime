import Jobsite from './Jobsite';
import User from './User';

interface TimeRecord {
  _id: string;
  employee: User;
  date: Date;
  jobsite: Jobsite;
}

export default TimeRecord;
