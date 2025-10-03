import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Home, Heart, PiggyBank, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";

interface FinancialRuleCardProps {
  salary: number;
  expenses: number;
  isDarkMode?: boolean;
}

const FinancialRuleCard = ({ salary, expenses, isDarkMode }: FinancialRuleCardProps) => {
  // Regra 50/30/20
  const necessities = salary * 0.5;
  const wants = salary * 0.3;
  const savings = salary * 0.2;

  // Calcula percentual de gasto
  const expensePercentage = (expenses / salary) * 100;

  // Define status baseado nos gastos
  const getStatus = () => {
    if (expensePercentage < 70) {
      return { 
        color: 'success', 
        icon: CheckCircle2, 
        message: 'Excelente controle!',
        badge: 'default' as const
      };
    }
    if (expensePercentage >= 70 && expensePercentage < 90) {
      return { 
        color: 'warning', 
        icon: AlertTriangle, 
        message: 'Atenção aos gastos',
        badge: 'secondary' as const
      };
    }
    return { 
      color: 'danger', 
      icon: AlertTriangle, 
      message: 'Limite próximo! Revise seus gastos',
      badge: 'destructive' as const
    };
  };

  const status = getStatus();
  const StatusIcon = status.icon;

  return (
    <Card className={`glass-card hover-glow animate-scaleIn border-2 ${
      isDarkMode ? 'border-primary/20' : 'border-primary/10'
    }`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg font-bold font-ios">Regra 50/30/20</span>
          <Badge variant={status.badge} className="gap-1">
            <StatusIcon className="h-3 w-3" />
            {status.message}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Velocímetro de Gastos */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Gastos Totais</span>
            <span className={`font-bold text-${status.color}`}>
              {expensePercentage.toFixed(1)}% do salário
            </span>
          </div>
          <Progress 
            value={expensePercentage} 
            className={`h-3 ${
              expensePercentage < 70 ? 'bg-success/20' : 
              expensePercentage < 90 ? 'bg-warning/20' : 
              'bg-danger/20'
            }`}
          />
        </div>

        {/* Distribuição 50/30/20 */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Home className="h-4 w-4 text-success" />
              <span className="text-sm font-medium">50% Necessidades</span>
              <span className="ml-auto text-sm font-bold text-success">
                R$ {necessities.toFixed(2)}
              </span>
            </div>
            <Progress value={50} className="h-2 bg-success/20" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-info" />
              <span className="text-sm font-medium">30% Desejos</span>
              <span className="ml-auto text-sm font-bold text-info">
                R$ {wants.toFixed(2)}
              </span>
            </div>
            <Progress value={30} className="h-2 bg-info/20" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <PiggyBank className="h-4 w-4 text-warning" />
              <span className="text-sm font-medium">20% Poupança</span>
              <span className="ml-auto text-sm font-bold text-warning">
                R$ {savings.toFixed(2)}
              </span>
            </div>
            <Progress value={20} className="h-2 bg-warning/20" />
          </div>
        </div>

        {/* Saldo Recomendado */}
        <div className={`p-4 rounded-lg ${
          isDarkMode ? 'bg-primary/10' : 'bg-primary/5'
        } border border-primary/20`}>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">Meta de Economia</span>
          </div>
          <div className="text-2xl font-bold text-primary font-ios">
            R$ {savings.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Economize pelo menos este valor mensalmente
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialRuleCard;
