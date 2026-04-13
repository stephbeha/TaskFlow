import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark'); // 'dark' or 'green'
  const [isDark, setIsDark] = useState(true);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('taskflow-theme') || 'dark';
    const savedDarkMode = localStorage.getItem('taskflow-darkmode') !== 'false';
    setTheme(savedTheme);
    setIsDark(savedDarkMode);
    applyTheme(savedTheme, savedDarkMode);
  }, []);

  const applyTheme = (newTheme, darkMode) => {
    const html = document.documentElement;
    if (darkMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  };

  const toggleDarkMode = () => {
    const newDarkMode = !isDark;
    setIsDark(newDarkMode);
    localStorage.setItem('taskflow-darkmode', newDarkMode);
    applyTheme(theme, newDarkMode);
  };

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('taskflow-theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleDarkMode, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
