import Jobsite from './Jobsite';
import User from './User';

interface TimeRecord {
  _id: string;
  employee: User;
  date: Date;
  startTime: Date,
  endTime: Date,
  jobsite: Jobsite;
  recordTotalHours: number;
  status: Status;
}

export enum Status {
  approved = 'approved',
  pending = 'pending',
  denied = 'denied',
}

export default TimeRecord;
