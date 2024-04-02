class APIClient {
  private baseURL: string;

  constructor() {
    this.baseURL =
      'https://ontime-express-sb8zie7p0-hannahgmaccas-projects.vercel.app/api/v1';
  }

  private async request<T>(
    url: string,
    method: string,
    body?: any,
  ): Promise<T> {
    const response = await fetch(`${this.baseURL}${url}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        // TODO: Add auth header
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  }

  public async get<T>(url: string): Promise<T> {
    return await this.request<T>(url, 'GET');
  }

  public async post<T>(url: string, body: any): Promise<T> {
    console.log(url);
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