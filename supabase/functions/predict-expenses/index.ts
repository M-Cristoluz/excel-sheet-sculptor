import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Transaction {
  tipo: string;
  valor: number;
  categoria?: string;
  mes: string;
  ano: number;
}

// Input validation
const validateInput = (transactions: unknown) => {
  if (!Array.isArray(transactions)) {
    throw new Error('Transações devem ser um array');
  }
  if (transactions.length > 1000) {
    throw new Error('Máximo de 1000 transações permitidas');
  }
  
  for (const t of transactions) {
    if (typeof t.tipo !== 'string' || typeof t.valor !== 'number') {
      throw new Error('Formato de transação inválido');
    }
    if (!isFinite(t.valor) || t.valor < 0) {
      throw new Error('Valor de transação inválido');
    }
  }
  
  return transactions as Transaction[];
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Autenticação necessária');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error('Usuário não autenticado');
    }

    const body = await req.json();
    const transactions = validateInput(body.transactions);

    console.log(`[${user.id}] Predizendo gastos para ${transactions.length} transações`);

    // Analisar histórico de gastos
    const monthlyExpenses: { [key: string]: number } = {};
    const categoryExpenses: { [key: string]: number[] } = {};

    transactions.forEach((t) => {
      if (t.tipo.toLowerCase() === 'saída' || t.tipo.toLowerCase() === 'saida') {
        // Por mês
        const monthKey = `${t.mes}-${t.ano}`;
        monthlyExpenses[monthKey] = (monthlyExpenses[monthKey] || 0) + t.valor;

        // Por categoria
        const cat = t.categoria || 'Outros';
        if (!categoryExpenses[cat]) categoryExpenses[cat] = [];
        categoryExpenses[cat].push(t.valor);
      }
    });

    // Calcular médias e predições
    const monthlyValues = Object.values(monthlyExpenses);
    const avgMonthly = monthlyValues.reduce((a, b) => a + b, 0) / (monthlyValues.length || 1);
    
    // Tendência (últimos 3 meses vs total)
    const recent = monthlyValues.slice(-3);
    const avgRecent = recent.reduce((a, b) => a + b, 0) / (recent.length || 1);
    const trend = avgRecent > avgMonthly ? 'increasing' : 'decreasing';
    const trendPercent = ((avgRecent - avgMonthly) / avgMonthly) * 100;

    // Predições por categoria
    const categoryPredictions = Object.entries(categoryExpenses).map(([category, values]) => {
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      const max = Math.max(...values);
      const min = Math.min(...values);
      
      return {
        category,
        predicted: avg,
        min,
        max,
        confidence: values.length >= 3 ? 'high' : values.length >= 2 ? 'medium' : 'low'
      };
    }).sort((a, b) => b.predicted - a.predicted);

    const predictions = {
      nextMonth: avgRecent,
      trend,
      trendPercent: Math.abs(trendPercent),
      avgMonthly,
      categories: categoryPredictions.slice(0, 5),
      recommendations: generateRecommendations(avgRecent, avgMonthly, trend)
    };

    console.log(`[${user.id}] Predição: R$ ${avgRecent.toFixed(2)} (${trend})`);

    return new Response(JSON.stringify(predictions), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Erro:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      }), {
      status: error instanceof Error && error.message.includes('autenticação') ? 401 : 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function generateRecommendations(recent: number, average: number, trend: string): string[] {
  const recommendations = [];
  
  if (trend === 'increasing') {
    recommendations.push('Seus gastos estão em tendência de alta. Revise suas despesas não essenciais.');
    recommendations.push('Considere criar um orçamento mais rígido para o próximo mês.');
  } else {
    recommendations.push('Parabéns! Seus gastos estão diminuindo. Continue assim!');
    recommendations.push('Aproveite para aumentar sua poupança este mês.');
  }

  if (recent > average * 1.2) {
    recommendations.push('⚠️ Seus gastos recentes estão 20% acima da sua média. Atenção!');
  }

  return recommendations;
}
