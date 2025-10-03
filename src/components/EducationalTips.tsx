import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, X, RefreshCw } from "lucide-react";

interface EducationalTipsProps {
  expenses: number;
  salary: number;
  isDarkMode?: boolean;
}

const tips = [
  {
    condition: (expenses: number, salary: number) => expenses / salary > 0.9,
    message: "Seus gastos estão acima de 90% do salário! Considere revisar suas despesas não essenciais.",
    type: "danger" as const,
  },
  {
    condition: (expenses: number, salary: number) => expenses / salary > 0.7,
    message: "Cuidado! Você já gastou 70% do seu salário. Que tal poupar o restante?",
    type: "warning" as const,
  },
  {
    condition: (expenses: number, salary: number) => expenses / salary < 0.5,
    message: "Parabéns! Você está economizando bem. Continue assim e seus objetivos financeiros ficarão mais próximos!",
    type: "success" as const,
  },
  {
    condition: () => true,
    message: "Dica: Registre todas as suas transações para ter controle total sobre suas finanças.",
    type: "info" as const,
  },
  {
    condition: () => true,
    message: "Separe pelo menos 20% do seu salário para poupança e investimentos. Seu futuro agradece!",
    type: "info" as const,
  },
  {
    condition: () => true,
    message: "Necessidades (50%) incluem moradia, alimentação e transporte. Revise o que é realmente essencial.",
    type: "info" as const,
  },
  {
    condition: () => true,
    message: "Desejos (30%) são entretenimento e lazer. Aproveite, mas com consciência!",
    type: "info" as const,
  },
];

const EducationalTips = ({ expenses, salary, isDarkMode }: EducationalTipsProps) => {
  const [currentTip, setCurrentTip] = useState(0);
  const [visible, setVisible] = useState(true);

  const getRelevantTips = () => {
    return tips.filter(tip => tip.condition(expenses, salary));
  };

  const relevantTips = getRelevantTips();

  useEffect(() => {
    if (relevantTips.length > 0) {
      const interval = setInterval(() => {
        setCurrentTip(prev => (prev + 1) % relevantTips.length);
      }, 10000); // Muda a cada 10 segundos

      return () => clearInterval(interval);
    }
  }, [relevantTips.length]);

  const changeTip = () => {
    setCurrentTip(prev => (prev + 1) % relevantTips.length);
  };

  if (!visible || relevantTips.length === 0) return null;

  const tip = relevantTips[currentTip];

  const getBgColor = () => {
    switch (tip.type) {
      case 'danger':
        return isDarkMode ? 'bg-danger/10 border-danger/30' : 'bg-danger/5 border-danger/20';
      case 'warning':
        return isDarkMode ? 'bg-warning/10 border-warning/30' : 'bg-warning/5 border-warning/20';
      case 'success':
        return isDarkMode ? 'bg-success/10 border-success/30' : 'bg-success/5 border-success/20';
      default:
        return isDarkMode ? 'bg-info/10 border-info/30' : 'bg-info/5 border-info/20';
    }
  };

  const getIconColor = () => {
    switch (tip.type) {
      case 'danger': return 'text-danger';
      case 'warning': return 'text-warning';
      case 'success': return 'text-success';
      default: return 'text-info';
    }
  };

  return (
    <Card className={`glass-card animate-slideInUp border-2 ${getBgColor()}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${
            isDarkMode ? 'bg-background/50' : 'bg-white/50'
          }`}>
            <Lightbulb className={`h-5 w-5 ${getIconColor()}`} />
          </div>
          
          <div className="flex-1">
            <div className="font-semibold text-sm mb-1">💡 Dica Educativa</div>
            <p className="text-sm text-muted-foreground">{tip.message}</p>
          </div>

          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={changeTip}
            >
              <RefreshCw className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setVisible(false)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EducationalTips;
