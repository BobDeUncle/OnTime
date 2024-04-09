import User from '../models/User';
import APIClient from './APIClient';

class UserAPI {
  private client: APIClient;

  constructor(client: APIClient) {
    this.client = client;
  }

  public async getAllUsers(): Promise<User[]> {
    return await this.client.get('/users');
  }

  public async getUserMe(): Promise<User> {
    return await this.client.get(`/users/me`);
  }

  public async updateUser(id: string, timeRecord: any) {
    return await this.client.patch(`/users/${id}`, timeRecord);
  }

  public async deleteUser(id: string) {
    return await this.client.delete(`/users/${id}`);
  }
}

export default UserAPI;
