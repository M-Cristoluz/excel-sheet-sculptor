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
      {/* Online Status Indicator with Glow */}
      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold font-ios transition-all duration-300 ${
        isOnline 
          ? isDarkMode 
            ? 'bg-online-dark/20 text-online-light border border-online-dark/40 glow-online' 
            : 'bg-online-light/20 text-online-dark border border-online-light/40 glow-online'
          : isDarkMode
            ? 'bg-offline-dark/20 text-offline-light border border-offline-dark/40'
            : 'bg-offline-light/20 text-offline-dark border border-offline-light/40'
      }`}>
        {isOnline ? (
          <>
            <Wifi className="h-3.5 w-3.5 animate-pulse" />
            <span>Online</span>
          </>
        ) : (
          <>
            <WifiOff className="h-3.5 w-3.5" />
            <span>Offline</span>
          </>
        )}
      </div>

      {/* Dark Mode Toggle with Enhanced Animation */}
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