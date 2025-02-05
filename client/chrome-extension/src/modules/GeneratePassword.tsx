// src/modules/GeneratePassword.tsx
import { FC } from "react";
import { Key, Copy, RefreshCw } from "lucide-react";

interface PasswordOptions {
  uppercase: boolean;
  numbers: boolean;
  symbols: boolean;
}

interface GeneratePasswordProps {
  showPasswordGenerator: boolean;
  setShowPasswordGenerator: (show: boolean) => void;
  passwordLength: number;
  setPasswordLength: (length: number) => void;
  generatedPassword: string;
  passwordOptions: PasswordOptions;
  handlePasswordOptionChange: (key: keyof PasswordOptions) => void;
  generatePassword: () => void;
}

export const GeneratePassword: FC<GeneratePasswordProps> = ({
  showPasswordGenerator,
  setShowPasswordGenerator,
  passwordLength,
  setPasswordLength,
  generatedPassword,
  passwordOptions,
  handlePasswordOptionChange,
  generatePassword,
}) => {
  return (
    <>
      {/* Generate Password Button */}
      <div className="mt-3">
        <button
          onClick={() => {
            setShowPasswordGenerator(!showPasswordGenerator);
            if (!showPasswordGenerator) generatePassword();
          }}
          className="w-full flex items-center justify-center gap-3 p-3 rounded-xl transition-all duration-300 shadow-sm active scale-[0.99] bg-purple-50 border-2 border-purple-200 text-purple-700"
        >
          <Key
            className={`w-5 h-5 ${
              showPasswordGenerator ? "text-purple-600" : "opacity-70"
            }`}
          />
          <span
            className={`font-medium ${
              showPasswordGenerator ? "text-purple-700" : "text-slate-700"
            }`}
          >
            Generate Strong Password
          </span>
        </button>
      </div>

      {/* Password Generator Panel */}
      {showPasswordGenerator && (
        <div
          className="mt-3 overflow-hidden"
          style={{
            animation: "slideUp 0.3s ease-out forwards",
          }}
        >
          <div className="mt-3 p-4 bg-white/80 border shadow-inner border-slate-200 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="font-medium text-slate-700">Password Length</div>
              <input
                type="number"
                min="8"
                max="32"
                value={passwordLength}
                onChange={(e) => setPasswordLength(Number(e.target.value))}
                className="w-16 p-1 text-center border border-slate-200 rounded-lg"
              />
            </div>

            <div className="space-y-2 mb-4">
              {(
                Object.entries(passwordOptions) as [
                  keyof PasswordOptions,
                  boolean
                ][]
              ).map(([key, value]) => (
                <label key={key} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={() => handlePasswordOptionChange(key)}
                    className="rounded text-purple-600"
                  />
                  <span className="text-sm text-slate-600">
                    Include {key.charAt(0).toUpperCase() + key.slice(1)}
                  </span>
                </label>
              ))}
            </div>

            <div className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg">
              <input
                type="text"
                value={generatedPassword}
                readOnly
                className="w-full bg-transparent border-none text-sm"
              />
              <button
                onClick={() => navigator.clipboard.writeText(generatedPassword)}
                className="p-1.5 rounded-lg hover:bg-purple-50 transition-all"
                title="Copy password"
              >
                <Copy className="w-4 h-4 opacity-70 hover:opacity-100" />
              </button>
              <button
                onClick={generatePassword}
                className="p-1.5 rounded-lg hover:bg-purple-50 transition-all"
                title="Generate new password"
              >
                <RefreshCw className="w-4 h-4 opacity-70 hover:opacity-100" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};