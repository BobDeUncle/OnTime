import Jobsite from '../Jobsite';
import User, { Role } from '../User';

export class UserDomain implements User {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    roles: Role[];
    jobsites: Jobsite[];
  
    constructor(user: User) {
      this._id = user._id;
      this.email = user.email;
      this.firstName = user.firstName;
      this.lastName = user.lastName;
      this.roles = user.roles;
      this.jobsites = user.jobsites;
    }
  
    getIsSupervisor(): boolean {
      return this.roles.some((role) => role.name === 'supervisor');
    }
  
    getIsEmployee(): boolean {
      return this.roles.some((role) => role.name === 'employee');
    }
  
    getIsAdmin(): boolean {
      return this.roles.some((role) => role.name === 'admin');
    }
  
    getSupervisorJobsitePermission(jobsiteId: string): boolean {
      return this.getIsSupervisor() && this.jobsites.some((j) => j._id == jobsiteId);
    }
  
    getEmployeeUpdatePermission(createdByUserId: string): boolean {
      return this.getIsEmployee() && this._id == createdByUserId;
    }
  
    getUserTimeRecordPermission(jobsiteId: string, createdByUserId: string) {
      return (
        this.getIsAdmin() ||
        this.getSupervisorJobsitePermission(jobsiteId) ||
        this.getEmployeeUpdatePermission(createdByUserId)
      );
    }
  
    getUserTimesheetPermission(createdByUserId: string) {
      return this.getIsAdmin() || this.getEmployeeUpdatePermission(createdByUserId);
    }
  }
  