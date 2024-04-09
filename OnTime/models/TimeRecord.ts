import Jobsite from './Jobsite';
import User from './User';

interface TimeRecord {
  approvalStatus: string;
  _id: string;
  employee: User;
  date: Date;
  startTime: Date,
  endTime: Date,
  jobsite: Jobsite;
}

export default TimeRecord;
