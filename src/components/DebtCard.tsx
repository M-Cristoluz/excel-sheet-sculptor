import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  Home, 
  ShoppingCart, 
  Banknote,
  Calendar,
  TrendingUp,
  Trash2,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import confetti from "canvas-confetti";
import { toast } from "sonner";

interface Debt {
  id: string;
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
}

interface DebtCardProps {
  debt: Debt;
  onPayInstallment: (debtId: string) => void;
  onDelete: (debtId: string) => void;
  onComplete: (debtId: string) => void;
}

const categoryIcons: Record<string, any> = {
  "cartao-credito": CreditCard,
  "emprestimo": Banknote,
  "financiamento": Home,
  "parcelamento": ShoppingCart,
};

const categoryLabels: Record<string, string> = {
  "cartao-credito": "Cartão de Crédito",
  "emprestimo": "Empréstimo",
  "financiamento": "Financiamento",
  "parcelamento": "Parcelamento",
};

export function DebtCard({ debt, onPayInstallment, onDelete, onComplete }: DebtCardProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  
  const Icon = categoryIcons[debt.category] || CreditCard;
  const progress = (debt.installments_paid / debt.installments_total) * 100;
  const remainingAmount = (debt.installments_total - debt.installments_paid) * debt.installment_value;
  const totalInterest = (debt.total_amount * debt.interest_rate) / 100;
  const isOverdue = debt.due_day < new Date().getDate() && !debt.is_paid_off;
  const isLastInstallment = debt.installments_paid === debt.installments_total - 1;

  const handlePayInstallment = async () => {
    setIsProcessing(true);
    
    if (isLastInstallment) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      toast.success("🎉 Parabéns! Dívida quitada!");
    }
    
    await onPayInstallment(debt.id);
    setIsProcessing(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-300 border-border/50">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{debt.title}</h3>
              {debt.creditor && (
                <p className="text-sm text-muted-foreground">{debt.creditor}</p>
              )}
            </div>
          </div>
          <Badge variant={debt.is_paid_off ? "default" : "secondary"}>
            {categoryLabels[debt.category]}
          </Badge>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {debt.installments_paid}/{debt.installments_total} parcelas
            </span>
            <span className="font-semibold text-foreground">
              {progress.toFixed(0)}%
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Financial Info */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div>
            <p className="text-xs text-muted-foreground">Valor da Parcela</p>
            <p className="text-lg font-bold text-foreground">
              {formatCurrency(debt.installment_value)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Restante</p>
            <p className="text-lg font-bold text-primary">
              {formatCurrency(remainingAmount)}
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2 border-t border-border/50">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>Vence dia {debt.due_day}</span>
          </div>
          {debt.interest_rate > 0 && (
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              <span>{debt.interest_rate}% juros</span>
            </div>
          )}
        </div>

        {/* Warning if overdue */}
        {isOverdue && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Parcela em atraso</span>
          </div>
        )}

        {/* Actions */}
        {!debt.is_paid_off && (
          <div className="flex gap-2 pt-2">
            <Button
              onClick={handlePayInstallment}
              disabled={isProcessing}
              className="flex-1"
              size="sm"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Pagar Parcela
            </Button>
            <Button
              onClick={() => onDelete(debt.id)}
              variant="outline"
              size="sm"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}

        {debt.is_paid_off && (
          <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-primary/10 text-primary">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">Dívida Quitada! 🎉</span>
          </div>
        )}
      </div>
    </Card>
  );
}