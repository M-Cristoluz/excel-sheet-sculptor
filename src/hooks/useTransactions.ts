import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Transaction {
  id?: string;
  user_id?: string;
  data: string;
  mes?: string;
  ano?: number;
  tipo: string;
  descricao: string;
  valor: number;
  categoria?: string | null;
  created_at?: string;
  updated_at?: string;
}

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch transactions
  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', 'temp-user')
        .order('data', { ascending: false });

      if (fetchError) {
        console.error('Erro ao buscar transações:', fetchError);
        throw fetchError;
      }

      setTransactions(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      console.error('Erro ao carregar transações:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Add transaction
  const addTransaction = async (transaction: Transaction) => {
    try {
      const { data, error: insertError } = await supabase
        .from('transactions')
        .insert([{
          user_id: 'temp-user',
          data: transaction.data,
          mes: transaction.mes || new Date(transaction.data).toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase(),
          ano: transaction.ano || new Date(transaction.data).getFullYear(),
          tipo: transaction.tipo,
          descricao: transaction.descricao,
          valor: transaction.valor,
          categoria: transaction.categoria
        }])
        .select()
        .single();

      if (insertError) {
        console.error('Erro ao adicionar transação:', insertError);
        throw insertError;
      }

      setTransactions(prev => [data, ...prev]);
      toast.success('Transação adicionada com sucesso!');
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar transação';
      toast.error(errorMessage);
      console.error('Erro ao adicionar transação:', err);
      throw err;
    }
  };

  // Bulk add transactions (for Excel import)
  const addTransactions = async (newTransactions: Transaction[]) => {
    try {
      const transactionsToInsert = newTransactions.map(t => ({
        user_id: 'temp-user',
        data: t.data,
        mes: t.mes || new Date(t.data).toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase(),
        ano: t.ano || new Date(t.data).getFullYear(),
        tipo: t.tipo,
        descricao: t.descricao,
        valor: t.valor,
        categoria: t.categoria
      }));

      const { data, error: insertError } = await supabase
        .from('transactions')
        .insert(transactionsToInsert)
        .select();

      if (insertError) {
        console.error('Erro ao adicionar transações:', insertError);
        throw insertError;
      }

      await fetchTransactions(); // Reload all
      toast.success(`${data?.length || 0} transações adicionadas com sucesso!`);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar transações';
      toast.error(errorMessage);
      console.error('Erro ao adicionar transações em lote:', err);
      throw err;
    }
  };

  // Update transaction
  const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
    try {
      const { data, error: updateError } = await supabase
        .from('transactions')
        .update(updates)
        .eq('id', id)
        .eq('user_id', 'temp-user')
        .select()
        .single();

      if (updateError) {
        console.error('Erro ao atualizar transação:', updateError);
        throw updateError;
      }

      setTransactions(prev => 
        prev.map(t => t.id === id ? data : t)
      );
      toast.success('Transação atualizada com sucesso!');
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar transação';
      toast.error(errorMessage);
      console.error('Erro ao atualizar transação:', err);
      throw err;
    }
  };

  // Delete transaction
  const deleteTransaction = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id)
        .eq('user_id', 'temp-user');

      if (deleteError) {
        console.error('Erro ao deletar transação:', deleteError);
        throw deleteError;
      }

      setTransactions(prev => prev.filter(t => t.id !== id));
      toast.success('Transação removida com sucesso!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar transação';
      toast.error(errorMessage);
      console.error('Erro ao deletar transação:', err);
      throw err;
    }
  };

  // Clear all transactions
  const clearAllTransactions = async () => {
    try {
      const { error: deleteError } = await supabase
        .from('transactions')
        .delete()
        .eq('user_id', 'temp-user');

      if (deleteError) {
        console.error('Erro ao limpar transações:', deleteError);
        throw deleteError;
      }

      setTransactions([]);
      toast.success('Todas as transações foram removidas!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao limpar transações';
      toast.error(errorMessage);
      console.error('Erro ao limpar transações:', err);
      throw err;
    }
  };

  // Calculate summary
  const calculateSummary = () => {
    const receitas = transactions
      .filter(t => {
        const tipo = t.tipo.toLowerCase();
        return tipo.includes('receita') || tipo.includes('entrada') || tipo === 'renda extra';
      })
      .reduce((sum, t) => sum + Number(t.valor), 0);

    const despesas = transactions
      .filter(t => {
        const tipo = t.tipo.toLowerCase();
        return tipo.includes('despesa') || tipo.includes('saída') || tipo === 'pagamento de parcela';
      })
      .reduce((sum, t) => sum + Number(t.valor), 0);

    const essenciais = transactions
      .filter(t => t.categoria === 'Essencial')
      .reduce((sum, t) => sum + Number(t.valor), 0);

    const desejos = transactions
      .filter(t => t.categoria === 'Desejo')
      .reduce((sum, t) => sum + Number(t.valor), 0);

    const poupanca = transactions
      .filter(t => t.categoria === 'Poupança')
      .reduce((sum, t) => sum + Number(t.valor), 0);

    return {
      totalTransactions: transactions.length,
      receitas,
      despesas,
      saldo: receitas - despesas,
      essenciais,
      desejos,
      poupanca
    };
  };

  // Initial fetch
  useEffect(() => {
    fetchTransactions();
  }, []);

  return {
    transactions,
    isLoading,
    error,
    addTransaction,
    addTransactions,
    updateTransaction,
    deleteTransaction,
    clearAllTransactions,
    calculateSummary,
    refetch: fetchTransactions
  };
};