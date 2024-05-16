import User from '../models/User';
import APIClient from './APIClient';

class UserAPI {
  private client: APIClient;

  constructor(client: APIClient) {
    this.client = client;
  }

  public async getAllUsers(params?: { firstName?: string, lastName?: string, email?: string }): Promise<User[]> {
    console.log('GET', '/users', params);
    return await this.client.get('/users', params);
  }

  public async createUser(user: any): Promise<User[]> {
    return await this.client.post('/users', user);
  }

  public async updateUser(id: string, user: any) {
    return await this.client.patch(`/users/${id}`, user);
  }

  public async deleteUser(id: string) {
    return await this.client.delete(`/users/${id}`);
  }
}

export default UserAPI;
