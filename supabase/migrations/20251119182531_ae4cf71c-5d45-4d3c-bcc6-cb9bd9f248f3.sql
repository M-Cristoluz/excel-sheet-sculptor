-- Primeiro dropar o trigger
DROP TRIGGER IF EXISTS refresh_summary_on_transaction ON public.transactions;

-- Depois dropar a função
DROP FUNCTION IF EXISTS refresh_financial_summary();

-- Recriar função com search_path correto
CREATE OR REPLACE FUNCTION refresh_financial_summary()
RETURNS trigger AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.user_financial_summary;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public;

-- Recriar trigger
CREATE TRIGGER refresh_summary_on_transaction
AFTER INSERT OR UPDATE OR DELETE ON public.transactions
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_financial_summary();

-- Revogar acesso público à materialized view
REVOKE ALL ON public.user_financial_summary FROM PUBLIC;
REVOKE ALL ON public.user_financial_summary FROM anon;
REVOKE ALL ON public.user_financial_summary FROM authenticated;