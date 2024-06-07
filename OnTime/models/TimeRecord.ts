import Jobsite from './Jobsite';
import User from './User';

interface TimeRecord {
  _id: string;
  employee: User;
  date: Date;
  startTime: Date,
  endTime: Date,
  breakHours: number,
  jobsite: Jobsite;
  recordTotalHours: number;
  status: Status;
  recordType: RecordType;
  notes: string;
}

export enum Status {
  approved = 'approved',
  pending = 'pending',
  denied = 'denied',
}

export enum RecordType {
  hoursWorked = 'hoursWorked',
  annualLeave = 'annualLeave',
  sickLeave = 'sickLeave'
}

export default TimeRecord;
