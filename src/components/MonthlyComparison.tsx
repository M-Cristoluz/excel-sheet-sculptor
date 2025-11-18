import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, ArrowRight, Minus } from "lucide-react";

interface DataRow {
  id?: number;
  data: string;
  mes?: string;
  ano?: string | number;
  tipo: string;
  descricao: string;
  valor: number;
  categoria?: string;
}

interface MonthlyComparisonProps {
  data: DataRow[];
}

const MonthlyComparison = ({ data }: MonthlyComparisonProps) => {
  // Calcular dados do mês atual e anterior
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const monthNames = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
  
  // Filtrar dados por mês
  const currentMonthData = data.filter(row => {
    if (!row.mes || !row.ano) return false;
    const rowMonth = monthNames.indexOf(row.mes.toUpperCase());
    const rowYear = parseInt(row.ano.toString());
    return rowMonth === currentMonth && rowYear === currentYear;
  });

  const previousMonthData = data.filter(row => {
    if (!row.mes || !row.ano) return false;
    const rowMonth = monthNames.indexOf(row.mes.toUpperCase());
    const rowYear = parseInt(row.ano.toString());
    return rowMonth === previousMonth && rowYear === previousYear;
  });

  // Calcular totais
  const calcTotals = (monthData: DataRow[]) => {
    const receitas = monthData
      .filter(row => row.tipo.toLowerCase() === 'entrada')
      .reduce((sum, row) => sum + (row.valor || 0), 0);
    
    const despesas = monthData
      .filter(row => row.tipo.toLowerCase() === 'saída' || row.tipo.toLowerCase() === 'saida')
      .reduce((sum, row) => sum + (row.valor || 0), 0);
    
    return { receitas, despesas, saldo: receitas - despesas };
  };

  const current = calcTotals(currentMonthData);
  const previous = calcTotals(previousMonthData);

  // Calcular variações percentuais
  const calcVariation = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const receitasVar = calcVariation(current.receitas, previous.receitas);
  const despesasVar = calcVariation(current.despesas, previous.despesas);
  const saldoVar = calcVariation(current.saldo, previous.saldo);

  const ComparisonCard = ({ 
    title, 
    currentValue, 
    previousValue, 
    variation,
    isPositiveGood = true 
  }: { 
    title: string;
    currentValue: number;
    previousValue: number;
    variation: number;
    isPositiveGood?: boolean;
  }) => {
    const isPositive = variation > 0;
    const isNegative = variation < 0;
    const colorClass = isPositive 
      ? (isPositiveGood ? 'text-success' : 'text-destructive')
      : isNegative
      ? (isPositiveGood ? 'text-destructive' : 'text-success')
      : 'text-muted-foreground';
    
    const Icon = isPositive ? TrendingUp : isNegative ? TrendingDown : Minus;

    return (
      <Card className="p-6 hover:shadow-lg transition-all">
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          
          <div className="flex items-end justify-between">
            <div>
              <div className="text-3xl font-bold text-foreground">
                R$ {currentValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Mês atual
              </div>
            </div>
            
            <div className={`flex items-center gap-1 font-semibold ${colorClass}`}>
              <Icon className="w-5 h-5" />
              <span className="text-lg">
                {variation > 0 && '+'}{variation.toFixed(1)}%
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm pt-2 border-t">
            <span className="text-muted-foreground">Mês anterior:</span>
            <span className="font-medium">
              R$ {previousValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground font-display">Comparativo Mensal</h2>
          <p className="text-muted-foreground">
            {monthNames[previousMonth]}/{previousYear} <ArrowRight className="inline w-4 h-4 mx-1" /> {monthNames[currentMonth]}/{currentYear}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <ComparisonCard
          title="Receitas"
          currentValue={current.receitas}
          previousValue={previous.receitas}
          variation={receitasVar}
          isPositiveGood={true}
        />
        
        <ComparisonCard
          title="Despesas"
          currentValue={current.despesas}
          previousValue={previous.despesas}
          variation={despesasVar}
          isPositiveGood={false}
        />
        
        <ComparisonCard
          title="Saldo"
          currentValue={current.saldo}
          previousValue={previous.saldo}
          variation={saldoVar}
          isPositiveGood={true}
        />
      </div>

      {/* Insights */}
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-educash-green-base/5 border-primary/20">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-full bg-primary/10">
            <TrendingUp className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2">Análise do Mês</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              {current.receitas > previous.receitas && (
                <p>✅ Suas receitas aumentaram {receitasVar.toFixed(1)}% em relação ao mês anterior!</p>
              )}
              {current.despesas < previous.despesas && (
                <p>✅ Você conseguiu reduzir suas despesas em {Math.abs(despesasVar).toFixed(1)}%!</p>
              )}
              {current.saldo > previous.saldo && (
                <p>🎉 Seu saldo melhorou {saldoVar.toFixed(1)}% - Continue assim!</p>
              )}
              {current.despesas > current.receitas && (
                <p>⚠️ Atenção: Suas despesas estão maiores que suas receitas este mês.</p>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MonthlyComparison;