// Get JWT token from localStorage
export const getToken = () => {
  if (typeof localStorage !== 'undefined') {
    const token = localStorage.getItem('jwtToken');
    console.log("token retrieved:", token);
    return token;
  }
  return null;
};

// Save JWT token to localStorage
export const setToken = (token: string) => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('jwtToken', token);
    console.log("token stored:", token);

    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
      chrome.runtime.sendMessage(
        'fdkegggnmkoclihhhajpaacdcnkcmepd',
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