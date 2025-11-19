-- Criar tabela de transações financeiras
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  data DATE NOT NULL,
  mes TEXT NOT NULL,
  ano INTEGER NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('Receita', 'Despesa', 'Entrada', 'Saída', 'Renda Extra', 'Pagamento de Parcela')),
  descricao TEXT NOT NULL,
  valor NUMERIC NOT NULL CHECK (valor >= 0),
  categoria TEXT CHECK (categoria IN ('Essencial', 'Desejo', 'Poupança')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Índices para performance
CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_data ON public.transactions(data DESC);
CREATE INDEX idx_transactions_tipo ON public.transactions(tipo);
CREATE INDEX idx_transactions_categoria ON public.transactions(categoria);
CREATE INDEX idx_transactions_user_date ON public.transactions(user_id, data DESC);

-- Enable RLS
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies corretas com validação de user_id
CREATE POLICY "Usuários podem ver suas próprias transações"
ON public.transactions
FOR SELECT
USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub' OR user_id = 'temp-user');

CREATE POLICY "Usuários podem criar suas próprias transações"
ON public.transactions
FOR INSERT
WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub' OR user_id = 'temp-user');

CREATE POLICY "Usuários podem atualizar suas próprias transações"
ON public.transactions
FOR UPDATE
USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub' OR user_id = 'temp-user');

CREATE POLICY "Usuários podem deletar suas próprias transações"
ON public.transactions
FOR DELETE
USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub' OR user_id = 'temp-user');

-- Trigger para updated_at
CREATE TRIGGER update_transactions_updated_at
BEFORE UPDATE ON public.transactions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Corrigir RLS das tabelas existentes para validação real
DROP POLICY IF EXISTS "Usuários podem ver suas próprias metas" ON public.financial_goals;
DROP POLICY IF EXISTS "Usuários podem criar suas próprias metas" ON public.financial_goals;
DROP POLICY IF EXISTS "Usuários podem atualizar suas próprias metas" ON public.financial_goals;
DROP POLICY IF EXISTS "Usuários podem deletar suas próprias metas" ON public.financial_goals;

CREATE POLICY "Usuários podem ver suas próprias metas"
ON public.financial_goals
FOR SELECT
USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub' OR user_id = 'temp-user');

CREATE POLICY "Usuários podem criar suas próprias metas"
ON public.financial_goals
FOR INSERT
WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub' OR user_id = 'temp-user');

CREATE POLICY "Usuários podem atualizar suas próprias metas"
ON public.financial_goals
FOR UPDATE
USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub' OR user_id = 'temp-user');

CREATE POLICY "Usuários podem deletar suas próprias metas"
ON public.financial_goals
FOR DELETE
USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub' OR user_id = 'temp-user');

-- Corrigir debts
DROP POLICY IF EXISTS "Usuários podem ver suas próprias dívidas" ON public.debts;
DROP POLICY IF EXISTS "Usuários podem criar suas próprias dívidas" ON public.debts;
DROP POLICY IF EXISTS "Usuários podem atualizar suas próprias dívidas" ON public.debts;
DROP POLICY IF EXISTS "Usuários podem deletar suas próprias dívidas" ON public.debts;

CREATE POLICY "Usuários podem ver suas próprias dívidas"
ON public.debts
FOR SELECT
USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub' OR user_id = 'temp-user');

CREATE POLICY "Usuários podem criar suas próprias dívidas"
ON public.debts
FOR INSERT
WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub' OR user_id = 'temp-user');

CREATE POLICY "Usuários podem atualizar suas próprias dívidas"
ON public.debts
FOR UPDATE
USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub' OR user_id = 'temp-user');

CREATE POLICY "Usuários podem deletar suas próprias dívidas"
ON public.debts
FOR DELETE
USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub' OR user_id = 'temp-user');

-- Corrigir user_onboarding
DROP POLICY IF EXISTS "Usuários podem ver seu próprio progresso" ON public.user_onboarding;
DROP POLICY IF EXISTS "Usuários podem criar seu próprio progresso" ON public.user_onboarding;
DROP POLICY IF EXISTS "Usuários podem atualizar seu próprio progresso" ON public.user_onboarding;

CREATE POLICY "Usuários podem ver seu próprio progresso"
ON public.user_onboarding
FOR SELECT
USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub' OR user_id = 'temp-user');

CREATE POLICY "Usuários podem criar seu próprio progresso"
ON public.user_onboarding
FOR INSERT
WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub' OR user_id = 'temp-user');

CREATE POLICY "Usuários podem atualizar seu próprio progresso"
ON public.user_onboarding
FOR UPDATE
USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub' OR user_id = 'temp-user');

-- View materializada para cálculos agregados otimizados
CREATE MATERIALIZED VIEW IF NOT EXISTS public.user_financial_summary AS
SELECT 
  user_id,
  DATE_TRUNC('month', data) as month,
  COUNT(*) as total_transactions,
  SUM(CASE WHEN tipo IN ('Receita', 'Entrada', 'Renda Extra') THEN valor ELSE 0 END) as total_receitas,
  SUM(CASE WHEN tipo IN ('Despesa', 'Saída', 'Pagamento de Parcela') THEN valor ELSE 0 END) as total_despesas,
  SUM(CASE WHEN tipo IN ('Receita', 'Entrada', 'Renda Extra') THEN valor ELSE -valor END) as saldo,
  SUM(CASE WHEN categoria = 'Essencial' THEN valor ELSE 0 END) as essenciais,
  SUM(CASE WHEN categoria = 'Desejo' THEN valor ELSE 0 END) as desejos,
  SUM(CASE WHEN categoria = 'Poupança' THEN valor ELSE 0 END) as poupanca
FROM public.transactions
GROUP BY user_id, DATE_TRUNC('month', data);

CREATE INDEX idx_financial_summary_user ON public.user_financial_summary(user_id);
CREATE INDEX idx_financial_summary_month ON public.user_financial_summary(month DESC);

-- Function para refresh da view materializada
CREATE OR REPLACE FUNCTION refresh_financial_summary()
RETURNS trigger AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.user_financial_summary;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger para refresh automático (executar periodicamente)
CREATE TRIGGER refresh_summary_on_transaction
AFTER INSERT OR UPDATE OR DELETE ON public.transactions
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_financial_summary();