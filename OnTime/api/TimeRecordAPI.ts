import TimeRecord from '../models/TimeRecord';
import APIClient from './APIClient';

class TimeRecordAPI {
  private client: APIClient;

  constructor(client: APIClient) {
    this.client = client;
  }

  public async getAllTimeRecords(): Promise<TimeRecord[]> {
    return await this.client.get('/time-records');
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
}

export default TimeRecordAPI;
