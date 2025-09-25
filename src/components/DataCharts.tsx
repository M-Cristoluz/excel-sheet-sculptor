import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  BarChart, 
  Bar,
  Legend 
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Target } from "lucide-react";

interface DataRow {
  id: number;
  data: string;
  mes?: string;
  ano?: number;
  tipo: string;
  descricao: string;
  valor: number;
}

interface DataChartsProps {
  data: DataRow[];
}

export const DataCharts = ({ data }: DataChartsProps) => {
  // Calculate totals
  const totalReceitas = data
    .filter(row => row.tipo.toLowerCase().includes('receita') || row.tipo.toLowerCase().includes('entrada'))
    .reduce((sum, row) => sum + row.valor, 0);

  const totalDespesas = data
    .filter(row => row.tipo.toLowerCase().includes('despesa') || row.tipo.toLowerCase().includes('saída'))
    .reduce((sum, row) => sum + row.valor, 0);

  const saldoAtual = totalReceitas - totalDespesas;

  // Prepare pie chart data by category (description)
  const categoryData = data.reduce((acc: any[], row) => {
    const existing = acc.find(item => item.name === row.descricao);
    if (existing) {
      existing.value += Math.abs(row.valor);
    } else {
      acc.push({
        name: row.descricao,
        value: Math.abs(row.valor),
        tipo: row.tipo
      });
    }
    return acc;
  }, []).sort((a, b) => b.value - a.value).slice(0, 8); // Top 8 categories

  // Prepare monthly evolution data
  const monthlyData = data.reduce((acc: any[], row) => {
    const mes = row.mes || 'N/A';
    const existing = acc.find(item => item.mes === mes);
    
    if (existing) {
      if (row.tipo.toLowerCase().includes('receita') || row.tipo.toLowerCase().includes('entrada')) {
        existing.receitas += Number(row.valor) || 0;
      } else {
        existing.despesas += Number(row.valor) || 0;
      }
      existing.saldo = existing.receitas - existing.despesas;
    } else {
      const receitas = (row.tipo.toLowerCase().includes('receita') || row.tipo.toLowerCase().includes('entrada')) ? Number(row.valor) || 0 : 0;
      const despesas = (row.tipo.toLowerCase().includes('despesa') || row.tipo.toLowerCase().includes('saída')) ? Number(row.valor) || 0 : 0;
      
      acc.push({
        mes,
        receitas,
        despesas,
        saldo: receitas - despesas
      });
    }
    return acc;
  }, []);

  // EduCA$H colors for charts
  const COLORS = ['hsl(155 65% 35%)', 'hsl(50 98% 68%)', 'hsl(122 39% 49%)', 'hsl(4 90% 58%)', 'hsl(207 90% 54%)', 'hsl(45 100% 51%)'];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getFinancialHealthColor = () => {
    if (saldoAtual > 0) return 'text-success';
    if (saldoAtual < 0) return 'text-danger';
    return 'text-warning';
  };

  const getFinancialHealthBadge = () => {
    if (saldoAtual > totalReceitas * 0.2) return { variant: 'default' as const, text: '🟢 Excelente Controle!' };
    if (saldoAtual > 0) return { variant: 'secondary' as const, text: '🟡 Atenção aos Gastos' };
    return { variant: 'destructive' as const, text: '🔴 Limite Ultrapassado!' };
  };

  const healthBadge = getFinancialHealthBadge();

  return (
    <div className="space-y-6">
      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-success/80">Total Receitas</p>
                <p className="text-2xl font-bold text-success">{formatCurrency(totalReceitas)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-danger/10 to-danger/5 border-danger/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-danger/80">Total Despesas</p>
                <p className="text-2xl font-bold text-danger">{formatCurrency(totalDespesas)}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-danger" />
            </div>
          </CardContent>
        </Card>

        <Card className={`bg-gradient-to-br ${saldoAtual >= 0 ? 'from-primary/10 to-primary/5 border-primary/20' : 'from-danger/10 to-danger/5 border-danger/20'}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Saldo Atual</p>
                <p className={`text-2xl font-bold ${getFinancialHealthColor()}`}>{formatCurrency(saldoAtual)}</p>
              </div>
              <DollarSign className={`h-8 w-8 ${getFinancialHealthColor()}`} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-accent-foreground/80">Status Financeiro</p>
                <Badge variant={healthBadge.variant} className="text-xs mt-2">
                  {healthBadge.text}
                </Badge>
              </div>
              <Target className="h-8 w-8 text-accent-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart - Categories Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Distribuição por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry: any) => `${entry.name} ${((Number(entry.percent) || 0) * 100).toFixed(1)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Bar Chart - Monthly Comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Receitas vs Despesas por Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis tickFormatter={(value) => `R$ ${(value/1000).toFixed(1)}k`} />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Legend />
                  <Bar dataKey="receitas" fill="hsl(122 39% 49%)" name="Receitas" />
                  <Bar dataKey="despesas" fill="hsl(4 90% 58%)" name="Despesas" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Line Chart - Balance Evolution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Evolução do Saldo</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis tickFormatter={(value) => `R$ ${(value/1000).toFixed(1)}k`} />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Line 
                    type="monotone" 
                    dataKey="saldo" 
                    stroke="hsl(155 65% 35%)" 
                    strokeWidth={3}
                    name="Saldo"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Educational Tips */}
        <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
          <CardHeader>
            <CardTitle className="text-accent-foreground flex items-center gap-2">
              <Target className="h-5 w-5" />
              Dica Educativa - Regra 50/30/20
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">💸 Necessidades (50%)</span>
                <span className="text-sm text-muted-foreground">{formatCurrency(totalReceitas * 0.5)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">🎯 Desejos (30%)</span>
                <span className="text-sm text-muted-foreground">{formatCurrency(totalReceitas * 0.3)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">💰 Poupança (20%)</span>
                <span className="text-sm text-muted-foreground">{formatCurrency(totalReceitas * 0.2)}</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-background/50 rounded-lg">
              <p className="text-xs text-muted-foreground">
                💡 <strong>Meta de Poupança:</strong> {saldoAtual >= (totalReceitas * 0.2) ? '✅ Parabéns! Você está poupando adequadamente.' : '⚠️ Tente economizar pelo menos 20% da sua renda.'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};