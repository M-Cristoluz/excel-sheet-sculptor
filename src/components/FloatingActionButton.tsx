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
        className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-2xl z-50 
                   bg-gradient-to-br from-educash-green-base to-educash-green-dark 
                   hover:scale-110 transition-all duration-300 animate-float
                   hover:shadow-[0_0_30px_rgba(34,197,94,0.6)]"
        size="icon"
      >
        <Plus className="h-8 w-8 text-white" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-display flex items-center gap-2">
              <span className="text-3xl">⚡</span>
              Adicionar Rápido
            </DialogTitle>
            <DialogDescription>
              Registre sua transação em segundos!
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="tipo" className="font-semibold">Tipo</Label>
              <Select value={tipo} onValueChange={setTipo}>
                <SelectTrigger id="tipo" className="font-ios">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Despesa">💸 Despesa</SelectItem>
                  <SelectItem value="Receita">💰 Receita</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao" className="font-semibold">Descrição</Label>
              <Input
                id="descricao"
                placeholder="Ex: Almoço, Salário, Uber..."
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                className="font-ios"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="valor" className="font-semibold">Valor</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-ios">
                  R$
                </span>
                <Input
                  id="valor"
                  placeholder="0,00"
                  value={valor}
                  onChange={handleValorChange}
                  className="pl-12 font-ios text-lg"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="flex-1"
              >
                <X className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-educash-green-base to-educash-green-dark
                         hover:scale-105 transition-all duration-300"
              >
                <Plus className="mr-2 h-4 w-4" />
                Adicionar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
