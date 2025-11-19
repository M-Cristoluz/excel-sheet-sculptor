-- Criar tabela de dívidas/parcelamentos
CREATE TABLE public.debts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  total_amount NUMERIC NOT NULL,
  installments_total INTEGER NOT NULL,
  installments_paid INTEGER NOT NULL DEFAULT 0,
  installment_value NUMERIC NOT NULL,
  due_day INTEGER NOT NULL CHECK (due_day >= 1 AND due_day <= 31),
  interest_rate NUMERIC DEFAULT 0,
  start_date DATE NOT NULL,
  category TEXT NOT NULL,
  creditor TEXT,
  is_paid_off BOOLEAN NOT NULL DEFAULT false,
  paid_off_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.debts ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Usuários podem ver suas próprias dívidas"
ON public.debts
FOR SELECT
USING (true);

CREATE POLICY "Usuários podem criar suas próprias dívidas"
ON public.debts
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Usuários podem atualizar suas próprias dívidas"
ON public.debts
FOR UPDATE
USING (true);

CREATE POLICY "Usuários podem deletar suas próprias dívidas"
ON public.debts
FOR DELETE
USING (true);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_debts_updated_at
BEFORE UPDATE ON public.debts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Índices para performance
CREATE INDEX idx_debts_user_id ON public.debts(user_id);
CREATE INDEX idx_debts_is_paid_off ON public.debts(is_paid_off);
CREATE INDEX idx_debts_due_day ON public.debts(due_day);