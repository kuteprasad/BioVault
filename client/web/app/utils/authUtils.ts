import { jwtDecode } from 'jwt-decode';

// Get JWT token from localStorage  
export const getToken = () => {
  if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
    console.log("token in gettoken: ", localStorage.getItem("jwtToken"));
    const token = localStorage.getItem("jwtToken");
    if (token && isTokenExpired(token)) {
      removeToken();
      return null;
    }
    return token;
  }
  return null;
};


// Save JWT token to localStorage
export const setToken = (token: string) => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('jwtToken', token);
    console.log("token stored:", token);

    // Send token to extension
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
      chrome.runtime.sendMessage(
        'fdkegggnmkoclihhhajpaacdcnkcmepd', // Your extension ID
        { type: 'LOGIN_SUCCESS', token: token }
      );
    }
  }
};

// Remove JWT token from localStorage
export const removeToken = () => {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('jwtToken');
  }
};

// Check if the token is expired
const isTokenExpired = (token: string) => {
  try {
    const decoded: any = jwtDecode(token);
    const now = Date.now() / 1000;
    return decoded.exp < now;
  } catch (error) {
    console.error('Error decoding token:', error);
    return true;
  }
};