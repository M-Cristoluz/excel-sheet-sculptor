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
    console.log('📝 Categorizando:', descricao);
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      console.error('❌ LOVABLE_API_KEY não configurada');
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
            content: `Você é um assistente financeiro especializado em categorizar gastos de acordo com a regra 50/30/20.

**REGRAS DE CATEGORIZAÇÃO:**

**Essencial (50%)** - Necessidades básicas e obrigatórias:
- Moradia: aluguel, condomínio, IPTU, reforma essencial
- Alimentação básica: supermercado, feira, açougue, padaria
- Transporte: gasolina, combustível, condução, transporte público, manutenção do carro, seguro
- Saúde: plano de saúde, médico, dentista, farmácia, exames
- Contas básicas: luz, água, gás, internet, telefone
- Educação obrigatória: escola, faculdade, material escolar, ESPRO
- Impostos e seguros obrigatórios
- Produtos de higiene e limpeza básicos
- Dízimos e obrigações religiosas

**Desejo (30%)** - Lazer e qualidade de vida:
- Restaurantes, delivery, fast food, lanchonetes, cafés
- Streaming (Netflix, Spotify, etc), TV a cabo, games
- Cinema, teatro, shows, eventos
- Viagens, hotéis, passeios
- Compras não essenciais: roupas, eletrônicos, decoração
- Academia, esportes, hobbies
- Salão de beleza, spa, estética
- Presentes, festas
- Upgrade de produtos (melhor marca/versão que o necessário)
- Cartão de crédito usado para compras não essenciais

**Poupança (20%)** - Investimentos e reservas:
- Investimentos (CDB, ações, fundos, tesouro)
- Poupança, reserva de emergência
- Previdência privada, aposentadoria
- Quitação de dívidas antecipada
- Fundos para objetivos de longo prazo

**IMPORTANTE:**
- Analise o contexto da descrição
- "Condução" é SEMPRE transporte essencial
- "Dízimos" é SEMPRE essencial (compromisso religioso)
- "Cartão" geralmente é para compras diversas (analisar contexto)
- "ESPRO" é educação essencial
- "Investimento" é SEMPRE poupança
- Seja consistente e use bom senso

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
      console.error('❌ Erro na API:', response.status, await response.text());
      
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

    console.log('✅ Resultado:', descricao, '→', categoriaFinal);

    return new Response(
      JSON.stringify({ categoria: categoriaFinal }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Erro ao categorizar transação:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
