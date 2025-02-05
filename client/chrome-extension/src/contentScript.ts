import { samplePasswords, PasswordEntry } from "./data/samplePasswords";

// Properly typed form field handler with debouncing
let focusTimeout: NodeJS.Timeout;


function fillFormFields(credentials: { username: string; password: string }) {
  console.log("DEBUG: Filling form fields...");

  // Cast NodeList to Array and filter for input elements
  const inputs: HTMLInputElement[] = Array.from(
    document.querySelectorAll("input")
  ).filter((el): el is HTMLInputElement => el instanceof HTMLInputElement);

  // Find username/email field with more flexible matching
  const usernameField = inputs.find((input) => {
    const inputType = input.type.toLowerCase();
    const inputName = (input.name || input.id || "").toLowerCase();
    const inputPlaceholder = (input.placeholder || "").toLowerCase();

    // Check for common username/email field identifiers
    const isUsernameOrEmail = [
      "username",
      "email",
      "user",
      "login",
      "userid",
      "account",
    ].some(
      (term) => inputName.includes(term) || inputPlaceholder.includes(term)
    );

    return (
      // Match by input type
      inputType === "email" ||
      inputType === "text" ||
      // Match by name/id/placeholder containing common terms
      isUsernameOrEmail
    );
  });

  // Find password field
  const passwordField = inputs.find(
    (input) => input.type.toLowerCase() === "password"
  );

  // Fill username/email if found
  if (usernameField) {
    usernameField.value = credentials.username;
    usernameField.dispatchEvent(new Event("input", { bubbles: true }));
    usernameField.dispatchEvent(new Event("change", { bubbles: true }));
    console.log("DEBUG: Username/Email field filled");
  } else {
    console.log("DEBUG: No username/email field found");
  }

  // Fill password if found
  if (passwordField) {
    passwordField.value = credentials.password;
    passwordField.dispatchEvent(new Event("input", { bubbles: true }));
    passwordField.dispatchEvent(new Event("change", { bubbles: true }));
    console.log("DEBUG: Password field filled");
  } else {
    console.log("DEBUG: No password field found");
  }

  return { usernameField, passwordField };
}

function checkUrlInPasswords(
  currentUrl: string,
  passwords: PasswordEntry[]
): boolean {
  // Normalize the current URL
  const normalizedCurrentUrl = new URL(currentUrl).origin;

  // Check if any password entry matches the current URL
  return passwords.some((entry) => {
    const entryUrl = new URL(entry.site).origin;
    return normalizedCurrentUrl === entryUrl;
  });
}

function sendMessageToBackground(message: {
  type: string;
  data: any;
}): Promise<void> {
  return new Promise((resolve) => {
    try {
      chrome.runtime.sendMessage(message, (response) => {
        if (chrome.runtime.lastError) {
          console.warn("Message failed:", chrome.runtime.lastError.message);
        } else if (response?.success) {
          console.log("Message sent successfully");
        }
        resolve();
      });
    } catch (error) {
      console.error("Extension message error:", error);
      resolve();
    }
  });
}

function handleFocus(event: FocusEvent) {
  const target = event.target as HTMLInputElement;

  // Clear any existing timeout
  if (focusTimeout) {
    clearTimeout(focusTimeout);
  }

  // Debounce the focus event to prevent rapid firing
  focusTimeout = setTimeout(() => {
    if (
      target.tagName === "INPUT" &&
      (target.type === "password" ||
        target.type === "email" ||
        target.name?.toLowerCase().includes("username") ||
        target.id?.toLowerCase().includes("username"))
    ) {
      const currentUrl = window.location.href;
      const formData = {
        url: currentUrl,
        inputType: target.type,
        inputName: target.name || target.id,
      };

      // Check if URL exists in passwords

      // Fire and forget - don't wait for response

      sendMessageToBackground({
        type: "FORM_FIELD_FOCUSED",
        data: {
          ...formData,
        },
      }).catch(console.error);
    }
  }, 100);
}

// Initialize listeners with cleanup
function initializeListeners() {
  document.addEventListener("focus", handleFocus, true);

  // Cleanup on unload
  window.addEventListener("unload", () => {
    document.removeEventListener("focus", handleFocus, true);
    if (focusTimeout) {
      clearTimeout(focusTimeout);
    }
  });
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  try {
    if (message.type === "FILL_FORM") {
      const currentUrl = window.location.href;

      const urlExists = checkUrlInPasswords(currentUrl, samplePasswords);

      if (!urlExists) {
        sendResponse({
          success: false,
          message: "No credentials found for this site",
        });
        return true;
      }

      const matchingEntry = samplePasswords.find((entry) => {
        const entryUrl = new URL(entry.site).origin;
        const currentOrigin = new URL(currentUrl).origin;
        return entryUrl === currentOrigin;
      });

      if (matchingEntry) {
        console.log("DEBUG: Found matching entry:", matchingEntry);

        const { usernameField, passwordField } = fillFormFields(message.data);

        sendResponse({
          success: true,
          fieldsFound: {
            username: !!usernameField,
            password: !!passwordField,
          },
        });
      }
    }
  } catch (error) {
    console.error("DEBUG: Error in message listener:", error);
    sendResponse({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }

  return true; // Keep the message port open
});

initializeListeners();
