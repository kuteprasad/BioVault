// Add highlight class to focused input

document.addEventListener('focusin', (e) => {
    const target = e.target as HTMLInputElement;
    
    if (target.tagName === 'INPUT' && 
      (target.type === 'password' || 
       target.type === 'email' || 
       target.name?.toLowerCase().includes('username') ||
       target.id?.toLowerCase().includes('username'))) {
      
   
      
      const formData = {
        url: window.location.href,
        inputType: target.type,
        inputName: target.name || target.id
      };
  
      // Send message to background script
      chrome.runtime.sendMessage({
        type: 'FORM_FIELD_FOCUSED',
        data: formData
      });
    }
  });
  

  
  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'FILL_FORM') {
      const { username, password } = message.data;
      fillForm(username, password);
    }
  });
  
  function fillForm(username: string, password: string) {
    const usernameField = document.querySelector('input[type="email"], input[type="text"][name*="username" i], input[type="text"][id*="username" i]');
    const passwordField = document.querySelector('input[type="password"]');
  
    if (usernameField instanceof HTMLInputElement) {
      usernameField.value = username;
      usernameField.dispatchEvent(new Event('input', { bubbles: true }));
    }
    if (passwordField instanceof HTMLInputElement) {
      passwordField.value = password;
      passwordField.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }