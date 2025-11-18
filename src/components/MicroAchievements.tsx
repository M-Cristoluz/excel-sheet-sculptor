import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, TrendingUp, Target, Star, Zap } from "lucide-react";
import { toast } from "sonner";
import confetti from "canvas-confetti";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  coins: number;
  unlocked: boolean;
  isNew?: boolean;
}

interface MicroAchievementsProps {
  transactionCount: number;
  hasSetSalary: boolean;
  hasCreatedGoal: boolean;
  consecutiveDays: number;
}

export const MicroAchievements = ({
  transactionCount,
  hasSetSalary,
  hasCreatedGoal,
  consecutiveDays,
}: MicroAchievementsProps) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [totalCoins, setTotalCoins] = useState(0);

  // Define micro conquistas
  const microAchievements: Achievement[] = [
    {
      id: "first-transaction",
      title: "Primeira Transação! 🎉",
      description: "Registrou sua primeira transação",
      icon: "🎯",
      coins: 10,
      unlocked: transactionCount >= 1,
    },
    {
      id: "early-bird",
      title: "Começando Bem! ⭐",
      description: "Registrou 3 transações",
      icon: "⚡",
      coins: 25,
      unlocked: transactionCount >= 3,
    },
    {
      id: "salary-set",
      title: "Organizado! 💼",
      description: "Configurou seu salário base",
      icon: "💰",
      coins: 50,
      unlocked: hasSetSalary,
    },
    {
      id: "first-goal",
      title: "Sonhador! 🎪",
      description: "Criou sua primeira meta financeira",
      icon: "🎯",
      coins: 50,
      unlocked: hasCreatedGoal,
    },
    {
      id: "week-streak",
      title: "Uma Semana! 🔥",
      description: "7 dias usando o app",
      icon: "🔥",
      coins: 75,
      unlocked: consecutiveDays >= 7,
    },
    {
      id: "active-user",
      title: "Usuário Ativo! 🚀",
      description: "Registrou 10 transações",
      icon: "🚀",
      coins: 100,
      unlocked: transactionCount >= 10,
    },
  ];

  useEffect(() => {
    const savedAchievements = localStorage.getItem("educash-micro-achievements");
    const savedCoins = localStorage.getItem("educash-achievement-coins");

    if (savedAchievements) {
      setAchievements(JSON.parse(savedAchievements));
    } else {
      setAchievements(microAchievements);
    }

    if (savedCoins) {
      setTotalCoins(parseInt(savedCoins));
    }
  }, []);

  useEffect(() => {
    // Verifica novas conquistas
    const updatedAchievements = microAchievements.map((achievement) => {
      const existing = achievements.find((a) => a.id === achievement.id);
      const wasLocked = existing && !existing.unlocked;
      const isNowUnlocked = achievement.unlocked;

      if (wasLocked && isNowUnlocked) {
        // Nova conquista desbloqueada!
        triggerCelebration(achievement);
        return { ...achievement, isNew: true };
      }

      return existing || achievement;
    });

    setAchievements(updatedAchievements);
    localStorage.setItem("educash-micro-achievements", JSON.stringify(updatedAchievements));

    // Calcula total de coins
    const coinsEarned = updatedAchievements
      .filter((a) => a.unlocked)
      .reduce((sum, a) => sum + a.coins, 0);
    
    setTotalCoins(coinsEarned);
    localStorage.setItem("educash-achievement-coins", coinsEarned.toString());
  }, [transactionCount, hasSetSalary, hasCreatedGoal, consecutiveDays]);

  const triggerCelebration = (achievement: Achievement) => {
    // Confetti animation
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#22c55e', '#fbbf24', '#60a5fa', '#f472b6'],
    });

    // Toast with celebration
    toast.success(`🎉 Conquista Desbloqueada!`, {
      description: (
        <div className="flex items-center gap-2 mt-2">
          <span className="text-2xl">{achievement.icon}</span>
          <div>
            <div className="font-bold">{achievement.title}</div>
            <div className="text-sm opacity-80">+{achievement.coins} EduCoins</div>
          </div>
        </div>
      ),
      duration: 5000,
    });

    // Play sound (optional)
    try {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZURE=');
      audio.volume = 0.3;
      audio.play().catch(() => {});
    } catch (e) {}
  };

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;
  const progress = (unlockedCount / totalCount) * 100;

  return (
    <Card className="p-6 bg-gradient-to-br from-educash-gold/10 to-educash-green-base/10 
                     border-2 border-educash-gold/30 animate-fade-in">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-educash-gold/20 animate-glow-pulse">
              <Sparkles className="h-6 w-6 text-educash-gold" />
            </div>
            <div>
              <h3 className="font-bold text-lg font-display">Micro Conquistas</h3>
              <p className="text-sm text-muted-foreground">
                {unlockedCount} de {totalCount} desbloqueadas
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-educash-gold">{totalCoins}</div>
            <div className="text-xs text-muted-foreground">EduCoins</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-educash-gold to-educash-green-base 
                         transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-xs text-center text-muted-foreground">
            {progress.toFixed(0)}% completo
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 mt-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`relative p-2 sm:p-3 rounded-lg border-2 transition-all duration-300
                ${
                  achievement.unlocked
                    ? "bg-success/10 border-success/30 hover:scale-105"
                    : "bg-muted/50 border-muted opacity-50"
                }
                ${achievement.isNew ? "animate-pop-in" : ""}
              `}
            >
              {achievement.isNew && (
                <Badge className="absolute -top-2 -right-2 animate-bounce">
                  Novo!
                </Badge>
              )}
              <div className="text-center space-y-1">
                <div className="text-2xl sm:text-3xl">{achievement.icon}</div>
                <div className="text-[10px] sm:text-xs font-semibold line-clamp-1">
                  {achievement.title.split("!")[0]}
                </div>
                {achievement.unlocked && (
                  <div className="text-xs text-educash-gold font-bold">
                    +{achievement.coins}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Next Achievement Hint */}
        {unlockedCount < totalCount && (
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-center text-muted-foreground">
              💡 Continue usando o app para desbloquear mais conquistas!
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
