import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";

interface DataRow {
  tipo: string;
  valor: number;
  categoria?: string;
  mes?: string;
  ano?: string | number;
}

interface Predictions {
  nextMonth: number;
  trend: string;
  trendPercent: number;
  avgMonthly: number;
  categories: Array<{
    category: string;
    predicted: number;
    confidence: string;
  }>;
  recommendations: string[];
}

interface ExpensePredictionsProps {
  data: DataRow[];
}

const ExpensePredictions = ({ data }: ExpensePredictionsProps) => {
  const [predictions, setPredictions] = useState<Predictions | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPredictions = async () => {
      if (data.length < 3) {
        setLoading(false);
        return;
      }

      try {
        const { data: result, error } = await supabase.functions.invoke('predict-expenses', {
          body: { transactions: data }
        });

        if (error) throw error;
        setPredictions(result);
      } catch (error) {
        console.error('Error getting predictions:', error);
      } finally {
        setLoading(false);
      }
    };

    getPredictions();
  }, [data]);

  if (loading || !predictions) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Activity className="w-5 h-5 text-primary animate-pulse" />
          <h3 className="font-semibold text-lg">Predições de Gastos</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          {data.length < 3 
            ? 'Adicione mais transações para gerar predições (mínimo 3)'
            : 'Analisando seus padrões...'}
        </p>
      </Card>
    );
  }

  const { nextMonth, trend, trendPercent, avgMonthly, categories, recommendations } = predictions;

  return (
    <div className="space-y-4 animate-fade-in">
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-gradient-to-br from-info/20 to-primary/20">
            <Activity className="w-5 h-5 text-info" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Predições de Gastos</h3>
            <p className="text-sm text-muted-foreground">Baseado no seu histórico</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Predição do próximo mês */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Próximo Mês (previsto)</span>
              <div className={`flex items-center gap-1 ${
                trend === 'increasing' ? 'text-destructive' : 'text-success'
              }`}>
                {trend === 'increasing' ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">{trendPercent.toFixed(1)}%</span>
              </div>
            </div>
            <div className="text-3xl font-bold">
              R$ {nextMonth.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-sm text-muted-foreground">
              Média histórica: R$ {avgMonthly.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </div>

          {/* Top categorias */}
          <div className="space-y-3">
            <span className="text-sm text-muted-foreground">Top Categorias (previsto)</span>
            {categories.slice(0, 3).map((cat) => (
              <div key={cat.category} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{cat.category}</span>
                  <span className="text-muted-foreground">
                    R$ {cat.predicted.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <Progress 
                  value={(cat.predicted / nextMonth) * 100} 
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Recomendações */}
      {recommendations.length > 0 && (
        <Card className="p-6 bg-gradient-to-br from-accent/5 to-primary/5 border-accent/20">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            Recomendações
          </h4>
          <ul className="space-y-2">
            {recommendations.map((rec, idx) => (
              <li key={idx} className="text-sm text-foreground flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
};

export default ExpensePredictions;