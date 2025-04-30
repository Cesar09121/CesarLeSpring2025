export const API_ROOT = import.meta.env.VITE_API_ROOT ?? '/api/v1/';

export interface RequestOptions {
  method?: string;
  body?: any;
  headers?: HeadersInit;
}

export function rest<T>(url: string, options: RequestOptions = {}): Promise<T> {
  const fetchOptions: RequestInit = {
    method: options.method ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  if (options.body) {
    fetchOptions.body = JSON.stringify(options.body);
  }

  return fetch(url, fetchOptions).then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  });
}

export function api<T>(action: string, options: RequestOptions = {}): Promise<T> {
  return rest<T>(`${API_ROOT}${action}`, options);
}