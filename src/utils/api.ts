import { getAuthHeader } from './auth';

const API_BASE_URL = 'http://localhost:3001/api/v1';


interface AuthResponse {
  token?: string;
  message?: string;
}


interface SignupResponse {
  message: string;
}


interface ApiError {
  message: string;
}


export const signupUser = async (username: string, password: string): Promise<SignupResponse> => {
  const response = await fetch(`${API_BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Signup failed');
  }

  return data;
};


export const signinUser = async (username: string, password: string): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Sign in failed');
  }

  return data;
};

export const apiRequest = async <T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> => {
  const authHeader = getAuthHeader();
  const headers = {
    ...authHeader,
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }

  return data;
};
