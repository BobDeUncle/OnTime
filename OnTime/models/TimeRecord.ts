import Jobsite from './Jobsite';
import User from './User';

interface TimeRecord {
  _id: string;
  employee: User;
  startDate: Date;
  endDate: Date;
  jobsite: Jobsite;
}

export default TimeRecord;
