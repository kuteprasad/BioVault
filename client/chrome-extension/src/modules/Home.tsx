import { FC, useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./styles/scrollbar.css";

interface PasswordEntry {
  id: string;
  site: string;
  username: string;
  password: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

const samplePasswords: PasswordEntry[] = [
  {
    id: "1",
    site: "https://github.com",
    username: "devuser123",
    password: "SecurePass123!",
    notes: "GitHub personal account",
    created_at: new Date("2024-03-15").toISOString(),
    updated_at: new Date("2024-03-15").toISOString(),
  },
  {
    id: "2",
    site: "https://netflix.com",
    username: "netflixuser",
    password: "NetflixPass456!",
    notes: "Family Netflix account",
    created_at: new Date("2024-03-14").toISOString(),
    updated_at: new Date("2024-03-14").toISOString(),
  },
  {
    id: "3",
    site: "https://amazon.com",
    username: "shopper789",
    password: "AmazonShop789!",
    notes: "Prime shopping account",
    created_at: new Date("2024-03-13").toISOString(),
    updated_at: new Date("2024-03-13").toISOString(),
  },
];

const Home: FC = () => {
  const { isAuthenticated } = useAuth();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleAuthClick = () => {
    if (!isAuthenticated) {
      // Open main website in new tab
      chrome.tabs.create({ url: "http://localhost:5173/login" });
    }
  };

  const handleSettingsClick = () => {
    chrome.tabs.create({ url: "http://localhost:5173/settings" });
  };
  const handelImportPassClick = () => {
    chrome.tabs.create({ url: "http://localhost:5173/import-passwords" });
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const openSite = (url: string) => {
    chrome.tabs.create({ url });
  };

  const handleFillPassword = (password: PasswordEntry) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: "FILL_FORM",
          data: {
            username: password.username,
            password: password.password,
          },
        });
      }
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="w-[360px] bg-gradient-to-br from-slate-50 to-white p-4 relative overflow-hidden">
        <div className="relative backdrop-blur-sm bg-white/70 rounded-2xl p-5 shadow-lg border border-white/50">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3 text-purple-800 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg shadow-inner">
                <img
                  src="/icons/shield.svg"
                  alt="Shield"
                  className="w-6 h-6 animate-pulse"
                />
              </div>
              <span className="font-semibold text-xl tracking-tight">
                BioVault
              </span>
            </div>
            <p className="text-gray-600">
              Please login to access your passwords
            </p>
            <button
              onClick={handleAuthClick}
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-purple-700 to-purple-800 text-white py-4 rounded-xl hover:opacity-95 transition-all duration-300 shadow-lg active:scale-[0.99] group"
            >
              Login or Sign Up
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="w-[360px] bg-gradient-to-br from-slate-50 to-white p-4 relative overflow-hidden">
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-40 h-40 bg-purple-100/30 rounded-full -top-20 -right-20 blur-xl animate-pulse" />
        <div className="absolute w-32 h-32 bg-blue-100/20 rounded-full -bottom-16 -left-16 blur-xl animate-pulse delay-700" />
      </div>

      {/* Glass Container */}
      <div className="relative backdrop-blur-sm bg-white/70 rounded-2xl p-5 shadow-lg border border-white/50">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3 text-purple-800">
            <div className="p-2 bg-purple-100 rounded-lg shadow-inner">
              <img
                src="/icons/shield.svg"
                alt="Shield"
                className="w-6 h-6 animate-pulse"
              />
            </div>
            <span className="font-semibold text-xl tracking-tight">
              BioVault
            </span>
          </div>
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
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-3 bg-white/80 border border-slate-200 p-3 rounded-xl mb-6 shadow-inner hover:border-purple-200 transition-colors">
          <img
            src="/icons/search.svg"
            alt="Search"
            className="w-5 h-5 opacity-50"
          />
          <input
            type="text"
            placeholder="Search passwords..."
            className="w-full bg-transparent border-none outline-none text-sm placeholder:text-slate-400"
          />
        </div>

        {/* Password List */}

        <div>
          <div className="font-semibold text-slate-800 mb-3 px-1">
            Saved Passwords
          </div>
          <div className="space-y-2 max-h-[150px] overflow-y-auto pr-2 scrollbar-thin scrollbar-track-slate-100 scrollbar-thumb-purple-200 hover:scrollbar-thumb-purple-300">
            {samplePasswords.map((password) => (
              <div
                key={password.id}
                className="flex items-center gap-3 bg-white/80 border border-slate-200 p-4 rounded-xl hover:border-purple-200 transition-all duration-300 group"
              >
                <img
                  src={`https://www.google.com/s2/favicons?domain=${password.site}&sz=64`}
                  alt={new URL(password.site).hostname}
                  className="w-6 h-6 rounded-lg shadow-sm"
                />
                <div
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={() => openSite(password.site)}
                >
                  <div className="font-medium text-slate-800 truncate hover:text-purple-600 transition-colors">
                    {new URL(password.site).hostname}
                  </div>
                  <div className="text-xs text-slate-500 truncate">
                    {password.username}
                  </div>
                </div>
                <button
                  onClick={() =>
                    copyToClipboard(password.password, password.id)
                  }
                  className="p-2 rounded-lg hover:bg-purple-50 transition-all duration-300 relative group"
                  title="Copy password"
                >
                  <img
                    src={`/icons/${
                      copiedId === password.id ? "check" : "copy"
                    }.svg`}
                    alt="Copy"
                    className="w-[18px] h-[18px] opacity-70"
                  />
                  {copiedId === password.id && (
                    <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                      Copied!
                    </span>
                  )}
                </button>
                <button
                  onClick={() => handleFillPassword(password)}
                  className="p-2 rounded-lg hover:bg-purple-50 transition-all duration-300"
                  title="Fill form"
                >
                  <img
                    src="/icons/fill.svg"
                    alt="Fill"
                    className="w-[18px] h-[18px] opacity-70"
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Biometric Auth */}
        <div className="mb-6 mt-6">
          <button className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-purple-700 to-purple-800 text-white py-4 rounded-xl hover:opacity-95 transition-all duration-300 shadow-lg active:scale-[0.99] group">
            <img
              src="/icons/fingerprint.svg"
              alt="Fingerprint"
              className="w-6 h-6 group-hover:scale-110 transition-transform"
            />
            <span className="font-medium tracking-wide">
              Authenticate with Biometrics
            </span>
          </button>
        </div>

        {/* Quick Actions */}
        <div>
          <button
            onClick={handelImportPassClick}
            className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 p-3 rounded-xl hover:bg-purple-50 hover:border-purple-200 transition-all duration-300 shadow-sm active:scale-[0.98]"
          >
            <img src={`/icons/import.svg`} className="w-5 h-5 opacity-70" />
            <span className="text-sm font-medium text-slate-700">
              Import passwords from Google
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
