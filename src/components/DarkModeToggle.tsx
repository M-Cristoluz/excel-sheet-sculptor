import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DarkModeToggleProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const DarkModeToggle = ({ isDarkMode, toggleDarkMode }: DarkModeToggleProps) => {
  return (
    <Button
      onClick={toggleDarkMode}
      variant="ghost"
      size="icon"
      className="relative overflow-hidden glass-effect hover:scale-110 transition-all duration-300"
    >
      <div className={`transition-all duration-500 ${isDarkMode ? 'rotate-180 opacity-0' : 'rotate-0 opacity-100'}`}>
        <Sun className="h-5 w-5 text-yellow-500" />
      </div>
      <div className={`absolute transition-all duration-500 ${isDarkMode ? 'rotate-0 opacity-100' : '-rotate-180 opacity-0'}`}>
        <Moon className="h-5 w-5 text-blue-400" />
      </div>
    </Button>
  );
};

export default DarkModeToggle;