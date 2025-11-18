import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, RefreshCw, AlertTriangle, CheckCircle, Info, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface DataRow {
  tipo: string;
  valor: number;
  categoria?: string;
  mes?: string;
  ano?: string | number;
}

interface Insight {
  title: string;
  description: string;
  type: 'success' | 'warning' | 'danger' | 'info';
  priority: 'high' | 'medium' | 'low';
}

interface AIInsightsProps {
  data: DataRow[];
  salary: number;
}

const AIInsights = ({ data, salary }: AIInsightsProps) => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(false);

  const getInsights = async () => {
    if (data.length === 0) return;
    
    setLoading(true);
    try {
      const { data: result, error } = await supabase.functions.invoke('generate-insights', {
        body: { transactions: data, salary }
      });

      if (error) throw error;

      if (result?.insights) {
        setInsights(result.insights);
        toast.success('✨ Insights gerados com sucesso!');
      }
    } catch (error) {
      console.error('Error generating insights:', error);
      toast.error('Erro ao gerar insights. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (data.length > 0 && salary > 0) {
      getInsights();
    }
  }, [data.length, salary]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-success" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-warning" />;
      case 'danger': return <AlertTriangle className="w-5 h-5 text-destructive" />;
      default: return <Info className="w-5 h-5 text-info" />;
    }
  };

  const getColorClass = (type: string) => {
    switch (type) {
      case 'success': return 'border-success/30 bg-success/5';
      case 'warning': return 'border-warning/30 bg-warning/5';
      case 'danger': return 'border-destructive/30 bg-destructive/5';
      default: return 'border-info/30 bg-info/5';
    }
  };

  if (data.length === 0) return null;

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Insights IA</h3>
            <p className="text-sm text-muted-foreground">Análise inteligente das suas finanças</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={getInsights}
          disabled={loading}
          className="gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-4">
              <div className="space-y-2">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-full" />
              </div>
            </Card>
          ))}
        </div>
      ) : insights.length > 0 ? (
        <div className="grid gap-3">
          {insights.map((insight, idx) => (
            <Card
              key={idx}
              className={`p-4 border-2 transition-all hover:shadow-md ${getColorClass(insight.type)}`}
            >
              <div className="flex items-start gap-3">
                {getIcon(insight.type)}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm">{insight.title}</h4>
                    {insight.priority === 'high' && (
                      <span className="text-xs px-2 py-1 rounded-full bg-destructive/10 text-destructive font-medium">
                        Alta prioridade
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {insight.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <TrendingUp className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">
            Adicione mais transações para gerar insights personalizados
          </p>
        </Card>
      )}
    </div>
  );
};

export default AIInsights;