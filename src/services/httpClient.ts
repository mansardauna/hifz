export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

class HttpClient {
  private baseUrl: string;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }

  private buildUrl(path: string, params?: Record<string, string | number | boolean | undefined>): string {
    const url = new URL(path, typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    return url.pathname + url.search;
  }

  private getAuthToken(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('hifz_token');
    }
    return null;
  }

  async request<T = any>(path: string, options: RequestOptions = {}): Promise<T> {
    const { params, headers = {}, ...rest } = options;
    const url = this.buildUrl(path, params);

    const token = this.getAuthToken();
    const reqHeaders: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    };

    const response = await fetch(url, {
      ...rest,
      headers: reqHeaders,
    });

    const isJson = response.headers.get('content-type')?.includes('application/json');
    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      const errorMessage =
        (data && typeof data === 'object' && (data.error || data.message)) ||
        `Request failed with status ${response.status}`;
      throw new ApiError(errorMessage, response.status, data);
    }

    return data;
  }

  get<T = any>(path: string, params?: Record<string, string | number | boolean | undefined>): Promise<T> {
    return this.request<T>(path, { method: 'GET', params });
  }

  post<T = any>(path: string, body?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    });
  }

  put<T = any>(path: string, body?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    });
  }

  delete<T = any>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, { method: 'DELETE', ...options });
  }
}

export const apiClient = new HttpClient();
export default apiClient;
