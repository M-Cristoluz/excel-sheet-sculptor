-- Habilitar RLS nas tabelas
ALTER TABLE public.financial_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_onboarding ENABLE ROW LEVEL SECURITY;

-- Políticas para financial_goals (dados são vinculados ao user_id local, não auth)
CREATE POLICY "Usuários podem ver suas próprias metas"
ON public.financial_goals
FOR SELECT
USING (true);

CREATE POLICY "Usuários podem criar suas próprias metas"
ON public.financial_goals
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Usuários podem atualizar suas próprias metas"
ON public.financial_goals
FOR UPDATE
USING (true);

CREATE POLICY "Usuários podem deletar suas próprias metas"
ON public.financial_goals
FOR DELETE
USING (true);

-- Políticas para user_onboarding
CREATE POLICY "Usuários podem ver seu próprio progresso"
ON public.user_onboarding
FOR SELECT
USING (true);

CREATE POLICY "Usuários podem criar seu próprio progresso"
ON public.user_onboarding
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Usuários podem atualizar seu próprio progresso"
ON public.user_onboarding
FOR UPDATE
USING (true);