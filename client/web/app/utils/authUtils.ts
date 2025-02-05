// Get JWT token from localStorage  
export const getToken = () => {
  if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
    console.log("token in gettoken: ", localStorage.getItem("jwtToken"));
    
    return localStorage.getItem("jwtToken");
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