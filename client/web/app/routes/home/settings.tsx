import { useState, useEffect } from 'react';
import { Sun, Moon, Monitor, Palette, ShieldCheck, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { updateUserProfile, fetchUserProfile } from '../../services/userService';

type ThemeMode = 'light' | 'dark' | 'system';
type ReverifyPeriod = '10m' | '1h' | '1d' | '7d' | '30d';

export default function Settings() {
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const [theme, setTheme] = useState('purple');
  const [reverifyPeriod, setReverifyPeriod] = useState<ReverifyPeriod>('7d');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await fetchUserProfile();
        setReverifyPeriod(
          profile.reVerificationInterval === '10m' ? '10m' :
          profile.reVerificationInterval === '60m' ? '1h' :
          profile.reVerificationInterval === '1440m' ? '1d' :
          profile.reVerificationInterval === '10080m' ? '7d' : '30d'
        );
      } catch (error) {
        toast.error('Failed to fetch profile');
      }
    };

    fetchProfile();
  }, []);

  const handleSaveSettings = async () => {
    try {
      const reVerificationInterval = reverifyPeriod === '10m' ? '10m' : reverifyPeriod === '1h' ? '60m' : reverifyPeriod === '1d' ? '1440m' : reverifyPeriod === '7d' ? '10080m' : '43200m';
      await updateUserProfile({ reVerificationInterval });
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <button
          onClick={handleSaveSettings}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg 
            hover:bg-purple-700 transition-colors duration-200"
        >
          Save Changes
        </button>
      </div>

      {/* Appearance Section */}
      <div className="space-y-6 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Appearance</h2>
        
        {/* Theme Mode */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Mode</label>
          <div className="flex gap-3">
            <button
              onClick={() => setThemeMode('light')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border 
                ${themeMode === 'light' 
                  ? 'bg-purple-50 border-purple-200 text-purple-700' 
                  : 'border-gray-200 hover:bg-gray-50'
                }`}
            >
              <Sun className="h-4 w-4" />
              Light
            </button>
            <button
              onClick={() => setThemeMode('dark')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border 
                ${themeMode === 'dark' 
                  ? 'bg-purple-50 border-purple-200 text-purple-700' 
                  : 'border-gray-200 hover:bg-gray-50'
                }`}
            >
              <Moon className="h-4 w-4" />
              Dark
            </button>
            <button
              onClick={() => setThemeMode('system')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border 
                ${themeMode === 'system' 
                  ? 'bg-purple-50 border-purple-200 text-purple-700' 
                  : 'border-gray-200 hover:bg-gray-50'
                }`}
            >
              <Monitor className="h-4 w-4" />
              System
            </button>
          </div>
        </div>

        {/* Theme Color */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Theme Color</label>
          <div className="relative">
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full pl-10 pr-10 py-2 appearance-none border border-gray-200 
                rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="purple">Purple</option>
              <option value="blue">Blue</option>
              <option value="green">Green</option>
              <option value="red">Red</option>
            </select>
            <Palette className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="space-y-6 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Security</h2>
        
        {/* Reverification Period */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Require Reverification
          </label>
          <div className="relative">
            <select
              value={reverifyPeriod}
              onChange={(e) => setReverifyPeriod(e.target.value as ReverifyPeriod)}
              className="w-full pl-10 pr-10 py-2 appearance-none border border-gray-200 
                rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="10m">Every 10 Minutes</option>
              <option value="1h">Every Hour</option>
              <option value="1d">Every Day</option>
              <option value="7d">Every Week</option>
              <option value="30d">Every Month</option>
            </select>
            <ShieldCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          <p className="text-sm text-gray-500">
            You'll need to verify your identity again after this period
          </p>
        </div>
      </div>
    </div>
  );
}