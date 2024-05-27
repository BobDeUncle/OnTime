import Role from '../models/Role';
import APIClient from './APIClient';

class RoleAPI {
  private client: APIClient;

  constructor(client: APIClient) {
    this.client = client;
  }

  public async getAllRoles(): Promise<Role[]> {
    console.log('GET', '/roles');
    return await this.client.get('/roles');
  }

  public async createRole(role: any): Promise<Role[]> {
    return await this.client.post('/roles', role);
  }

  public async updateRole(id: string, role: any) {
    return await this.client.patch(`/roles/${id}`, role);
  }

  public async deleteRole(id: string) {
    return await this.client.delete(`/roles/${id}`);
  }
}

export default RoleAPI;
