import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface FloatingActionButtonProps {
  onAddTransaction: (transaction: {
    tipo: string;
    descricao: string;
    valor: number;
  }) => void;
}

export const FloatingActionButton = ({ onAddTransaction }: FloatingActionButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tipo, setTipo] = useState("Despesa");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!descricao || !valor) {
      toast.error("Preencha todos os campos!");
      return;
    }

    const valorNumerico = parseFloat(valor.replace(/[^\d,]/g, '').replace(',', '.'));
    
    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      toast.error("Valor inválido!");
      return;
    }

    onAddTransaction({
      tipo,
      descricao,
      valor: valorNumerico
    });

    // Reset form
    setDescricao("");
    setValor("");
    setTipo("Despesa");
    setIsOpen(false);

    // Success toast with celebration
    toast.success(`✨ ${tipo} adicionada!`, {
      description: `R$ ${valorNumerico.toFixed(2)} - ${descricao}`,
      duration: 3000,
    });
  };

  const formatCurrency = (value: string) => {
    // Remove tudo exceto números
    const numbers = value.replace(/\D/g, '');
    
    if (!numbers) return '';
    
    // Converte para centavos
    const cents = parseInt(numbers);
    const reais = cents / 100;
    
    return reais.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value);
    setValor(formatted);
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 h-14 w-14 sm:h-16 sm:w-16 rounded-full shadow-2xl z-50 
                   bg-gradient-to-br from-educash-green-base to-educash-green-dark 
                   hover:scale-110 transition-all duration-300 animate-float
                   hover:shadow-[0_0_30px_rgba(34,197,94,0.6)]"
        size="icon"
      >
        <Plus className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px] w-[calc(100%-2rem)] max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl font-display flex items-center gap-2">
              <span className="text-2xl sm:text-3xl">⚡</span>
              Adicionar Rápido
            </DialogTitle>
            <DialogDescription className="text-sm">
              Registre sua transação em segundos!
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 mt-3 sm:mt-4">
            <div className="space-y-2">
              <Label htmlFor="tipo" className="font-semibold text-sm">Tipo</Label>
              <Select value={tipo} onValueChange={setTipo}>
                <SelectTrigger id="tipo" className="font-ios h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Despesa">💸 Despesa</SelectItem>
                  <SelectItem value="Receita">💰 Receita</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao" className="font-semibold text-sm">Descrição</Label>
              <Input
                id="descricao"
                placeholder="Ex: Almoço, Salário, Uber..."
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                className="font-ios h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="valor" className="font-semibold text-sm">Valor (R$)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-ios text-base">
                  R$
                </span>
                <Input
                  id="valor"
                  placeholder="0,00"
                  value={valor}
                  onChange={handleValorChange}
                  className="pl-12 font-ios text-base sm:text-lg h-11"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4">
              <Button
                type="submit"
                className="w-full sm:flex-1 bg-gradient-to-r from-educash-green-base to-educash-green-dark
                         hover:scale-105 transition-all duration-300 h-11 sm:h-10 text-base sm:text-sm font-semibold"
              >
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Transação
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="w-full sm:flex-1 h-11 sm:h-10 text-base sm:text-sm"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
