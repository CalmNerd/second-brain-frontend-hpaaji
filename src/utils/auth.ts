export const storeToken = (token: string): void => {
  try {
    localStorage.setItem('jwt_token', token);
    console.log('Token stored successfully');
  } catch (err) {
    console.error('Error storing token:', err);
    throw new Error('Failed to store authentication token');
  }
};

export const getToken = (): string | null => {
  try {
    return localStorage.getItem('jwt_token');
  } catch (err) {
    console.error('Error retrieving token:', err);
    return null;
  }
};

export const removeToken = (): void => {
  try {
    localStorage.removeItem('jwt_token');
    console.log('Token removed successfully');
  } catch (err) {
    console.error('Error removing token:', err);
  }
};

export const isAuthenticated = (): boolean => {
  const token = getToken();
  return token !== null && token.trim() !== '';
};

export const getAuthHeader = (): { Authorization: string } | null => {
  const token = getToken();
  if (!token) {
    return null;
  }
  return {
    Authorization: `${token}`
  };
};
