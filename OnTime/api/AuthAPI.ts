// import Auth from '../models/Auth';
import APIClient from './APIClient';

class AuthAPI {
  private client: APIClient;

  constructor(client: APIClient) {
    this.client = client;
  }

  public async addAuth(auth: any) {
    return await this.client.post('/auth/signin', auth);
  }
}

export default AuthAPI;
