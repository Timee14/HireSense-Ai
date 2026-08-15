const getApiBaseUrl = () => {
  const host = typeof window !== 'undefined' && window.location.hostname ? window.location.hostname : '127.0.0.1';
  return `http://${host}:8000/api/v1`;
};

export const getToken = (): string | null => localStorage.getItem('hiresense_token');
export const setToken = (token: string) => localStorage.setItem('hiresense_token', token);
export const removeToken = () => localStorage.removeItem('hiresense_token');

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const baseUrl = getApiBaseUrl();
  let response: Response;
  try {
    response = await fetch(`${baseUrl}${endpoint}`, {
      ...options,
      headers,
    });
  } catch (err: any) {
    response = await fetch(`http://127.0.0.1:8000/api/v1${endpoint}`, {
      ...options,
      headers,
    });
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'API Request Failed' }));
    throw new Error(errorData.detail || `Error ${response.status}`);
  }

  return response.json();
}

export async function uploadFile<T>(endpoint: string, file: File): Promise<T> {
  const token = getToken();
  const formData = new FormData();
  formData.append('file', file);

  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const baseUrl = getApiBaseUrl();
  let response: Response;
  try {
    response = await fetch(`${baseUrl}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
    });
  } catch (err) {
    response = await fetch(`http://127.0.0.1:8000/api/v1${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
    });
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'File upload failed' }));
    throw new Error(errorData.detail || `Error ${response.status}`);
  }

  return response.json();
}
