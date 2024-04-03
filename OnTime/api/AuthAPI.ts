// import Auth from '../models/Auth';
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
}

export default AuthAPI;
