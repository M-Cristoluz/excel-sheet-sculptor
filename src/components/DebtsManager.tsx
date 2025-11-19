import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DebtCard } from "./DebtCard";
import { DebtForm, DebtFormData } from "./DebtForm";
import { Plus, TrendingDown, Calendar, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import confetti from "canvas-confetti";

interface Debt {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  total_amount: number;
  installments_total: number;
  installments_paid: number;
  installment_value: number;
  due_day: number;
  interest_rate: number;
  start_date: string;
  category: string;
  creditor?: string;
  is_paid_off: boolean;
  paid_off_at?: string;
}

export function DebtsManager() {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDebts();
  }, []);

  const fetchDebts = async () => {
    try {
      const { data, error } = await supabase
        .from("debts")
        .select("*")
        .order("is_paid_off", { ascending: true })
        .order("due_day", { ascending: true });

      if (error) throw error;
      setDebts(data || []);
    } catch (error) {
      console.error("Erro ao buscar dívidas:", error);
      toast.error("Erro ao carregar dívidas");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddDebt = async (formData: DebtFormData) => {
    try {
      const installmentValue = formData.total_amount / formData.installments_total;

      const { error } = await supabase.from("debts").insert({
        user_id: "temp-user",
        title: formData.title,
        description: formData.description,
        total_amount: formData.total_amount,
        installments_total: formData.installments_total,
        installment_value: installmentValue,
        due_day: formData.due_day,
        interest_rate: formData.interest_rate,
        start_date: formData.start_date.toISOString().split("T")[0],
        category: formData.category,
        creditor: formData.creditor,
      });

      if (error) throw error;

      toast.success("Dívida adicionada com sucesso!");
      setIsFormOpen(false);
      fetchDebts();
    } catch (error) {
      console.error("Erro ao adicionar dívida:", error);
      toast.error("Erro ao adicionar dívida");
    }
  };

  const handlePayInstallment = async (debtId: string) => {
    try {
      const debt = debts.find((d) => d.id === debtId);
      if (!debt) return;

      const newInstallmentsPaid = debt.installments_paid + 1;
      const isPaidOff = newInstallmentsPaid >= debt.installments_total;

      const updateData: any = {
        installments_paid: newInstallmentsPaid,
        is_paid_off: isPaidOff,
      };

      if (isPaidOff) {
        updateData.paid_off_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from("debts")
        .update(updateData)
        .eq("id", debtId);

      if (error) throw error;

      if (isPaidOff) {
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.6 },
        });
        toast.success("🎉 Parabéns! Dívida quitada completamente!");
      } else {
        toast.success(`Parcela ${newInstallmentsPaid}/${debt.installments_total} paga!`);
      }

      fetchDebts();
    } catch (error) {
      console.error("Erro ao pagar parcela:", error);
      toast.error("Erro ao registrar pagamento");
    }
  };

  const handleDeleteDebt = async (debtId: string) => {
    try {
      const { error } = await supabase.from("debts").delete().eq("id", debtId);

      if (error) throw error;

      toast.success("Dívida removida");
      fetchDebts();
    } catch (error) {
      console.error("Erro ao deletar dívida:", error);
      toast.error("Erro ao remover dívida");
    }
  };

  const handleCompleteDebt = async (debtId: string) => {
    try {
      const { error } = await supabase
        .from("debts")
        .update({
          is_paid_off: true,
          paid_off_at: new Date().toISOString(),
          installments_paid: debts.find((d) => d.id === debtId)?.installments_total || 0,
        })
        .eq("id", debtId);

      if (error) throw error;

      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
      });
      toast.success("🎉 Dívida marcada como quitada!");
      fetchDebts();
    } catch (error) {
      console.error("Erro ao completar dívida:", error);
      toast.error("Erro ao marcar como quitada");
    }
  };

  const activeDebts = debts.filter((d) => !d.is_paid_off);
  const totalDebt = activeDebts.reduce(
    (sum, debt) =>
      sum + (debt.installments_total - debt.installments_paid) * debt.installment_value,
    0
  );
  const monthlyPayments = activeDebts.reduce((sum, debt) => sum + debt.installment_value, 0);
  const overdueDebts = activeDebts.filter(
    (d) => d.due_day < new Date().getDate() && d.installments_paid < d.installments_total
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-gradient-to-br from-primary/5 to-primary/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <TrendingDown className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total em Dívidas</p>
              <p className="text-2xl font-bold text-foreground">{formatCurrency(totalDebt)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-secondary/5 to-secondary/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-secondary/20">
              <Calendar className="w-5 h-5 text-secondary-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Parcelas Mensais</p>
              <p className="text-2xl font-bold text-foreground">{formatCurrency(monthlyPayments)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-destructive/5 to-destructive/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-destructive/20">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Dívidas Ativas</p>
              <p className="text-2xl font-bold text-foreground">{activeDebts.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Warning for overdue debts */}
      {overdueDebts.length > 0 && (
        <Card className="p-4 bg-destructive/10 border-destructive/20">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            <div>
              <p className="font-semibold text-destructive">
                {overdueDebts.length} dívida(s) com parcela(s) em atraso
              </p>
              <p className="text-sm text-destructive/80">
                Verifique as dívidas marcadas e regularize os pagamentos
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Minhas Dívidas</h2>
        <Button onClick={() => setIsFormOpen(true)} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Dívida
        </Button>
      </div>

      {/* Debts Grid */}
      {debts.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 rounded-full bg-primary/10">
              <TrendingDown className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Nenhuma dívida cadastrada
              </h3>
              <p className="text-muted-foreground mb-4">
                Comece adicionando suas dívidas e parcelamentos para acompanhar o progresso
              </p>
              <Button onClick={() => setIsFormOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Primeira Dívida
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {debts.map((debt) => (
            <DebtCard
              key={debt.id}
              debt={debt}
              onPayInstallment={handlePayInstallment}
              onDelete={handleDeleteDebt}
              onComplete={handleCompleteDebt}
            />
          ))}
        </div>
      )}

      {/* Add Debt Form */}
      <DebtForm open={isFormOpen} onClose={() => setIsFormOpen(false)} onSubmit={handleAddDebt} />
    </div>
  );
}