// Get JWT token from localStorage
export const getToken = () => {
    return localStorage.getItem('jwtToken');
  };
  
  // Save JWT token to localStorage
  export const setToken = (token: string) => {
    localStorage.setItem('jwtToken', token);
  };
  
  // Remove JWT token from localStorage
  export const removeToken = () => {
    localStorage.removeItem('jwtToken');
  };
  