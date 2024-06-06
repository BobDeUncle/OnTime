import Jobsite from './Jobsite';
import User from './User';

interface JobsiteWithSupervisors {
  jobsite: Jobsite;
  supervisors: User[];
}

export default JobsiteWithSupervisors;
