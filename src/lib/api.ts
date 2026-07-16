const BASE_URL = 'http://localhost:8080';

export const getAuthToken = () => localStorage.getItem('bank_token');
export const setAuthToken = (token: string) => localStorage.setItem('bank_token', token);
export const removeAuthToken = () => localStorage.removeItem('bank_token');

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, { 
      cache: 'no-store',
      ...options, 
      headers 
    });
    let data;
    
    // Handle empty responses or non-JSON gracefully
    const text = await res.text();
    try {
      data = text ? JSON.parse(text) : {};
    } catch (e) {
      data = { message: text };
    }

    if (!res.ok) {
      if (res.status === 401) {
        removeAuthToken()
        localStorage.removeItem('bank_user_name');
        localStorage.removeItem('bank_account_number');

        window.location.href = '/';
      }
      throw new Error(data.message || data.error || `HTTP Error ${res.status}`);
    }
    
    return data;
  } catch (error: any) {
    // Catch fetch failures specifically (e.g. CORS or server down)
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      throw new Error('Could not connect to server. Make sure your Go backend is running on http://localhost:8080.');
    }
    throw error;
  }
};
