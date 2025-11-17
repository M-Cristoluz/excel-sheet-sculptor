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
  categoria?: 'Essencial' | 'Desejo' | 'Poupança';
}

const TransactionForm = ({ onAddTransaction, onClose, isDarkMode }: TransactionFormProps) => {
  const [formData, setFormData] = useState({
    data: new Date().toISOString().split('T')[0],
    tipo: '',
    descricao: '',
    valor: '',
    categoria: ''
  });
  const [displayValue, setDisplayValue] = useState('');
  const [suggestedCategory, setSuggestedCategory] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.tipo || !formData.descricao || !formData.valor) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    if (formData.tipo === 'Despesa' && !formData.categoria) {
      toast.error("Por favor, selecione uma categoria para despesas");
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
      valor: parseFloat(formData.valor),
      categoria: formData.categoria as 'Essencial' | 'Desejo' | 'Poupança' | undefined
    };

    onAddTransaction(newTransaction);
    toast.success("Transação adicionada com sucesso!");
    onClose();
  };

  const handleChange = async (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Sugestão automática de categoria usando IA quando a descrição muda
    if (field === 'descricao' && value.length > 3 && formData.tipo === 'Despesa') {
      try {
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/categorize-transaction`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`
          },
          body: JSON.stringify({ descricao: value })
        });
        
        if (response.ok) {
          const data = await response.json();
          setSuggestedCategory(data.categoria);
        }
      } catch (error) {
        console.log('Erro ao obter sugestão de categoria:', error);
      }
    }
  };

  return (
    <Card className="animate-scaleIn glass-card">
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
                  <SelectItem value="Receita">Receita (Salário)</SelectItem>
                  <SelectItem value="Renda Extra">Renda Extra</SelectItem>
                  <SelectItem value="Despesa">Despesa</SelectItem>
                  <SelectItem value="Investimento">Investimento</SelectItem>
                  <SelectItem value="Poupança">Poupança</SelectItem>
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
              type="text"
              placeholder="0,00"
              value={displayValue}
              onChange={(e) => {
                const rawValue = e.target.value.replace(/\D/g, '');
                if (rawValue) {
                  const numValue = parseFloat(rawValue) / 100;
                  handleChange('valor', numValue.toString());
                  setDisplayValue(numValue.toLocaleString('pt-BR', { 
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  }));
                } else {
                  handleChange('valor', '');
                  setDisplayValue('');
                }
              }}
              required
            />
          </div>

          {formData.tipo === 'Despesa' && (
            <div className="space-y-2">
              <Label htmlFor="categoria">Categoria 50/30/20</Label>
              {suggestedCategory && (
                <p className="text-xs text-primary mb-1">
                  ✨ Sugestão da IA: {suggestedCategory}
                </p>
              )}
              <Select 
                value={formData.categoria} 
                onValueChange={(value) => handleChange('categoria', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Essencial">💡 Essencial (50%) - Necessidades básicas</SelectItem>
                  <SelectItem value="Desejo">❤️ Desejo (30%) - Lazer e entretenimento</SelectItem>
                  <SelectItem value="Poupança">🐷 Poupança (20%) - Investimentos</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Categorize seu gasto de acordo com a regra 50/30/20
              </p>
            </div>
          )}
          
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