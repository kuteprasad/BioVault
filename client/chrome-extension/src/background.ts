import type { ExtensionMessage } from './types/messages';




// Listen for form field focus events from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {



  if (message.type === 'FORM_FIELD_FOCUSED') {
    const tabId = sender.tab?.id;
    if (!tabId) {
      sendResponse({ success: false });
      return;
    }
    
    
    // Update the extension icon to indicate a form is detected
    chrome.action.setBadgeText({
      text: '✓',
      tabId: tabId
    });


    chrome.action.openPopup();
    
    chrome.action.setBadgeBackgroundColor({
      color: '#7C3AED',
      tabId: tabId
    });

    // Store form data for later use
    chrome.storage.local.set({
      currentFormData: {
        ...message.data,
        tabId
      }
    }, () => {
      sendResponse({ success: true });
    });

    return true; // Will respond asynchronously
  }
});



// Handle login success message from main website
chrome.runtime.onMessageExternal.addListener((request: ExtensionMessage) => {
  if (request.type === 'LOGIN_SUCCESS') {
    chrome.storage.local.set({ authToken: request.token }, () => {
      chrome.runtime.sendMessage<ExtensionMessage>({
        type: 'AUTH_CHANGED',
        token: request.token 
      });
    });
  }
});

// Clear badge when tab changes or closes
chrome.tabs.onActivated.addListener(({ tabId }) => {
  chrome.action.setBadgeText({
    text: '',
    tabId: tabId
  });
});

chrome.tabs.onRemoved.addListener((tabId) => {
  chrome.action.setBadgeText({
    text: '',
    tabId: tabId
  });
});