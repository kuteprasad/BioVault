import { FC, useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "./styles/scrollbar.css";
import { samplePasswords, PasswordEntry } from "../data/samplePasswords";




const Home: FC = () => {
  const { isAuthenticated } = useAuth();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [_currentUrl, setCurrentUrl] = useState<string>('');
  const [filteredPasswords, setFilteredPasswords] = useState<PasswordEntry[]>([]);

  console.log(isAuthenticated);

  // Get current tab URL when component mounts
  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.url) {
        const url = new URL(tabs[0].url).origin;
        setCurrentUrl(url);
        
        // Filter passwords for current URL
        const matchingPasswords = samplePasswords.filter(password => {
          const passwordUrl = new URL(password.site).origin;
          return passwordUrl === url;
        });
        
        setFilteredPasswords(matchingPasswords);
      }
    });
  }, []);

  const handleAuthClick = () => {
    if (!isAuthenticated) {
      // Open main website in new tab
      chrome.tabs.create({ url: "http://localhost:5173/home1" });
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
        console.log("DEBUG: Sending FILL_FORM message to tab:", tabs[0].id);
        chrome.tabs.sendMessage(tabs[0].id, {
          type: "FILL_FORM",
          data: {
            username: password.username,
            password: password.password,
          },
        }, (response) => {
          console.log("DEBUG: Fill form response:", response);
        });
      }
    });
  };


  if (!isAuthenticated) {
    return (
      <div className="w-[320px] bg-gradient-to-br from-slate-50 to-white p-1 relative overflow-hidden rounded-lg">
        <div className="relative backdrop-blur-sm bg-white/70 rounded-xl p-4 shadow-lg border border-white/50">
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2 text-purple-800 mb-4">
              <div className="p-1.5 bg-purple-100 rounded-lg shadow-inner">
                <img src="/icons/shield.svg" alt="Shield" className="w-5 h-5 animate-pulse" />
              </div>
              <span className="font-semibold text-lg tracking-tight">BioVault</span>
            </div>
            <p className="text-gray-600 text-sm">Please login to access your passwords</p>
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

  return (
    <div className="w-[300px] bg-gradient-to-br from-slate-50 to-white p-2 relative overflow-hidden rounded-xl">
      {/* Animated Background Shapes */}

      {/* Glass Container */}
      <div className="relative backdrop-blur-sm bg-white/70 rounded-xl p-4 shadow-xl border border-white/50">
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg shadow-inner">
              <img src="/icons/shield.svg" alt="Shield" className="w-5 h-5 animate-pulse" />
            </div>
            <span className="font-semibold text-xl tracking-tight bg-gradient-to-r from-purple-700 to-purple-800 bg-clip-text text-transparent">
              BioVault
            </span>
          </div>
          <button
            onClick={handleSettingsClick}
            className="p-2 rounded-lg hover:bg-purple-50 transition-all duration-300 active:scale-95"
          >
            <img src="/icons/settings.svg" alt="Settings" className="w-5 h-5 opacity-70 hover:opacity-100 transition-opacity" />
          </button>
        </div>
  
        {/* Search Bar */}
        <div className="flex items-center gap-2 bg-white/80 border border-slate-200 p-2 rounded-lg mb-4 shadow-inner hover:border-purple-200 transition-colors">
      <img src="/icons/search.svg" alt="Search" className="w-4 h-4 opacity-50" />
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
            {filteredPasswords.length > 0 ? (
              filteredPasswords.map((password) => (
                <div
                  key={password.id}
                  className="flex items-center gap-3 bg-white/90 border border-slate-200 p-4 rounded-xl hover:border-purple-200 transition-all duration-300 group hover:shadow-sm"
                >
                  <img
                    src={`https://www.google.com/s2/favicons?domain=${password.site}&sz=64`}
                    alt={new URL(password.site).hostname}
                    className="w-6 h-6 rounded-lg shadow-sm"
                  />
                  <div className="flex-1 min-w-0 cursor-pointer" onClick={() => openSite(password.site)}>
                    <div className="font-medium text-slate-800 truncate hover:text-purple-600 transition-colors">
                      {new URL(password.site).hostname}
                    </div>
                    <div className="text-xs text-slate-500 truncate">{password.username}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyToClipboard(password.password, password.id)}
                      className="p-2 rounded-lg hover:bg-purple-50 transition-all duration-300 relative group"
                      title="Copy password"
                    >
                      <img
                        src={`/icons/${copiedId === password.id ? "check" : "copy"}.svg`}
                        alt="Copy"
                        className="w-4 h-4 opacity-70 group-hover:opacity-100"
                      />
                      {copiedId === password.id && (
                        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded-lg shadow-lg whitespace-nowrap">
                          Copied!
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => handleFillPassword(password)}
                      className="p-2 rounded-lg hover:bg-purple-50 transition-all duration-300"
                      title="Fill form"
                    >
                      <img src="/icons/fill.svg" alt="Fill" className="w-4 h-4 opacity-70 group-hover:opacity-100" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-500">
                No saved passwords for this site
              </div>
            )}
          </div>
        </div>
  
        {/* Biometric Auth */}
        <div className="mt-6 mb-4">
          <button className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3.5 rounded-xl hover:opacity-95 transition-all duration-300 shadow-lg active:scale-[0.99] group">
            <img
              src="/icons/fingerprint.svg"
              alt="Fingerprint"
              className="w-5 h-5 group-hover:scale-110 transition-transform"
            />
            <span className="font-medium">Authenticate with Biometrics</span>
          </button>
        </div>
  
        {/* Quick Actions */}
        <div>
          <button
            onClick={handelImportPassClick}
            className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 p-3 rounded-xl hover:bg-purple-50/50 hover:border-purple-200 transition-all duration-300 shadow-sm active:scale-[0.99]"
          >
            <img src={`/icons/import.svg`} className="w-5 h-5 opacity-70" />
            <span className="font-medium text-slate-700">Import from Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;