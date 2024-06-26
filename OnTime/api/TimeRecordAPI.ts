import TimeRecord from '../models/TimeRecord';
import { StatsInitialViewModel } from '../screens/DashboardScreen';
import APIClient from './APIClient';

class TimeRecordAPI {
  private client: APIClient;

  constructor(client: APIClient) {
    this.client = client;
  }

  public async getAllTimeRecords(params?: { startDate?: string, endDate?: string, employees?: string, jobsites?: string[], status?: string, export?: boolean, recordType?: string}): Promise<TimeRecord[]> {
    console.log('GET', '/time-records', params);
    return await this.client.get('/time-records', params );
  }

  public async getTimeRecordById(id: string): Promise<TimeRecord> {
    return await this.client.get(`/time-records/${id}`);
  }

  public async addTimeRecord(timeRecord: any) {
    return await this.client.post('/time-records', timeRecord);
  }

  public async updateTimeRecord(id: string, timeRecord: any) {
    return await this.client.patch(`/time-records/${id}`, timeRecord);
  }

  public async deleteTimeRecord(id: string) {
    return await this.client.delete(`/time-records/${id}`);
  }

  public async getDashboardStats(employeeId: string): Promise<StatsInitialViewModel> {
    return await this.client.get(`/time-records/stats/employee/${employeeId}`);
  }
}

export default TimeRecordAPI;
