import Jobsite from '../models/Jobsite';
import APIClient from './APIClient';

class JobsiteAPI {
  private client: APIClient;

  constructor(client: APIClient) {
    this.client = client;
  }

  public async getAllJobsites(): Promise<Jobsite[]> {
    return await this.client.get('/jobsites');
  }

  public async getJobsiteById(id: string): Promise<Jobsite> {
    return await this.client.get(`/jobsites/${id}`);
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
}

export default JobsiteAPI;
