import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, CalendarDays } from "lucide-react";
import { toast } from "sonner";

interface TransactionFormProps {
  onAddTransaction: (transaction: any) => void;
  onClose: () => void;
  isDarkMode?: boolean;
}

interface DataRow {
  id: number;
  data: string;
  mes?: string;
  ano?: number;
  tipo: string;
  descricao: string;
  valor: number;
}

const TransactionForm = ({ onAddTransaction, onClose, isDarkMode }: TransactionFormProps) => {
  const [formData, setFormData] = useState({
    data: new Date().toISOString().split('T')[0],
    tipo: '',
    descricao: '',
    valor: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.tipo || !formData.descricao || !formData.valor) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    const date = new Date(formData.data);
    const newTransaction: DataRow = {
      id: Date.now(),
      data: formData.data,
      mes: date.toLocaleDateString('pt-BR', { month: 'long' }),
      ano: date.getFullYear(),
      tipo: formData.tipo,
      descricao: formData.descricao,
      valor: parseFloat(formData.valor)
    };

    onAddTransaction(newTransaction);
    toast.success("Transação adicionada com sucesso!");
    onClose();
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card className={`animate-scaleIn ${isDarkMode ? 'glass-effect' : ''}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5" />
          Nova Transação
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="data">Data</Label>
              <Input
                id="data"
                type="date"
                value={formData.data}
                onChange={(e) => handleChange('data', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo</Label>
              <Select value={formData.tipo} onValueChange={(value) => handleChange('tipo', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Receita">Receita</SelectItem>
                  <SelectItem value="Despesa">Despesa</SelectItem>
                  <SelectItem value="Investimento">Investimento</SelectItem>
                  <SelectItem value="Transferência">Transferência</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Input
              id="descricao"
              placeholder="Descreva a transação"
              value={formData.descricao}
              onChange={(e) => handleChange('descricao', e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="valor">Valor (R$)</Label>
            <Input
              id="valor"
              type="number"
              step="0.01"
              placeholder="0,00"
              value={formData.valor}
              onChange={(e) => handleChange('valor', e.target.value)}
              required
            />
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              Adicionar Transação
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TransactionForm;