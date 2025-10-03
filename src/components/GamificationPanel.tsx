import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Target, Flame, Star, TrendingUp } from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: typeof Trophy;
  unlocked: boolean;
  progress?: number;
}

interface GamificationPanelProps {
  totalTransactions: number;
  consecutiveDaysOnBudget: number;
  totalSaved: number;
  isDarkMode?: boolean;
}

const GamificationPanel = ({ 
  totalTransactions, 
  consecutiveDaysOnBudget, 
  totalSaved,
  isDarkMode 
}: GamificationPanelProps) => {
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: "first-save",
      title: "Primeira Economia",
      description: "Fez sua primeira transação de economia",
      icon: Trophy,
      unlocked: totalSaved > 0,
    },
    {
      id: "week-green",
      title: "Semana no Verde",
      description: "7 dias consecutivos dentro do orçamento",
      icon: Flame,
      unlocked: consecutiveDaysOnBudget >= 7,
      progress: Math.min((consecutiveDaysOnBudget / 7) * 100, 100),
    },
    {
      id: "month-green",
      title: "30 Dias no Verde",
      description: "Um mês inteiro de controle financeiro",
      icon: Star,
      unlocked: consecutiveDaysOnBudget >= 30,
      progress: Math.min((consecutiveDaysOnBudget / 30) * 100, 100),
    },
    {
      id: "organized",
      title: "Organizado",
      description: "Registrou 50 transações",
      icon: Target,
      unlocked: totalTransactions >= 50,
      progress: Math.min((totalTransactions / 50) * 100, 100),
    },
  ]);

  useEffect(() => {
    // Calcula XP baseado nas conquistas
    const baseXP = totalTransactions * 10;
    const bonusXP = consecutiveDaysOnBudget * 20;
    const savingsXP = Math.floor(totalSaved / 10);
    const totalXP = baseXP + bonusXP + savingsXP;
    
    setXp(totalXP);
    
    // Calcula nível (a cada 1000 XP)
    const calculatedLevel = Math.floor(totalXP / 1000) + 1;
    setLevel(calculatedLevel);

    // Atualiza achievements
    setAchievements(prev => prev.map(achievement => ({
      ...achievement,
      unlocked: achievement.id === "first-save" ? totalSaved > 0 :
                achievement.id === "week-green" ? consecutiveDaysOnBudget >= 7 :
                achievement.id === "month-green" ? consecutiveDaysOnBudget >= 30 :
                achievement.id === "organized" ? totalTransactions >= 50 :
                achievement.unlocked,
      progress: achievement.id === "week-green" ? Math.min((consecutiveDaysOnBudget / 7) * 100, 100) :
                achievement.id === "month-green" ? Math.min((consecutiveDaysOnBudget / 30) * 100, 100) :
                achievement.id === "organized" ? Math.min((totalTransactions / 50) * 100, 100) :
                achievement.progress,
    })));
  }, [totalTransactions, consecutiveDaysOnBudget, totalSaved]);

  const getLevelTitle = () => {
    if (level < 3) return "🌱 Aprendiz";
    if (level < 6) return "💰 Poupador";
    return "📈 Investidor";
  };

  const xpForNextLevel = ((level) * 1000) - xp;
  const progressToNextLevel = ((xp % 1000) / 1000) * 100;

  return (
    <Card className={`glass-card hover-glow animate-scaleIn border-2 ${
      isDarkMode ? 'border-primary/20' : 'border-primary/10'
    }`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-warning" />
          <span className="font-ios">Seu Progresso</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Nível e XP */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Nível Atual</div>
              <div className="text-2xl font-bold font-ios">{getLevelTitle()}</div>
            </div>
            <Badge variant="default" className="text-lg px-4 py-2">
              Nível {level}
            </Badge>
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{xp} XP</span>
              <span>{xpForNextLevel} XP para próximo nível</span>
            </div>
            <Progress value={progressToNextLevel} className="h-2" />
          </div>
        </div>

        {/* Conquistas */}
        <div className="space-y-3">
          <div className="text-sm font-semibold text-muted-foreground">Conquistas</div>
          <div className="grid gap-3">
            {achievements.map((achievement) => {
              const Icon = achievement.icon;
              return (
                <div
                  key={achievement.id}
                  className={`p-3 rounded-lg border transition-all duration-300 ${
                    achievement.unlocked
                      ? isDarkMode
                        ? 'bg-success/10 border-success/30 glow-green'
                        : 'bg-success/5 border-success/20'
                      : isDarkMode
                      ? 'bg-muted/5 border-muted/20'
                      : 'bg-muted/10 border-muted/30'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      achievement.unlocked 
                        ? 'bg-success/20 text-success' 
                        : 'bg-muted/20 text-muted-foreground'
                    }`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="font-semibold text-sm">{achievement.title}</div>
                        {achievement.unlocked && (
                          <Badge variant="default" className="text-xs">
                            Conquistado!
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {achievement.description}
                      </div>
                      {!achievement.unlocked && achievement.progress !== undefined && (
                        <Progress 
                          value={achievement.progress} 
                          className="h-1 mt-2" 
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Desafio Semanal */}
        <div className={`p-4 rounded-lg border-2 border-dashed ${
          isDarkMode 
            ? 'border-warning/30 bg-warning/5' 
            : 'border-warning/40 bg-warning/10'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-warning" />
            <span className="text-sm font-bold">Desafio da Semana</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Economize 10% do seu salário esta semana
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default GamificationPanel;
