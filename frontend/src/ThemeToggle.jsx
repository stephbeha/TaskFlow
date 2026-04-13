import { useTheme } from './ThemeContext';
import { Moon, Sun, Palette } from 'lucide-react';

export function ThemeToggle() {
  const { theme, isDark, toggleDarkMode, changeTheme } = useTheme();

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleDarkMode}
        className={`p-2 rounded-lg transition-all ${
          isDark 
            ? 'bg-dark-card text-yellow-400 hover:bg-dark-border' 
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
        title="Toggle dark mode"
      >
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <div className="flex gap-1">
        <button
          onClick={() => changeTheme('dark')}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-1 text-sm font-medium transition-all ${
            theme === 'dark'
              ? isDark
                ? 'bg-dark-border text-white'
                : 'bg-blue-500 text-white'
              : isDark
              ? 'bg-dark-card text-gray-400 hover:text-gray-300'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          title="Switch to dark theme"
        >
          <div className="w-3 h-3 rounded-full bg-gray-600"></div>
          Dark
        </button>
        <button
          onClick={() => changeTheme('green')}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-1 text-sm font-medium transition-all ${
            theme === 'green'
              ? isDark
                ? 'bg-green-primary text-black'
                : 'bg-green-primary text-white'
              : isDark
              ? 'bg-dark-card text-gray-400 hover:text-gray-300'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          title="Switch to green theme"
        >
          <div className="w-3 h-3 rounded-full bg-green-primary"></div>
          Green
        </button>
      </div>
    </div>
  );
}
