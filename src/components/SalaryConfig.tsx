import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign, Save, Target, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ExtraIncomeEntry {
  id: number;
  descricao: string;
  valor: number;
  data: string;
}

interface SalaryConfigProps {
  currentSalary: number;
  extraIncomeEntries: ExtraIncomeEntry[];
  onSalaryUpdate: (salary: number) => void;
  onAddExtraIncome: (entry: Omit<ExtraIncomeEntry, 'id'>) => void;
  onRemoveExtraIncome: (id: number) => void;
  isDarkMode?: boolean;
}

const SalaryConfig = ({ currentSalary, extraIncomeEntries, onSalaryUpdate, onAddExtraIncome, onRemoveExtraIncome, isDarkMode }: SalaryConfigProps) => {
  const [salary, setSalary] = useState(currentSalary.toString());
  const [showAddExtraForm, setShowAddExtraForm] = useState(false);
  const [extraDescription, setExtraDescription] = useState('');
  const [extraValue, setExtraValue] = useState('');
  const { toast } = useToast();

  // Update local state when props change
  useState(() => {
    setSalary(currentSalary.toString());
  });

  const handleSave = () => {
    const numericSalary = parseFloat(salary.replace(/[^\d.,]/g, '').replace(',', '.'));
    
    if (isNaN(numericSalary) || numericSalary <= 0) {
      toast({
        title: "Erro",
        description: "Por favor, insira um salário válido.",
        variant: "destructive",
      });
      return;
    }

    onSalaryUpdate(numericSalary);
    
    toast({
      title: "✅ Configuração salva!",
      description: `Salário base: ${formatCurrency(numericSalary)}`,
      variant: "default",
    });
  };

  const handleAddExtraIncome = () => {
    const numericValue = parseFloat(extraValue.replace(/[^\d.,]/g, '').replace(',', '.'));
    
    if (!extraDescription.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira uma descrição.",
        variant: "destructive",
      });
      return;
    }

    if (isNaN(numericValue) || numericValue <= 0) {
      toast({
        title: "Erro",
        description: "Por favor, insira um valor válido.",
        variant: "destructive",
      });
      return;
    }

    const today = new Date();
    onAddExtraIncome({
      descricao: extraDescription,
      valor: numericValue,
      data: `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear().toString().slice(-2)}`
    });

    setExtraDescription('');
    setExtraValue('');
    setShowAddExtraForm(false);
    
    toast({
      title: "✅ Renda extra adicionada!",
      description: `${extraDescription}: ${formatCurrency(numericValue)}`,
      variant: "default",
    });
  };

  const handleRemoveExtraIncome = (id: number) => {
    onRemoveExtraIncome(id);
    toast({
      title: "Renda extra removida",
      description: "A entrada foi excluída com sucesso.",
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers, dots, and commas
    const sanitized = value.replace(/[^\d.,]/g, '');
    setSalary(sanitized);
  };

  const totalExtraIncome = extraIncomeEntries.reduce((sum, entry) => sum + entry.valor, 0);

  const rule5030220 = {
    needs: currentSalary * 0.5,
    wants: currentSalary * 0.3,
    savings: currentSalary * 0.2,
  };

  return (
    <Card className="glass-effect border-primary/20 bg-background/90 dark:bg-card/90">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 font-ios">
          <DollarSign className="h-5 w-5 text-primary" />
          Configuração de Salário Base
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="salary" className="text-sm font-medium font-ios">
            💼 Salário Base Mensal (R$)
          </Label>
          <Input
            id="salary"
            type="text"
            value={salary}
            onChange={handleInputChange}
            placeholder="Ex: 5000.00"
            className="font-ios text-lg bg-background/50 border-primary/20 focus:border-primary/40"
          />
          <p className="text-xs text-muted-foreground">
            Seu salário fixo mensal (usado para cálculo 50/30/20)
          </p>
        </div>

        <Button 
          onClick={handleSave}
          variant="default"
          size="lg"
          className="w-full"
        >
          <Save className="h-4 w-4 mr-2" />
          Salvar Salário Base
        </Button>

        {/* Extra Income Section */}
        <div className="space-y-4 p-4 bg-accent/5 rounded-xl border border-accent/20">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium font-ios flex items-center gap-2">
                ✨ Rendas Extras
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                Adicione freelances, bicos e outras rendas extras
              </p>
            </div>
            {totalExtraIncome > 0 && (
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-lg font-bold text-accent font-ios">{formatCurrency(totalExtraIncome)}</p>
              </div>
            )}
          </div>

          {/* Extra Income List */}
          {extraIncomeEntries.length > 0 && (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {extraIncomeEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border"
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm font-ios">{entry.descricao}</p>
                    <p className="text-xs text-muted-foreground">{entry.data}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-bold text-accent font-ios">{formatCurrency(entry.valor)}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveExtraIncome(entry.id)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      ×
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add New Extra Income Form */}
          {showAddExtraForm ? (
            <div className="space-y-3 p-4 bg-background/50 rounded-lg border border-primary/20">
              <div className="space-y-2">
                <Label htmlFor="extraDesc" className="text-xs font-ios">
                  Descrição
                </Label>
                <Input
                  id="extraDesc"
                  type="text"
                  value={extraDescription}
                  onChange={(e) => setExtraDescription(e.target.value)}
                  placeholder="Ex: Freelance de design"
                  className="font-ios"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="extraVal" className="text-xs font-ios">
                  Valor (R$)
                </Label>
                <Input
                  id="extraVal"
                  type="text"
                  value={extraValue}
                  onChange={(e) => {
                    const value = e.target.value;
                    const sanitized = value.replace(/[^\d.,]/g, '');
                    setExtraValue(sanitized);
                  }}
                  placeholder="Ex: 500.00"
                  className="font-ios"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleAddExtraIncome}
                  variant="default"
                  size="sm"
                  className="flex-1"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Adicionar
                </Button>
                <Button
                  onClick={() => {
                    setShowAddExtraForm(false);
                    setExtraDescription('');
                    setExtraValue('');
                  }}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <Button
              onClick={() => setShowAddExtraForm(true)}
              variant="outline"
              size="sm"
              className="w-full border-dashed border-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Renda Extra
            </Button>
          )}

          <p className="text-xs text-muted-foreground font-ios text-center">
            💡 Rendas extras não afetam a regra 50/30/20, mas contam no saldo total
          </p>
        </div>

        {currentSalary > 0 && (
          <div className="space-y-4 p-4 bg-primary/5 rounded-xl border border-primary/10">
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-4 w-4 text-primary" />
              <span className="font-medium text-primary font-ios">Regra 50/30/20 - Recomendações</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-success/10 rounded-lg border border-success/20">
                <div className="text-xs font-medium text-success/80 mb-1 font-ios">Necessidades (50%)</div>
                <div className="text-lg font-bold text-success font-ios">{formatCurrency(rule5030220.needs)}</div>
                <div className="text-xs text-muted-foreground mt-1">Moradia, alimentação, transporte</div>
              </div>
              
              <div className="text-center p-3 bg-warning/10 rounded-lg border border-warning/20">
                <div className="text-xs font-medium text-warning/80 mb-1 font-ios">Desejos (30%)</div>
                <div className="text-lg font-bold text-warning font-ios">{formatCurrency(rule5030220.wants)}</div>
                <div className="text-xs text-muted-foreground mt-1">Lazer, compras, hobbies</div>
              </div>
              
              <div className="text-center p-3 bg-info/10 rounded-lg border border-info/20">
                <div className="text-xs font-medium text-info/80 mb-1 font-ios">Poupança (20%)</div>
                <div className="text-lg font-bold text-info font-ios">{formatCurrency(rule5030220.savings)}</div>
                <div className="text-xs text-muted-foreground mt-1">Investimentos, emergência</div>
              </div>
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground font-ios">
          💡 Configure seu salário base para receber análises mais precisas sobre seus gastos e metas financeiras.
        </div>
      </CardContent>
    </Card>
  );
};

export default SalaryConfig;