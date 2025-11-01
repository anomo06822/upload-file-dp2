'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { FiLayers } from 'react-icons/fi';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium hidden sm:inline">
        主題風格:
      </span>
      <button
        onClick={toggleTheme}
        className={
          theme === 'daisyui'
            ? 'btn btn-sm btn-outline gap-2'
            : 'px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700 flex items-center gap-2 transition-colors'
        }
        title="切換主題"
      >
        <FiLayers className="text-lg" />
        <span className="hidden sm:inline">
          {theme === 'daisyui' ? 'DaisyUI' : 'Flowbite'}
        </span>
      </button>
    </div>
  );
}
