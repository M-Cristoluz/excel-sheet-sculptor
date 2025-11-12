import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign, Save, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SalaryConfigProps {
  currentSalary: number;
  extraIncome: number;
  onSalaryUpdate: (salary: number) => void;
  onExtraIncomeUpdate: (income: number) => void;
  isDarkMode?: boolean;
}

const SalaryConfig = ({ currentSalary, extraIncome, onSalaryUpdate, onExtraIncomeUpdate, isDarkMode }: SalaryConfigProps) => {
  const [salary, setSalary] = useState(currentSalary.toString());
  const [extra, setExtra] = useState(extraIncome.toString());
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  // Update local state when props change
  useState(() => {
    setSalary(currentSalary.toString());
    setExtra(extraIncome.toString());
  });

  const handleSave = () => {
    const numericSalary = parseFloat(salary.replace(/[^\d.,]/g, '').replace(',', '.'));
    const numericExtra = parseFloat(extra.replace(/[^\d.,]/g, '').replace(',', '.')) || 0;
    
    if (isNaN(numericSalary) || numericSalary <= 0) {
      toast({
        title: "Erro",
        description: "Por favor, insira um salário válido.",
        variant: "destructive",
      });
      return;
    }

    onSalaryUpdate(numericSalary);
    onExtraIncomeUpdate(numericExtra);
    setIsEditing(false);
    
    toast({
      title: "✅ Configuração salva!",
      description: `Salário base: ${formatCurrency(numericSalary)}${numericExtra > 0 ? ` | Renda extra: ${formatCurrency(numericExtra)}` : ''}`,
      variant: "default",
    });
  };

  const handleQuickUpdateExtra = () => {
    const numericExtra = parseFloat(extra.replace(/[^\d.,]/g, '').replace(',', '.')) || 0;
    onExtraIncomeUpdate(numericExtra);
    
    toast({
      title: "✅ Renda extra atualizada!",
      description: `Valor: ${formatCurrency(numericExtra)}`,
      variant: "default",
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="extra" className="text-sm font-medium font-ios">
                ✨ Renda Extra Mensal (R$)
              </Label>
              {extraIncome > 0 && !isEditing && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="text-xs h-7 px-2"
                >
                  Editar
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Input
                id="extra"
                type="text"
                value={extra}
                onChange={(e) => {
                  const value = e.target.value;
                  const sanitized = value.replace(/[^\d.,]/g, '');
                  setExtra(sanitized);
                }}
                placeholder="Ex: 1000.00"
                className="font-ios text-lg bg-background/50 border-primary/20 focus:border-primary/40"
              />
              {isEditing && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleQuickUpdateExtra}
                  className="shrink-0"
                >
                  <Save className="h-4 w-4" />
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              💡 Renda adicional (freelances, bicos) - não afeta a regra 50/30/20, mas conta no saldo total
            </p>
          </div>
        </div>

        <Button 
          onClick={handleSave}
          variant="default"
          size="lg"
          className="w-full"
        >
          <Save className="h-4 w-4 mr-2" />
          Salvar Configuração
        </Button>

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