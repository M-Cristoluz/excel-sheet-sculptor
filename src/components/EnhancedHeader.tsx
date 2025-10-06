import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff, ArrowLeft, Mail } from "lucide-react";
import educashLogo from "@/assets/educash-logo.png";
import DarkModeToggle from "./DarkModeToggle";

interface EnhancedHeaderProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  hasData: boolean;
  resetData: () => void;
  showBackButton?: boolean;
}

const EnhancedHeader = ({ isDarkMode, toggleDarkMode, hasData, resetData, showBackButton = true }: EnhancedHeaderProps) => {
  const navigate = useNavigate();
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
    <header className={`glass-effect shadow-2xl relative overflow-hidden transition-all duration-500 border-b-2 ${
      isDarkMode 
        ? 'border-primary/30 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900' 
        : 'border-primary/20 bg-gradient-to-r from-educash-green-dark to-educash-green-base'
    }`}>
      {/* Animated background effect with enhanced glassmorphism */}
      <div className={`absolute inset-0 ${
        isDarkMode
          ? 'bg-gradient-to-r from-transparent via-primary/10 to-transparent'
          : 'bg-gradient-to-r from-transparent via-white/10 to-transparent'
      } animate-pulse`}></div>

      <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-6 relative z-10">
        <div className="flex items-center justify-between animate-slideInUp gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-4">
            {showBackButton && (
              <button
                onClick={() => navigate('/')}
                className="p-2 sm:p-3 rounded-full bg-white/20 hover:bg-white/30 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 backdrop-blur-sm flex-shrink-0"
                aria-label="Voltar para página inicial"
              >
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            )}
            <img 
              src={educashLogo} 
              alt="EduCA$H Logo" 
              className="h-14 w-14 sm:h-20 sm:w-20 lg:h-24 lg:w-24 transition-all duration-300 flex-shrink-0"
            />
            <div className="hidden sm:block">
              <h1 className={`text-xl sm:text-2xl lg:text-3xl font-bold font-ios ${
                isDarkMode ? 'text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 'text-white'
              }`}>
                EduCA$H
              </h1>
              <p className={`text-xs sm:text-sm font-medium tracking-wide ${
                isDarkMode ? 'text-accent' : 'text-educash-slogan'
              }`}>
                MENTE RICA, FUTURO BRILHANTE.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <a
              href="mailto:educash.pe@gmail.com"
              className="p-2 sm:p-3 rounded-full bg-white/20 hover:bg-white/30 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 backdrop-blur-sm flex-shrink-0"
              aria-label="Suporte por e-mail"
              title="Suporte: educash.pe@gmail.com"
            >
              <Mail className="h-4 w-4 sm:h-5 sm:w-5" />
            </a>
            
            <DarkModeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />

            {hasData && (
              <Button 
                onClick={resetData} 
                variant="glass" 
                className="border-white/30 text-white hover:bg-white/20 hover:scale-105 transition-all duration-300 font-semibold shadow-lg text-xs sm:text-sm px-2 sm:px-4 hidden sm:inline-flex"
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