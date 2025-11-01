'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeType = 'daisyui' | 'flowbite';

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeType>('daisyui');
  const [mounted, setMounted] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('app-theme') as ThemeType;
    if (savedTheme && (savedTheme === 'daisyui' || savedTheme === 'flowbite')) {
      setThemeState(savedTheme);
    }
    setMounted(true);
  }, []);

  // Save theme to localStorage when it changes
  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
    localStorage.setItem('app-theme', newTheme);

    // Apply theme-specific classes to document
    if (newTheme === 'flowbite') {
      document.documentElement.classList.add('flowbite-theme');
      document.documentElement.classList.remove('daisyui-theme');
    } else {
      document.documentElement.classList.add('daisyui-theme');
      document.documentElement.classList.remove('flowbite-theme');
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'daisyui' ? 'flowbite' : 'daisyui');
  };

  // Apply theme class on mount
  useEffect(() => {
    if (mounted) {
      if (theme === 'flowbite') {
        document.documentElement.classList.add('flowbite-theme');
        document.documentElement.classList.remove('daisyui-theme');
      } else {
        document.documentElement.classList.add('daisyui-theme');
        document.documentElement.classList.remove('flowbite-theme');
      }
    }
  }, [theme, mounted]);

  // Prevent flash of unstyled content
  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
