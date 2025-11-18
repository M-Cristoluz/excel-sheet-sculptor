import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Plus, Target, TrendingUp, Trash2, Check, Sparkles } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Goal {
  id: string;
  title: string;
  description?: string;
  target_amount: number;
  current_amount: number;
  category: string;
  deadline?: string;
  icon?: string;
  color?: string;
  is_completed: boolean;
}

const categories = [
  { value: "economia", label: "Economia Geral", icon: "💰", color: "from-educash-green-base to-educash-green-medium" },
  { value: "viagem", label: "Viagem", icon: "✈️", color: "from-info to-primary" },
  { value: "investimento", label: "Investimento", icon: "📈", color: "from-success to-educash-green-base" },
  { value: "emergencia", label: "Emergência", icon: "🚨", color: "from-warning to-destructive" },
  { value: "educacao", label: "Educação", icon: "📚", color: "from-accent to-educash-gold" },
  { value: "compra", label: "Compra Grande", icon: "🛒", color: "from-primary to-secondary" },
];

const GoalsManager = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    target_amount: "",
    category: "economia",
    deadline: "",
  });

  // Simulação - em produção, buscar do Supabase
  useEffect(() => {
    const mockGoals: Goal[] = [
      {
        id: "1",
        title: "Fundo de Emergência",
        description: "6 meses de despesas",
        target_amount: 10000,
        current_amount: 3500,
        category: "emergencia",
        is_completed: false,
      },
      {
        id: "2",
        title: "Viagem para Europa",
        description: "Férias dos sonhos",
        target_amount: 8000,
        current_amount: 2100,
        category: "viagem",
        deadline: "2025-12-31",
        is_completed: false,
      },
    ];
    setGoals(mockGoals);
  }, []);

  const handleCreateGoal = () => {
    if (!newGoal.title || !newGoal.target_amount) {
      toast.error("Preencha título e valor da meta!");
      return;
    }

    const categoryData = categories.find(c => c.value === newGoal.category);
    const goal: Goal = {
      id: Date.now().toString(),
      title: newGoal.title,
      description: newGoal.description,
      target_amount: parseFloat(newGoal.target_amount),
      current_amount: 0,
      category: newGoal.category,
      deadline: newGoal.deadline || undefined,
      icon: categoryData?.icon,
      color: categoryData?.color,
      is_completed: false,
    };

    setGoals([...goals, goal]);
    setIsDialogOpen(false);
    setNewGoal({ title: "", description: "", target_amount: "", category: "economia", deadline: "" });
    toast.success("🎯 Meta criada com sucesso!");
  };

  const handleDeleteGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
    toast.success("Meta removida!");
  };

  const handleCompleteGoal = (id: string) => {
    setGoals(goals.map(g => 
      g.id === id ? { ...g, is_completed: true, current_amount: g.target_amount } : g
    ));
    toast.success("🎉 Parabéns! Meta conquistada!");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground font-display">Minhas Metas Financeiras</h2>
          <p className="text-sm sm:text-base text-muted-foreground">Defina e acompanhe seus objetivos financeiros</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-gradient-to-r from-primary to-educash-green-medium hover:opacity-90 text-sm sm:text-base px-3 sm:px-4">
              <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Nova Meta</span>
              <span className="sm:hidden">Nova</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Criar Nova Meta</DialogTitle>
              <DialogDescription>
                Defina uma meta financeira e acompanhe seu progresso
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título da Meta</Label>
                <Input
                  id="title"
                  placeholder="Ex: Viagem, Fundo de emergência..."
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Select value={newGoal.category} onValueChange={(value) => setNewGoal({ ...newGoal, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.icon} {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Valor Alvo (R$)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0,00"
                  value={newGoal.target_amount}
                  onChange={(e) => setNewGoal({ ...newGoal, target_amount: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline">Prazo (opcional)</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição (opcional)</Label>
                <Textarea
                  id="description"
                  placeholder="Adicione detalhes sobre sua meta..."
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateGoal} className="bg-gradient-to-r from-primary to-educash-green-medium">
                Criar Meta
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de Metas */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        {goals.length === 0 ? (
          <Card className="col-span-2 p-12 text-center">
            <Target className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nenhuma meta criada ainda</h3>
            <p className="text-muted-foreground mb-6">
              Comece definindo suas metas financeiras para acompanhar seu progresso!
            </p>
            <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Criar Primeira Meta
            </Button>
          </Card>
        ) : (
          goals.map((goal) => {
            const progress = (goal.current_amount / goal.target_amount) * 100;
            const categoryData = categories.find(c => c.value === goal.category);
            
            return (
              <Card
                key={goal.id}
                className={`relative overflow-hidden transition-all hover:shadow-lg ${
                  goal.is_completed ? 'border-success' : ''
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${categoryData?.color} opacity-5`} />
                
                <div className="relative p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">{goal.icon}</span>
                        <h3 className="font-semibold text-lg">{goal.title}</h3>
                        {goal.is_completed && (
                          <span className="inline-flex items-center gap-1 text-xs bg-success/10 text-success px-2 py-1 rounded-full">
                            <Check className="w-3 h-3" />
                            Concluída
                          </span>
                        )}
                      </div>
                      {goal.description && (
                        <p className="text-sm text-muted-foreground">{goal.description}</p>
                      )}
                    </div>
                    
                    {!goal.is_completed && (
                      <div className="flex gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleCompleteGoal(goal.id)}
                          className="h-8 w-8"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDeleteGoal(goal.id)}
                          className="h-8 w-8 hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">
                        R$ {goal.current_amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                      <span className="text-muted-foreground">
                        de R$ {goal.target_amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{progress.toFixed(1)}% concluído</span>
                      {goal.deadline && (
                        <span>Prazo: {new Date(goal.deadline).toLocaleDateString('pt-BR')}</span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default GoalsManager;