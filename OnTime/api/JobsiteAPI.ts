import Jobsite from '../models/Jobsite';
import JobsiteWithSupervisor from '../models/JobsiteWithSupervisor';
import APIClient from './APIClient';

class JobsiteAPI {
  private client: APIClient;

  constructor(client: APIClient) {
    this.client = client;
  }

  public async getAllJobsites(params?: { name?: string, city?: string }): Promise<Jobsite[]> {
    console.log('GET', '/jobsites', params);
    return await this.client.get('/jobsites', params);
  }

  public async getJobsiteById(id: string): Promise<Jobsite> {
    return await this.client.get(`/jobsites/${id}`);
  }

  public async getJobsitesWithSupervisors(id: string): Promise<JobsiteWithSupervisor> {
    return await this.client.get(`/jobsites/${id}/user`);
  }

  public async addJobsite(jobsite: any) {
    return await this.client.post('/jobsites', jobsite);
  }

  public async updateJobsite(id: string, jobsite: any) {
    return await this.client.patch(`/jobsites/${id}`, jobsite);
  }

  public async deleteJobsite(id: string) {
    return await this.client.delete(`/jobsites/${id}`);
  }

  public async addSupervisor(jobsiteId: string, userId: string) {
    return await this.client.post(`/jobsites/${jobsiteId}/user/${userId}`, {});
  }

  public async removeSupervisor(jobsiteId: string, userId: string) {
    return await this.client.delete(`/jobsites/${jobsiteId}/user/${userId}`);
  }
}

export default JobsiteAPI;
