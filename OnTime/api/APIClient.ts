import AsyncStorage from '@react-native-async-storage/async-storage';

function objectToQueryString(obj: any) {
  return Object.keys(obj)
    .map(key => Array.isArray(obj[key])
      ? obj[key].map((value: string | number | boolean) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&')
      : `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
    .join('&');
}

class APIClient {
  private baseURL: string;

  constructor() {
    this.baseURL =
      'https://ontime-express.vercel.app/api/v1';
  }

  private async request<T>(
    url: string,
    method: string,
    body?: any,
    params?: any,
  ): Promise<T> {
    // Convert params object to query string
    const queryString = params ? '?' + objectToQueryString(params.params) : '';

    if (params) console.log('url: ', `${this.baseURL}${url}${queryString}`);

    // Retrieve the userToken from AsyncStorage
    const userToken = await AsyncStorage.getItem('userToken');

    const response = await fetch(`${this.baseURL}${url}${queryString}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(userToken ? {Authorization: `Bearer ${userToken}`} : {}),
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  }

  public async get<T>(url: string, params?: any): Promise<T> {
    console.log('GET: ', url);
    return await this.request<T>(url, 'GET', undefined, params);
  }

  public async post<T>(url: string, body: any): Promise<T> {
    console.log('POST: ', url);
    return await this.request<T>(url, 'POST', body);
  }

  public async patch<T>(url: string, body: any): Promise<T> {
    return await this.request<T>(url, 'PATCH', body);
  }

  public async delete<T>(url: string): Promise<T> {
    console.log('DELETE: ', url);
    return await this.request<T>(url, 'DELETE');
  }
}

export default APIClient;
