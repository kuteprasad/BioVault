import type { ExtensionMessage } from "./types/messages";
import { samplePasswords } from "./data/samplePasswords";

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
      const hasMatchingPasswords = samplePasswords.some((entry) => {
        const entryUrl = new URL(entry.site).origin;
        return url === entryUrl;
      });

      console.log("DEBUG: URL check result:", { url, hasMatchingPasswords });

      // Only open popup if we have matching passwords
      if (hasMatchingPasswords) {
        try {
          // Update the extension icon to indicate passwords available
          chrome.action.setBadgeText({
            text: "✓",
            tabId: tabId,
          });

          chrome.action.setBadgeBackgroundColor({
            color: "#7C3AED",
            tabId: tabId,
          });

          // Store form data before opening popup
          await new Promise<void>((resolve) => {
            chrome.storage.local.set({
              currentFormData: {
                ...message.data,
                tabId,
                url
              }
            }, () => resolve());
          });

          // Open popup after data is stored
          await new Promise<void>((resolve) => {
            chrome.action.openPopup().then(() => resolve());
          });
          
          sendResponse({ success: true });
        } catch (error) {
          console.error("DEBUG: Error handling matching passwords:", error);
          sendResponse({ 
            success: false, 
            error: error instanceof Error ? error.message : "Unknown error" 
          });
        }
      } else {
        // Clear badge if no passwords match
        chrome.action.setBadgeText({
          text: "",
          tabId: tabId
        });
        sendResponse({ success: true, hasPasswords: false });
      }
    }
  } catch (error) {
    console.error("DEBUG: Global error in message listener:", error);
    sendResponse({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    });
  }

  return true; // Keep message channel open for async response
});

// Handle login success message from main website
chrome.runtime.onMessageExternal.addListener((request: ExtensionMessage) => {
  try {
    if (request.type === "LOGIN_SUCCESS") {
      chrome.storage.local.set({ authToken: request.token }, () => {
        if (chrome.runtime.lastError) {
          console.error("DEBUG: Error storing auth token:", chrome.runtime.lastError);
          return;
        }
        chrome.runtime.sendMessage<ExtensionMessage>({
          type: "AUTH_CHANGED",
          token: request.token,
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
  } catch (error) {
    console.error("DEBUG: Error clearing badge on tab removal:", error);
  }
});