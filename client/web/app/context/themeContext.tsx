import { createContext, useContext, useEffect, useState } from 'react';

type ThemeMode = 'light' | 'dark' | 'system';
type ThemeColor = 'purple' | 'blue' | 'green' | 'red';

interface ThemeContextType {
  mode: ThemeMode;
  color: ThemeColor;
  setMode: (mode: ThemeMode) => void;
  setColor: (color: ThemeColor) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme-mode') as ThemeMode) || 'system';
    }
    return 'system';
  });
  
  const [color, setColor] = useState<ThemeColor>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme-color') as ThemeColor) || 'purple';
    }
    return 'purple';
  });

  // Handle theme mode changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const root = document.documentElement;
    localStorage.setItem('theme-mode', mode);

    const applyTheme = (isDark: boolean) => {
      root.classList.toggle('dark', isDark);
    };

    if (mode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      applyTheme(mediaQuery.matches);

      const handler = (e: MediaQueryListEvent) => applyTheme(e.matches);
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }

    applyTheme(mode === 'dark');
  }, [mode]);

  // Handle color theme changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem('theme-color', color);
    document.documentElement.setAttribute('data-theme', color);
  }, [color]);

  return (
    <ThemeContext.Provider value={{ mode, color, setMode, setColor }}>
      {children}
    </ThemeContext.Provider>
  );
}