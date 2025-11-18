import { useEffect, useState } from "react";
import mascotEducash from "@/assets/mascot-educash.png";

interface MascotCelebrationProps {
  show: boolean;
  emotion?: "happy" | "excited" | "proud" | "worried";
  message?: string;
  onClose?: () => void;
}

export const MascotCelebration = ({
  show,
  emotion = "happy",
  message,
  onClose,
}: MascotCelebrationProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!isVisible) return null;

  const emotionEmoji = {
    happy: "😊",
    excited: "🎉",
    proud: "🏆",
    worried: "😰",
  };

  return (
    <div className="fixed bottom-24 right-6 z-50 animate-slide-up">
      <div className="relative">
        {/* Speech Bubble */}
        <div
          className="absolute bottom-full mb-4 right-0 bg-white dark:bg-card 
                      rounded-2xl shadow-2xl p-4 min-w-[200px] max-w-[280px]
                      border-2 border-educash-green-base/30 animate-pop-in"
        >
          <div className="flex items-start gap-2">
            <span className="text-2xl flex-shrink-0">{emotionEmoji[emotion]}</span>
            <p className="text-sm font-ios text-foreground">
              {message || "Parabéns! Continue assim! 🎉"}
            </p>
          </div>
          {/* Tail of speech bubble */}
          <div
            className="absolute bottom-0 right-8 w-0 h-0 translate-y-full
                        border-l-8 border-r-8 border-t-8 
                        border-l-transparent border-r-transparent 
                        border-t-educash-green-base/30"
          />
          <div
            className="absolute bottom-0 right-8 w-0 h-0 translate-y-[calc(100%-2px)]
                        border-l-[7px] border-r-[7px] border-t-[7px]
                        border-l-transparent border-r-transparent 
                        border-t-white dark:border-t-card"
          />
        </div>

        {/* Mascot */}
        <div className="relative animate-celebrate">
          <img
            src={mascotEducash}
            alt="PeppaCa$h"
            className="w-24 h-24 object-contain drop-shadow-2xl"
          />
          {/* Sparkles around mascot */}
          <div className="absolute -top-2 -right-2 text-2xl animate-bounce">✨</div>
          <div className="absolute -bottom-2 -left-2 text-2xl animate-bounce delay-100">💫</div>
        </div>
      </div>
    </div>
  );
};
