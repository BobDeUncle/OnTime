import AsyncStorage from '@react-native-async-storage/async-storage';

// Helper function to convert an object to a query string
function objectToQueryString(obj: any) {
  return Object.keys(obj)
    .map(key => Array.isArray(obj[key])
      ? obj[key].map((value: string | number | boolean) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&')
      : `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
    .join('&');
}

class APIClient {
  private baseURL: string;
  private onAuthFailure: () => void;

  constructor(onAuthFailure: () => void) {
    this.baseURL = 'https://ontime-express.vercel.app/api/v1';
    this.onAuthFailure = onAuthFailure;
  }

  private async request<T>(
    url: string,
    method: string,
    body?: any,
    params?: any,
  ): Promise<T> {
    // Convert params object to a query string
    const queryString = params ? '?' + objectToQueryString(params) : '';

    // Retrieve the userToken from AsyncStorage
    const userToken = await AsyncStorage.getItem('userToken');

    const response = await fetch(`${this.baseURL}${url}${queryString}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(userToken ? { Authorization: `Bearer ${userToken}` } : {}),
      },
      body: method !== 'GET' ? JSON.stringify(body) : undefined,
    });

    // Check if the token is no longer valid and handle it
    if (response.status === 401) {
      await AsyncStorage.removeItem('userToken');  // Remove the token
      this.onAuthFailure();  // Invoke the authentication failure handler
      throw new Error('Session expired. Please log in again.');
    }

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  }

  // Public methods to access the API endpoints
  public async get<T>(url: string, params?: any): Promise<T> {
    return await this.request<T>(url, 'GET', undefined, params);
  }

  public async post<T>(url: string, body: any): Promise<T> {
    return await this.request<T>(url, 'POST', body);
  }

  public async patch<T>(url: string, body: any): Promise<T> {
    return await this.request<T>(url, 'PATCH', body);
  }

  public async delete<T>(url: string): Promise<T> {
    return await this.request<T>(url, 'DELETE');
  }
}

export default APIClient;
