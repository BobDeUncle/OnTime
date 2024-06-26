import Auth from '../models/Auth';
import User from '../models/User';
import APIClient from './APIClient';

interface AuthData {
  token: string;
  user?: User;
}

class AuthAPI {
  private client: APIClient;

  constructor(client: APIClient) {
    this.client = client;
  }

  public async addAuth(auth: { email: string; password: string }): Promise<AuthData> {
    return await this.client.post<AuthData>('/auth/signin', auth);
  }

  public async forgotPassword(auth: any): Promise<AuthData> {
    return await this.client.post('/auth/forgotpassword', auth);
  }

  public async resetPassword(auth: any): Promise<AuthData> {
    console.log('/auth/resetpassword', auth);
    return await this.client.post('/auth/resetpassword', auth);
  }

  public async updatePassword(auth: any): Promise<AuthData> {
    console.log('/auth/updatepassword', auth);
    return await this.client.post('/auth/updatepassword', auth);
  }
}

export default AuthAPI;
