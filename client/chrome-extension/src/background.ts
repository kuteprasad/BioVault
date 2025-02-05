import type { ExtensionMessage } from "./types/messages";

let popupShownForUrls: Set<string> = new Set();


// Add function to check if popup is open
async function checkIfPopupIsOpen(): Promise<boolean> {
  return new Promise((resolve) => {
    chrome.windows.getAll({ populate: true }, (windows) => {
      const popup = windows.find(window => 
        window.type === 'popup' && 
        window.tabs?.[0]?.url?.includes('chrome-extension://')
      );
      resolve(!!popup);
    });
  });
}


// Listen for form field focus events from content script
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  console.log("DEBUG: Message received:", message);

  try {
    if (message.type === "FORM_FIELD_FOCUSED") {
      const tabId = sender.tab?.id;
      const currentUrl = sender.tab?.url;
      
      if (!tabId || !currentUrl) {
        console.warn("DEBUG: Missing tab ID or URL");
        sendResponse({ success: false, error: "Invalid tab data" });
        return true;
      }

      const url = new URL(currentUrl).origin;
      if (popupShownForUrls.has(url)) {
        console.log("DEBUG: Popup already shown for this URL");
        sendResponse({ success: true });
        return true;
      }

        try {
          // Update the extension icon
          await chrome.action.setBadgeText({
            text: "✓",
            tabId: tabId,
          });
        
          await chrome.action.setBadgeBackgroundColor({
            color: "#7C3AED",
            tabId: tabId,
          });
        
          // Store form data
          await new Promise<void>((resolve) => {
            chrome.storage.local.set({
              currentFormData: {
                ...message.data,
                tabId,
                url
              }
            }, () => resolve());
          });
        
          // Check if popup is already open
          const popupIsOpen = await checkIfPopupIsOpen();

          if (!popupIsOpen) {
            await chrome.action.openPopup();
            // Mark this URL as shown
            popupShownForUrls.add(url);
          }
          
          // Only open popup if it's not already open
         
          
          sendResponse({ success: true });
        
        } catch (error) {
          console.error("DEBUG: Error handling matching passwords:", error);
          sendResponse({ 
            success: false, 
            error: error instanceof Error ? error.message : "Unknown error" 
          });
        }
      
    }
  } catch (error) {
    console.error("DEBUG: Global error in message listener:", error);
    sendResponse({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    });
  }

  return true;
});

// Handle login success message from main website
chrome.runtime.onMessageExternal.addListener((request: ExtensionMessage) => {
  try {
    if (request.type === "LOGIN_SUCCESS") {
      console.log("Login success received with token:", request.token);
      
      // Store the token
      chrome.storage.local.set({ authToken: request.token }, () => {
        if (chrome.runtime.lastError) {
          console.error("Error storing token:", chrome.runtime.lastError);
          return;
        }

        // Notify extension about auth change
        chrome.runtime.sendMessage<ExtensionMessage>({
          type: "AUTH_CHANGED",
          token: request.token
        });
      });
    }
  } catch (error) {
    console.error("DEBUG: Error handling external message:", error);
  }
});

// Clear badge when tab changes or closes
chrome.tabs.onActivated.addListener(({ tabId }) => {
  try {
    chrome.action.setBadgeText({
      text: "",
      tabId: tabId,
    });
  } catch (error) {
    console.error("DEBUG: Error clearing badge on tab activation:", error);
  }
});

chrome.tabs.onRemoved.addListener((tabId) => {
  try {
    chrome.action.setBadgeText({
      text: "",
      tabId: tabId,
    });
    // Clear popup shown status when tab closes
    popupShownForUrls.clear();
  } catch (error) {
    console.error("DEBUG: Error clearing badge on tab removal:", error);
  }
});