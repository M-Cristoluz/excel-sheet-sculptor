import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface DebtFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (debt: DebtFormData) => void;
}

export interface DebtFormData {
  title: string;
  description?: string;
  total_amount: number;
  installments_total: number;
  due_day: number;
  interest_rate: number;
  start_date: Date;
  category: string;
  creditor?: string;
}

export function DebtForm({ open, onClose, onSubmit }: DebtFormProps) {
  const [formData, setFormData] = useState<DebtFormData>({
    title: "",
    description: "",
    total_amount: 0,
    installments_total: 1,
    due_day: 1,
    interest_rate: 0,
    start_date: new Date(),
    category: "parcelamento",
    creditor: "",
  });

  const [displayAmount, setDisplayAmount] = useState("");
  const [startDate, setStartDate] = useState<Date>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || formData.total_amount <= 0 || formData.installments_total <= 0) {
      return;
    }

    onSubmit({
      ...formData,
      start_date: startDate || new Date(),
    });

    // Reset form
    setFormData({
      title: "",
      description: "",
      total_amount: 0,
      installments_total: 1,
      due_day: 1,
      interest_rate: 0,
      start_date: new Date(),
      category: "parcelamento",
      creditor: "",
    });
    setDisplayAmount("");
    setStartDate(undefined);
  };

  const formatCurrency = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    const amount = Number(numbers) / 100;
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value);
    setDisplayAmount(formatted);
    const numbers = e.target.value.replace(/\D/g, "");
    setFormData({ ...formData, total_amount: Number(numbers) / 100 });
  };

  const installmentValue = formData.total_amount / formData.installments_total;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Nova Dívida</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome da Dívida */}
          <div className="space-y-2">
            <Label htmlFor="title">Nome da Dívida *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ex: Cartão Visa, Financiamento Sofá..."
              required
            />
          </div>

          {/* Categoria */}
          <div className="space-y-2">
            <Label htmlFor="category">Categoria *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="parcelamento">Parcelamento</SelectItem>
                <SelectItem value="cartao-credito">Cartão de Crédito</SelectItem>
                <SelectItem value="emprestimo">Empréstimo</SelectItem>
                <SelectItem value="financiamento">Financiamento</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Credor */}
          <div className="space-y-2">
            <Label htmlFor="creditor">Credor (Opcional)</Label>
            <Input
              id="creditor"
              value={formData.creditor}
              onChange={(e) => setFormData({ ...formData, creditor: e.target.value })}
              placeholder="Ex: Banco X, Loja Y..."
            />
          </div>

          {/* Valor Total */}
          <div className="space-y-2">
            <Label htmlFor="amount">Valor Total *</Label>
            <Input
              id="amount"
              value={displayAmount}
              onChange={handleAmountChange}
              placeholder="R$ 0,00"
              required
            />
          </div>

          {/* Número de Parcelas */}
          <div className="space-y-2">
            <Label htmlFor="installments">Número de Parcelas *</Label>
            <Input
              id="installments"
              type="number"
              min="1"
              value={formData.installments_total}
              onChange={(e) =>
                setFormData({ ...formData, installments_total: Number(e.target.value) })
              }
              required
            />
            {formData.total_amount > 0 && formData.installments_total > 0 && (
              <p className="text-sm text-muted-foreground">
                Valor por parcela:{" "}
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(installmentValue)}
              </p>
            )}
          </div>

          {/* Dia do Vencimento */}
          <div className="space-y-2">
            <Label htmlFor="due_day">Dia do Vencimento *</Label>
            <Input
              id="due_day"
              type="number"
              min="1"
              max="31"
              value={formData.due_day}
              onChange={(e) => setFormData({ ...formData, due_day: Number(e.target.value) })}
              required
            />
          </div>

          {/* Taxa de Juros */}
          <div className="space-y-2">
            <Label htmlFor="interest">Taxa de Juros (% ao mês)</Label>
            <Input
              id="interest"
              type="number"
              min="0"
              step="0.01"
              value={formData.interest_rate}
              onChange={(e) =>
                setFormData({ ...formData, interest_rate: Number(e.target.value) })
              }
              placeholder="0"
            />
          </div>

          {/* Data de Início */}
          <div className="space-y-2">
            <Label>Data de Início</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP", { locale: ptBR }) : "Selecione uma data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição (Opcional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Adicione observações sobre esta dívida..."
              rows={3}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              Adicionar Dívida
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}