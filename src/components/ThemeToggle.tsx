import { useAuth } from "@/context/AuthContext";
import { Moon, Sun } from "lucide-react";

export const ThemeToggle = () => {
  const { isDarkMode, toggleDarkMode } = useAuth();

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-full transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none flex items-center justify-center"
      aria-label="Toggle Dark Mode"
    >
      {isDarkMode ? (
        <Sun className="w-5 h-5 text-yellow-500" />
      ) : (
        <Moon className="w-5 h-5 text-slate-700 dark:text-slate-200" />
      )}
    </button>
  );
};