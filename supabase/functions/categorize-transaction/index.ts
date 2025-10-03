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
    const { descricao } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY não configurada');
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `Você é um assistente financeiro que categoriza gastos de acordo com a regra 50/30/20:
- Essencial (50%): Moradia, alimentação, transporte, saúde, contas básicas
- Desejo (30%): Lazer, entretenimento, restaurantes, compras não essenciais, hobbies
- Poupança (20%): Investimentos, reserva de emergência, aposentadoria

Responda APENAS com uma das três palavras: "Essencial", "Desejo" ou "Poupança".`
          },
          {
            role: 'user',
            content: `Categorize este gasto: "${descricao}"`
          }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Limite de requisições excedido. Tente novamente mais tarde.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Créditos insuficientes. Adicione créditos ao seu workspace.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      throw new Error('Erro ao chamar a API');
    }

    const data = await response.json();
    const categoria = data.choices[0].message.content.trim();

    // Validar resposta
    const categoriasValidas = ['Essencial', 'Desejo', 'Poupança'];
    const categoriaFinal = categoriasValidas.includes(categoria) ? categoria : 'Desejo';

    return new Response(
      JSON.stringify({ categoria: categoriaFinal }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erro ao categorizar transação:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
