import { Moon, Sun, Wifi, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface DarkModeToggleProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const DarkModeToggle = ({ isDarkMode, toggleDarkMode }: DarkModeToggleProps) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="flex items-center gap-2">
      {/* Online Status Indicator */}
      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium font-ios transition-all duration-300 ${
        isOnline 
          ? isDarkMode 
            ? 'bg-online-dark/20 text-online-dark border border-online-dark/30' 
            : 'bg-online-light/20 text-online-light border border-online-light/30'
          : isDarkMode
            ? 'bg-offline-dark/20 text-offline-dark border border-offline-dark/30'
            : 'bg-offline-light/20 text-offline-light border border-offline-light/30'
      }`}>
        {isOnline ? (
          <>
            <Wifi className="h-3 w-3" />
            <span>Online</span>
          </>
        ) : (
          <>
            <WifiOff className="h-3 w-3" />
            <span>Offline</span>
          </>
        )}
      </div>

      {/* Dark Mode Toggle */}
      <Button
        onClick={toggleDarkMode}
        variant="glass"
        size="icon"
        className="relative overflow-hidden hover:scale-110 transition-all duration-300"
      >
        <div className={`transition-all duration-500 ${isDarkMode ? 'rotate-180 opacity-0' : 'rotate-0 opacity-100'}`}>
          <Sun className="h-5 w-5 text-warning" />
        </div>
        <div className={`absolute transition-all duration-500 ${isDarkMode ? 'rotate-0 opacity-100' : '-rotate-180 opacity-0'}`}>
          <Moon className="h-5 w-5 text-info" />
        </div>
      </Button>
    </div>
  );
};

export default DarkModeToggle;