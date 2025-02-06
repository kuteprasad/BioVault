import { FC, useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "./styles/styles.css";
// import ".styles/animation.css";
// import { samplePasswords, VaultResponse } from "../data/samplePasswords";
import { PasswordEntry } from "../types/passwords";
import { LogOut } from "lucide-react";

import { getVault } from "../services/vaultService";

import { GeneratePassword } from "./GeneratePassword";
// Add import
import { BiometricAuth } from "./BiometricAuth";
import { matchBiometricData } from "../services/authService";

interface PasswordOptions {
  uppercase: boolean;
  numbers: boolean;
  symbols: boolean;
}

const Home: FC = () => {
  const { isAuthenticated, userId, logout } = useAuth();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string>("");
  const [allPasswords, setAllPasswords] = useState<PasswordEntry[]>([]);
  const [filteredPasswords, setFilteredPasswords] = useState<PasswordEntry[]>([]);
  const [showPasswordGenerator, setShowPasswordGenerator] = useState(false);
  const [passwordLength, setPasswordLength] = useState(16);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [passwordOptions, setPasswordOptions] = useState<PasswordOptions>({
    uppercase: true,
    numbers: true,
    symbols: true,
  });


  // Add new state after other states
  const [showBiometricAuth, setShowBiometricAuth] = useState(false);
  const [bioAuthResponse, setBioAuthResponse] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const showError = (message: string) => {
    setError(message);
    setTimeout(() => setError(null), 3000); // Auto dismiss after 3s
  };
  console.log(userId)

  // Fetch vault data when authenticated
  useEffect(() => {
    const fetchVault = async () => {
      try {
        const vaultData = await getVault();
        console.log("Fetched vault data:", vaultData);

        if (vaultData?.vault?.passwords) {
          setAllPasswords(vaultData.vault.passwords);
        }
      } catch (error) {
        console.error("Error fetching vault:", error);
      }
    };

    if (isAuthenticated) {
      fetchVault();
    }
  }, [isAuthenticated]);

  // Filter passwords for current URL
  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.url) {
        const url = new URL(tabs[0].url).origin;
        setCurrentUrl(url);

        const matchingPasswords = allPasswords.filter((password) => {
          try {
            const passwordUrl = new URL(password.site).origin;
            return passwordUrl === url;
          } catch {
            return false;
          }
        });

        setFilteredPasswords(matchingPasswords);
      }
    });
  }, [allPasswords, currentUrl]);

  const handleAuthClick = () => {
    if (!isAuthenticated) {
      // Open main website in new tab
      chrome.tabs.create({ url: "http://localhost:5173" });
    }
  };

  const handleSettingsClick = () => {
    chrome.tabs.create({ url: "http://localhost:5173/settings" });
  };
  const handelImportPassClick = () => {
    chrome.tabs.create({ url: "http://localhost:5173/import-passwords" });
  };

  const openSite = (url: string) => {
    chrome.tabs.create({ url });
  };

  const copyToClipboard = (password: PasswordEntry) => {
    navigator.clipboard.writeText(password.passwordEncrypted);
    setCopiedId(password._id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFillPassword = (password: PasswordEntry) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          {
            type: "FILL_FORM",
            data: {
              username: password.username,
              password: password.passwordEncrypted,
            },
          },
          (response) => {
            console.log("DEBUG: Fill form response:", response);
          }
        );
      }
    });
  };

  const handleAuthBeforeFill = async (password: PasswordEntry) => {
    try {

      // This is where we'll add the authentication API call later
      console.log("Initiating auth before fill for:", password.site);
      
      // For now, just show a temporary message
      // Later this will be replaced with actual biometric authentication
      setShowBiometricAuth(true);
      // const confirmAuth = window.confirm("Authenticate to fill password?");

      if (bioAuthResponse) {
        // Proceed with filling password after successful authentication
        handleFillPassword(password);
      }

    } catch (error) {
      console.error("Authentication failed:", error);
      // We can add proper error handling here later
    }
  };

  const handlePasswordOptionChange = (key: keyof PasswordOptions) => {
    setPasswordOptions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const generatePassword = () => {
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    let chars = lowercase;
    if (passwordOptions.uppercase) chars += uppercase;
    if (passwordOptions.numbers) chars += numbers;
    if (passwordOptions.symbols) chars += symbols;

    let password = "";
    for (let i = 0; i < passwordLength; i++) {
      password += chars[Math.floor(Math.random() * chars.length)];
    }
    setGeneratedPassword(password);
  };

  const handleBiometricSuccess = async (data: { blob: Blob; type: string }) => {
    setBioAuthResponse(false);
    console.log("Biometric data captured:", data);
    // Add the biometric data to the state
    const formData = new FormData();
    formData.append("biometricData", data.blob);
    formData.append("type", data.type);

    const response = await matchBiometricData(formData);
    console.log("Biometric match response:", response);
    //assume response will be true or false... 
    setBioAuthResponse(response.verified);

    setShowBiometricAuth(false);
    
  };

  const handleBiometricFailure = (error: string) => {
    console.error("Biometric auth failed:", error);
    showError("Biometric authentication failed");
    
    setShowBiometricAuth(false);
    setBioAuthResponse(false);
  }

  if (!isAuthenticated) {
    return (
      <div className="w-[300px] max-height-[400px] bg-gradient-to-br from-slate-50 to-white p-2 relative overflow-hidden rounded-xl">
        <div className="relative backdrop-blur-sm bg-white/70 rounded-xl p-4 shadow-xl border border-white/50">
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2 text-purple-800 mb-4">
              <div className="p-1.5 bg-purple-100 rounded-lg shadow-inner">
                <img
                  src="/icons/shield.svg"
                  alt="Shield"
                  className="w-5 h-5 animate-pulse"
                />
              </div>
              <span className="font-semibold text-lg tracking-tight">
                BioVault
              </span>
            </div>
            <p className="text-gray-600 text-sm">
              Please login to access your passwords
            </p>
            <button
              onClick={handleAuthClick}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-700 to-purple-800 text-white py-3 rounded-lg hover:opacity-95 transition-all duration-300 shadow-lg active:scale-[0.99] group text-sm"
            >
              Login or Sign Up
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Add JSX before the main return - after the authentication check
  {
    error && (
      <div className="absolute top-2 left-2 right-2 z-50 animate-slideDown">
        <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-r shadow-lg">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-[300px]  max-height-[400px] bg-gradient-to-br from-slate-50 to-white p-2 relative overflow-hidden rounded-xl">
      {/* Animated Background Shapes */}

      {/* Glass Container */}
      <div className="relative backdrop-blur-sm bg-white/70 rounded-xl p-4 shadow-xl border border-white/50">
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg shadow-inner">
              <img
                src="/icons/shield.svg"
                alt="Shield"
                className="w-5 h-5 animate-pulse"
              />
            </div>
            <span className="font-semibold text-xl tracking-tight bg-gradient-to-r from-purple-700 to-purple-800 bg-clip-text text-transparent">
              BioVault
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSettingsClick}
              className="p-2 rounded-lg hover:bg-purple-50 transition-all duration-300 active:scale-95"
            >
              <img
                src="/icons/settings.svg"
                alt="Settings"
                className="w-5 h-5 opacity-70 hover:opacity-100 transition-opacity"
              />
            </button>
            <button
              onClick={logout}
              className="p-2 rounded-lg hover:bg-purple-50 transition-all duration-300 active:scale-95"
              title="Logout"
            >
              <LogOut className="w-5 h-5 opacity-70 hover:opacity-100 transition-opacity text-red-500" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {!showPasswordGenerator && (
          <div
            className="mt-3 overflow-hidden"
            style={{
              animation: "slideUp 0.3s ease-out forwards",
            }}
          >
            <div>
              <div className="flex items-center gap-2 bg-white/80 border border-slate-200 p-2 rounded-lg mb-4 shadow-inner hover:border-purple-200 transition-colors">
                <img
                  src="/icons/search.svg"
                  alt="Search"
                  className="w-4 h-4 opacity-50"
                />
                <input
                  type="text"
                  placeholder="Search passwords..."
                  className="w-full bg-transparent border-none outline-none text-sm placeholder:text-slate-400"
                />
              </div>

              <div>
                <div className="font-semibold text-slate-800 mb-3 px-1">
                  Saved Passwords
                </div>
                {/* Update the passwords list container div */}
                <div className="space-y-2 max-h-[120px] overflow-y-auto pr-2 scrollbar-thin scrollbar-track-slate-100 scrollbar-thumb-purple-200 
                hover:scrollbar-thumb-purple-300 rounded-lg p-2 shadow-inner 
                bg-purple-50/30 backdrop-blur-sm">
                  {filteredPasswords.length > 0 ? (
                    filteredPasswords.map((password) => (
                      <div
                        key={password._id}
                        className="flex max-h-[52px] items-center gap-3 bg-white/95 
          border border-slate-200 p-3 rounded-lg hover:border-purple-200 
          transition-all duration-300 group hover:shadow-sm 
          hover:bg-purple-50/50"
                      >
                        <img
                          src={`https://www.google.com/s2/favicons?domain=${password.site}&sz=64`}
                          alt={new URL(password.site).hostname}
                          className="w-5 h-5 rounded shadow-sm"
                        />
                        <div
                          className="flex-1 min-w-0 cursor-pointer"
                          onClick={() => openSite(password.site)}
                        >
                          <div className="font-medium text-slate-800 truncate 
            hover:text-purple-600 transition-colors text-sm">
                            {new URL(password.site).hostname}
                          </div>
                          <div className="text-xs text-slate-500 truncate">
                            {password.username}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => copyToClipboard(password)}
                            className="p-1.5 rounded-lg hover:bg-purple-100 
              transition-all duration-300 relative group"
                            title="Copy password"
                          >
                            <img
                              src={`/icons/${copiedId === password._id ? "check" : "copy"}.svg`}
                              alt="Copy"
                              className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100"
                            />
                            {copiedId === password._id && (
                              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 
                bg-gray-800 text-white text-xs py-1 px-2 rounded-lg shadow-lg 
                whitespace-nowrap">
                                Copied!
                              </span>
                            )}
                          </button>
                          <button
                            onClick={() => handleAuthBeforeFill(password)}
                            className="px-2 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 
    transition-all duration-300 flex items-center gap-1 group"
                            title="Authenticate & Fill"
                          >
                            <img
                              src="/icons/auth.svg"
                              alt="Authenticate"
                              className="w-3.5 h-3.5 text-white"
                            />
                            {/* <span className="text-xs text-white font-medium">Fill</span> */}
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500 text-sm">
                      No saved passwords for this site
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>



        )}

        {/* Biometric Auth */}
        <BiometricAuth
          showBiometricAuth={showBiometricAuth}
          setShowBiometricAuth={setShowBiometricAuth}
          onSuccess={handleBiometricSuccess}
          onError={handleBiometricFailure}
        />

        {/* Generate Password Button */}
        <GeneratePassword
          showPasswordGenerator={showPasswordGenerator}
          setShowPasswordGenerator={setShowPasswordGenerator}
          passwordLength={passwordLength}
          setPasswordLength={setPasswordLength}
          generatedPassword={generatedPassword}
          passwordOptions={passwordOptions}
          handlePasswordOptionChange={handlePasswordOptionChange}
          generatePassword={generatePassword}
        />

        {/* Quick Actions */}
        {!showPasswordGenerator && (
          <div className="mt-3">
            <button
              onClick={handelImportPassClick}
              className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 p-3 rounded-xl hover:bg-purple-50/50 hover:border-purple-200 transition-all duration-300 shadow-sm active:scale-[0.99]"
            >
              <img src={`/icons/import.svg`} className="w-5 h-5 opacity-70" />
              <span className="font-medium text-slate-700">
                Import from Google
              </span>
            </button>
          </div>)}
      </div>
    </div>
  );
};

export default Home;
