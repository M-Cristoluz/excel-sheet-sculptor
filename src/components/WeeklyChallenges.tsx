import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Trophy, Target, Coins, Check, Lock } from "lucide-react";
import { toast } from "sonner";
import { SocialShare } from "@/components/SocialShare";

interface Challenge {
  id: string;
  title: string;
  description: string;
  reward: number;
  progress: number;
  target: number;
  completed: boolean;
  icon: string;
}

const WeeklyChallenges = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: '1',
      title: 'Registre 10 transações',
      description: 'Adicione pelo menos 10 transações esta semana',
      reward: 50,
      progress: 0,
      target: 10,
      completed: false,
      icon: '📝'
    },
    {
      id: '2',
      title: 'Economize 20%',
      description: 'Mantenha seus gastos 20% abaixo do orçamento',
      reward: 100,
      progress: 0,
      target: 20,
      completed: false,
      icon: '💰'
    },
    {
      id: '3',
      title: 'Zero despesas extras',
      description: 'Passe 3 dias sem gastos não essenciais',
      reward: 75,
      progress: 0,
      target: 3,
      completed: false,
      icon: '🎯'
    },
    {
      id: '4',
      title: 'Crie uma meta',
      description: 'Defina uma nova meta financeira',
      reward: 30,
      progress: 0,
      target: 1,
      completed: false,
      icon: '🎪'
    },
  ]);

  const [totalCoins, setTotalCoins] = useState(0);

  useEffect(() => {
    const savedCoins = localStorage.getItem('educash-coins');
    if (savedCoins) {
      setTotalCoins(parseInt(savedCoins));
    }
  }, []);

  const claimReward = (challengeId: string) => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge || !challenge.completed) return;

    const newTotal = totalCoins + challenge.reward;
    setTotalCoins(newTotal);
    localStorage.setItem('educash-coins', newTotal.toString());

    setChallenges(challenges.map(c =>
      c.id === challengeId ? { ...c, progress: 0, completed: false } : c
    ));

    toast.success(`🎉 Você ganhou ${challenge.reward} EduCoins!`, {
      description: `Total: ${newTotal} EduCoins`
    });
    
    // Marca que completou desafio para mostrar opção de compartilhar
    localStorage.setItem('last-completed-challenge', JSON.stringify({
      achievement: challenge.title,
      coins: challenge.reward,
      timestamp: Date.now()
    }));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header com saldo */}
      <Card className="p-6 bg-gradient-to-br from-educash-gold/20 to-accent/10 border-2 border-educash-gold/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-gradient-to-br from-educash-gold to-accent">
              <Coins className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Seu Saldo</p>
              <p className="text-3xl font-bold text-foreground">{totalCoins} EduCoins</p>
            </div>
          </div>
          <Trophy className="w-12 h-12 text-educash-gold" />
        </div>
      </Card>

      {/* Desafios */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-lg">Desafios da Semana</h3>
        </div>

        <div className="grid gap-4">
          {challenges.map((challenge) => {
            const progressPercent = (challenge.progress / challenge.target) * 100;
            const isCompleted = challenge.progress >= challenge.target;

            return (
              <Card
                key={challenge.id}
                className={`p-5 transition-all hover:shadow-lg ${
                  isCompleted 
                    ? 'border-2 border-success bg-success/5' 
                    : 'border-2 border-border'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{challenge.icon}</div>
                  
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-base mb-1">
                          {challenge.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {challenge.description}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-1 text-educash-gold font-semibold whitespace-nowrap">
                        <Coins className="w-4 h-4" />
                        <span>{challenge.reward}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Progresso: {challenge.progress}/{challenge.target}
                        </span>
                        <span className="font-medium">
                          {progressPercent.toFixed(0)}%
                        </span>
                      </div>
                      <Progress value={progressPercent} className="h-2" />
                    </div>

                    {isCompleted && !challenge.completed && (
                      <Button
                        onClick={() => claimReward(challenge.id)}
                        className="w-full bg-gradient-to-r from-success to-educash-green-base hover:opacity-90 gap-2"
                      >
                        <Check className="w-4 h-4" />
                        Resgatar Recompensa
                      </Button>
                    )}

                    {challenge.completed && (
                      <div className="flex items-center justify-center gap-2 py-2 text-sm text-muted-foreground">
                        <Lock className="w-4 h-4" />
                        <span>Desafio resgatado - aguarde próxima semana</span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Info sobre recompensas */}
      <Card className="p-4 bg-muted/50">
        <p className="text-sm text-muted-foreground text-center">
          💡 <strong>Dica:</strong> Complete desafios para ganhar EduCoins e trocar por recompensas mensais!
        </p>
      </Card>

      {/* Compartilhamento Social - mostra se há conquista recente */}
      {totalCoins > 0 && (
        <SocialShare 
          achievement="Desafios semanais concluídos!" 
          coins={totalCoins}
        />
      )}
    </div>
  );
};

export default WeeklyChallenges;