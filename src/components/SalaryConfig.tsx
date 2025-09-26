import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign, Save, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SalaryConfigProps {
  currentSalary: number;
  onSalaryUpdate: (salary: number) => void;
  isDarkMode?: boolean;
}

const SalaryConfig = ({ currentSalary, onSalaryUpdate, isDarkMode }: SalaryConfigProps) => {
  const [salary, setSalary] = useState(currentSalary.toString());
  const { toast } = useToast();

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
      title: "Salário configurado!",
      description: `Novo salário base: ${formatCurrency(numericSalary)}`,
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
    <Card className={`glass-effect border-primary/20 ${isDarkMode ? 'bg-card/90' : 'bg-background/90'}`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 font-ios">
          <DollarSign className="h-5 w-5 text-primary" />
          Configuração de Salário Base
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="salary" className="text-sm font-medium font-ios">
            Salário Mensal (R$)
          </Label>
          <div className="flex gap-3">
            <Input
              id="salary"
              type="text"
              value={salary}
              onChange={handleInputChange}
              placeholder="Ex: 5000.00"
              className="font-ios text-lg bg-background/50 border-primary/20 focus:border-primary/40"
            />
            <Button 
              onClick={handleSave}
              variant="default"
              size="default"
              className="shrink-0"
            >
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
          </div>
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