import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff } from "lucide-react";
import educashLogo from "@/assets/educash-logo.png";
import DarkModeToggle from "./DarkModeToggle";

interface EnhancedHeaderProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  hasData: boolean;
  resetData: () => void;
}

const EnhancedHeader = ({ isDarkMode, toggleDarkMode, hasData, resetData }: EnhancedHeaderProps) => {
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
    <header className={`${
      isDarkMode
        ? 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900'
        : 'bg-gradient-to-r from-educash-green-dark to-educash-green-base'
    } shadow-2xl relative overflow-hidden transition-all duration-500`}>
      {/* Animated background effect */}
      <div className={`absolute inset-0 ${
        isDarkMode
          ? 'bg-gradient-to-r from-transparent via-blue-500/5 to-transparent'
          : 'bg-gradient-to-r from-transparent via-white/10 to-transparent'
      } animate-pulse`}></div>

      <div className="container mx-auto px-4 py-6 relative z-10">
        <div className="flex items-center justify-between animate-slideInUp">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img 
                src={educashLogo} 
                alt="EduCA$H Logo" 
                className="h-16 w-16 rounded-lg bg-white/10 p-2 hover-glow transition-all duration-500 hover:scale-110"
              />
              {/* Halo effect */}
              <div className={`absolute inset-0 ${
                isDarkMode
                  ? 'bg-gradient-to-r from-blue-400/20 to-purple-400/20'
                  : 'bg-gradient-to-r from-yellow-400/20 to-green-400/20'
              } rounded-full blur-xl -z-10`}></div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">EduCA$H</h1>
              <p className="text-educash-slogan text-sm">MENTE RICA, FUTURO BRILHANTE.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <DarkModeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
            
            {/* Connection status */}
            <Badge variant={isOnline ? "default" : "destructive"} className="glass-effect">
              {isOnline ? <Wifi className="h-3 w-3 mr-1" /> : <WifiOff className="h-3 w-3 mr-1" />}
              {isOnline ? 'Online' : 'Offline'}
            </Badge>

            {hasData && (
              <Button 
                onClick={resetData} 
                variant="outline" 
                className="border-white/20 text-white hover:bg-white/10 glass-effect hover:scale-105 transition-all duration-300"
              >
                Nova Planilha
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default EnhancedHeader;