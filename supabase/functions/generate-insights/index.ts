import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { transactions, salary } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Preparar dados para análise
    const totalReceitas = transactions
      .filter((t: any) => {
        const tipo = t.tipo.toLowerCase();
        return tipo === 'entrada' || tipo === 'receita';
      })
      .reduce((sum: number, t: any) => sum + t.valor, 0);
    
    const totalDespesas = transactions
      .filter((t: any) => {
        const tipo = t.tipo.toLowerCase();
        return tipo === 'saída' || tipo === 'saida' || tipo === 'despesa';
      })
      .reduce((sum: number, t: any) => sum + t.valor, 0);

    const saldo = totalReceitas - totalDespesas;
    
    // Categorias mais gastas
    const categorias = transactions
      .filter((t: any) => {
        const tipo = t.tipo.toLowerCase();
        return tipo === 'saída' || tipo === 'saida' || tipo === 'despesa';
      })
      .reduce((acc: any, t: any) => {
        const cat = t.categoria || 'Sem categoria';
        acc[cat] = (acc[cat] || 0) + t.valor;
        return acc;
      }, {});

    const prompt = `Você é um consultor financeiro especializado. Analise os dados financeiros abaixo e gere 3-5 insights CURTOS e ACIONÁVEIS em português brasileiro.

Dados:
- Salário: R$ ${salary.toFixed(2)}
- Total Receitas: R$ ${totalReceitas.toFixed(2)}
- Total Despesas: R$ ${totalDespesas.toFixed(2)}
- Saldo: R$ ${saldo.toFixed(2)}
- Gastos por categoria: ${JSON.stringify(categorias)}
- Total de transações: ${transactions.length}

Retorne um JSON com este formato EXATO:
{
  "insights": [
    {
      "title": "Título curto do insight",
      "description": "Descrição acionável em 1-2 frases",
      "type": "success" | "warning" | "danger" | "info",
      "priority": "high" | "medium" | "low"
    }
  ]
}

Foque em:
- Padrões de gastos preocupantes ou positivos
- Comparação com regra 50/30/20
- Oportunidades de economia
- Riscos financeiros`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'Você é um consultor financeiro. Sempre responda com JSON válido.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Tentar extrair JSON da resposta
    let insights;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        insights = JSON.parse(jsonMatch[0]);
      } else {
        insights = JSON.parse(content);
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      // Fallback com insights padrão
      insights = {
        insights: [
          {
            title: "Análise em andamento",
            description: "Estamos processando seus dados financeiros para gerar insights personalizados.",
            type: "info",
            priority: "low"
          }
        ]
      };
    }

    return new Response(JSON.stringify(insights), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-insights:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        insights: []
      }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});