// import Auth from '../models/Auth';
import User from '../models/User';
import APIClient from './APIClient';

interface AuthData {
  token: string;
}

class AuthAPI {
  private client: APIClient;

  constructor(client: APIClient) {
    this.client = client;
  }

  public async addAuth(auth: any): Promise<AuthData> {
    return await this.client.post('/auth/signin', auth);
  }

  public async forgotPassword(auth: any): Promise<AuthData> {
    return await this.client.post('/auth/forgotpassword', auth);
  }
}

export default AuthAPI;
