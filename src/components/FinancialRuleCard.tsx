import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Home, Heart, PiggyBank, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";

interface FinancialRuleCardProps {
  salary: number;
  expenses: number;
  essenciais: number;
  desejos: number;
  poupanca: number;
  isDarkMode?: boolean;
}

const FinancialRuleCard = ({ salary, expenses, essenciais, desejos, poupanca, isDarkMode }: FinancialRuleCardProps) => {
  // Regra 50/30/20 - valores ideais
  const necessitiesTarget = salary * 0.5;
  const wantsTarget = salary * 0.3;
  const savingsTarget = salary * 0.2;

  // Percentuais reais baseados nas transações categorizadas
  const essenciaisPercent = salary > 0 ? (essenciais / salary) * 100 : 0;
  const desejosPercent = salary > 0 ? (desejos / salary) * 100 : 0;
  const poupancaPercent = salary > 0 ? (poupanca / salary) * 100 : 0;

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

  const getStatusColorClass = () => {
    switch (status.color) {
      case 'success': return 'text-success';
      case 'warning': return 'text-warning';
      case 'danger': return 'text-danger';
      default: return 'text-foreground';
    }
  };

  return (
    <Card className="glass-card hover-glow animate-scaleIn border-2 border-primary/20 dark:border-primary/30 bg-card">
      <CardHeader>
        <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <span className="text-base sm:text-lg font-bold font-ios text-foreground">Regra 50/30/20</span>
          <Badge variant={status.badge} className="gap-1 text-xs">
            <StatusIcon className="h-3 w-3" />
            <span className="hidden sm:inline">{status.message}</span>
            <span className="sm:hidden">{status.message.split('!')[0]}</span>
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Velocímetro de Gastos */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-foreground font-medium">Gastos Totais</span>
            <span className={`font-bold ${getStatusColorClass()}`}>
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

        {/* Distribuição 50/30/20 - Real vs Ideal */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Home className="h-4 w-4 text-success" />
                <span className="text-sm font-medium text-foreground">💡 Essenciais (50%)</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-success">
                  R$ {essenciais.toFixed(2)}
                </div>
                <div className="text-xs text-muted-foreground dark:text-muted-foreground">
                  Meta: R$ {necessitiesTarget.toFixed(2)}
                </div>
              </div>
            </div>
            <Progress value={Math.min(essenciaisPercent, 100)} className={`h-2 ${essenciaisPercent <= 50 ? 'bg-success/20' : 'bg-warning/20'}`} />
            <p className="text-xs text-muted-foreground">{essenciaisPercent.toFixed(1)}% do salário</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-info" />
                <span className="text-sm font-medium text-foreground">❤️ Desejos (30%)</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-info">
                  R$ {desejos.toFixed(2)}
                </div>
                <div className="text-xs text-muted-foreground">
                  Meta: R$ {wantsTarget.toFixed(2)}
                </div>
              </div>
            </div>
            <Progress value={Math.min(desejosPercent, 100)} className={`h-2 ${desejosPercent <= 30 ? 'bg-info/20' : 'bg-warning/20'}`} />
            <p className="text-xs text-muted-foreground">{desejosPercent.toFixed(1)}% do salário</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PiggyBank className="h-4 w-4 text-warning" />
                <span className="text-sm font-medium text-foreground">🐷 Poupança (20%)</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-warning">
                  R$ {poupanca.toFixed(2)}
                </div>
                <div className="text-xs text-muted-foreground">
                  Meta: R$ {savingsTarget.toFixed(2)}
                </div>
              </div>
            </div>
            <Progress value={Math.min(poupancaPercent, 100)} className={`h-2 ${poupancaPercent >= 20 ? 'bg-warning/20' : 'bg-danger/20'}`} />
            <p className="text-xs text-muted-foreground">{poupancaPercent.toFixed(1)}% do salário</p>
          </div>
        </div>

        {/* Saldo Recomendado */}
        <div className="p-4 rounded-lg bg-primary/5 dark:bg-primary/10 border border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">Análise da Regra 50/30/20</span>
          </div>
          {poupanca >= savingsTarget ? (
            <div className="text-sm text-success font-medium">
              ✅ Parabéns! Você está poupando mais que a meta ({poupancaPercent.toFixed(1)}%)
            </div>
          ) : (
            <div className="text-sm text-warning font-medium">
              ⚠️ Você está poupando {poupancaPercent.toFixed(1)}%. Meta: 20%
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-2">
            {essenciaisPercent > 50 && "Reduza gastos essenciais. "}
            {desejosPercent > 30 && "Controle gastos com desejos. "}
            {poupancaPercent < 20 && "Aumente sua poupança mensal."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialRuleCard;
