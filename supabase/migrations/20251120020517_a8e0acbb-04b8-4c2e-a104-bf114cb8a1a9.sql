-- Remove temp-user bypass from all RLS policies for security
-- This ensures only authenticated users can access their own data

-- Drop existing policies for transactions
DROP POLICY IF EXISTS "Usuários podem ver suas próprias transações" ON public.transactions;
DROP POLICY IF EXISTS "Usuários podem criar suas próprias transações" ON public.transactions;
DROP POLICY IF EXISTS "Usuários podem atualizar suas próprias transações" ON public.transactions;
DROP POLICY IF EXISTS "Usuários podem deletar suas próprias transações" ON public.transactions;

-- Create new secure policies for transactions (auth.uid() only)
CREATE POLICY "Usuários podem ver suas próprias transações"
ON public.transactions FOR SELECT
USING (user_id = (current_setting('request.jwt.claims'::text, true)::json ->> 'sub'::text));

CREATE POLICY "Usuários podem criar suas próprias transações"
ON public.transactions FOR INSERT
WITH CHECK (user_id = (current_setting('request.jwt.claims'::text, true)::json ->> 'sub'::text));

CREATE POLICY "Usuários podem atualizar suas próprias transações"
ON public.transactions FOR UPDATE
USING (user_id = (current_setting('request.jwt.claims'::text, true)::json ->> 'sub'::text));

CREATE POLICY "Usuários podem deletar suas próprias transações"
ON public.transactions FOR DELETE
USING (user_id = (current_setting('request.jwt.claims'::text, true)::json ->> 'sub'::text));

-- Drop existing policies for financial_goals
DROP POLICY IF EXISTS "Usuários podem ver suas próprias metas" ON public.financial_goals;
DROP POLICY IF EXISTS "Usuários podem criar suas próprias metas" ON public.financial_goals;
DROP POLICY IF EXISTS "Usuários podem atualizar suas próprias metas" ON public.financial_goals;
DROP POLICY IF EXISTS "Usuários podem deletar suas próprias metas" ON public.financial_goals;

-- Create new secure policies for financial_goals
CREATE POLICY "Usuários podem ver suas próprias metas"
ON public.financial_goals FOR SELECT
USING (user_id = (current_setting('request.jwt.claims'::text, true)::json ->> 'sub'::text));

CREATE POLICY "Usuários podem criar suas próprias metas"
ON public.financial_goals FOR INSERT
WITH CHECK (user_id = (current_setting('request.jwt.claims'::text, true)::json ->> 'sub'::text));

CREATE POLICY "Usuários podem atualizar suas próprias metas"
ON public.financial_goals FOR UPDATE
USING (user_id = (current_setting('request.jwt.claims'::text, true)::json ->> 'sub'::text));

CREATE POLICY "Usuários podem deletar suas próprias metas"
ON public.financial_goals FOR DELETE
USING (user_id = (current_setting('request.jwt.claims'::text, true)::json ->> 'sub'::text));

-- Drop existing policies for debts
DROP POLICY IF EXISTS "Usuários podem ver suas próprias dívidas" ON public.debts;
DROP POLICY IF EXISTS "Usuários podem criar suas próprias dívidas" ON public.debts;
DROP POLICY IF EXISTS "Usuários podem atualizar suas próprias dívidas" ON public.debts;
DROP POLICY IF EXISTS "Usuários podem deletar suas próprias dívidas" ON public.debts;

-- Create new secure policies for debts
CREATE POLICY "Usuários podem ver suas próprias dívidas"
ON public.debts FOR SELECT
USING (user_id = (current_setting('request.jwt.claims'::text, true)::json ->> 'sub'::text));

CREATE POLICY "Usuários podem criar suas próprias dívidas"
ON public.debts FOR INSERT
WITH CHECK (user_id = (current_setting('request.jwt.claims'::text, true)::json ->> 'sub'::text));

CREATE POLICY "Usuários podem atualizar suas próprias dívidas"
ON public.debts FOR UPDATE
USING (user_id = (current_setting('request.jwt.claims'::text, true)::json ->> 'sub'::text));

CREATE POLICY "Usuários podem deletar suas próprias dívidas"
ON public.debts FOR DELETE
USING (user_id = (current_setting('request.jwt.claims'::text, true)::json ->> 'sub'::text));

-- Drop existing policies for user_onboarding
DROP POLICY IF EXISTS "Usuários podem ver seu próprio progresso" ON public.user_onboarding;
DROP POLICY IF EXISTS "Usuários podem criar seu próprio progresso" ON public.user_onboarding;
DROP POLICY IF EXISTS "Usuários podem atualizar seu próprio progresso" ON public.user_onboarding;

-- Create new secure policies for user_onboarding
CREATE POLICY "Usuários podem ver seu próprio progresso"
ON public.user_onboarding FOR SELECT
USING (user_id = (current_setting('request.jwt.claims'::text, true)::json ->> 'sub'::text));

CREATE POLICY "Usuários podem criar seu próprio progresso"
ON public.user_onboarding FOR INSERT
WITH CHECK (user_id = (current_setting('request.jwt.claims'::text, true)::json ->> 'sub'::text));

CREATE POLICY "Usuários podem atualizar seu próprio progresso"
ON public.user_onboarding FOR UPDATE
USING (user_id = (current_setting('request.jwt.claims'::text, true)::json ->> 'sub'::text));