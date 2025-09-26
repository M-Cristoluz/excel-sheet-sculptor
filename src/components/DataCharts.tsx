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
  baseSalary?: number;
}

export const DataCharts = ({ data, baseSalary = 0 }: DataChartsProps) => {
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

  // Enhanced EduCA$H colors for better visibility
  const COLORS = [
    'hsl(155 65% 45%)', // Primary green
    'hsl(50 95% 65%)',  // Gold  
    'hsl(122 50% 55%)', // Success green
    'hsl(4 85% 60%)',   // Danger red
    'hsl(207 85% 60%)', // Info blue
    'hsl(45 95% 55%)',  // Warning yellow
    'hsl(280 65% 60%)', // Purple
    'hsl(20 85% 60%)',  // Orange
  ];

  // Calculate salary-based analysis
  const salaryAnalysis = baseSalary > 0 ? {
    spentPercentage: (totalDespesas / baseSalary) * 100,
    savedAmount: baseSalary - totalDespesas,
    savedPercentage: ((baseSalary - totalDespesas) / baseSalary) * 100,
    rule50: baseSalary * 0.5,   // Necessidades
    rule30: baseSalary * 0.3,   // Desejos  
    rule20: baseSalary * 0.2,   // Poupança
  } : null;

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
    if (baseSalary > 0 && salaryAnalysis) {
      if (salaryAnalysis.savedPercentage >= 20) return { variant: 'default' as const, text: '🟢 Meta de Poupança Atingida!' };
      if (salaryAnalysis.savedPercentage >= 10) return { variant: 'secondary' as const, text: '🟡 Poupando, mas pode melhorar' };
      if (salaryAnalysis.savedPercentage >= 0) return { variant: 'destructive' as const, text: '🔴 Poupança Insuficiente' };
      return { variant: 'destructive' as const, text: '🚨 Gastos Excessivos!' };
    }
    
    if (saldoAtual > totalReceitas * 0.2) return { variant: 'default' as const, text: '🟢 Excelente Controle!' };
    if (saldoAtual > 0) return { variant: 'secondary' as const, text: '🟡 Atenção aos Gastos' };
    return { variant: 'destructive' as const, text: '🔴 Limite Ultrapassado!' };
  };

  const healthBadge = getFinancialHealthBadge();

  return (
    <div className="space-y-6">
      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-success/80 font-ios">Total Receitas</p>
                <p className="text-2xl font-bold text-success font-ios">{formatCurrency(totalReceitas)}</p>
                {baseSalary > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {((totalReceitas / baseSalary) * 100).toFixed(1)}% do salário base
                  </p>
                )}
              </div>
              <TrendingUp className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-danger/10 to-danger/5 border-danger/20 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-danger/80 font-ios">Total Despesas</p>
                <p className="text-2xl font-bold text-danger font-ios">{formatCurrency(totalDespesas)}</p>
                {baseSalary > 0 && salaryAnalysis && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {salaryAnalysis.spentPercentage.toFixed(1)}% do salário base
                  </p>
                )}
              </div>
              <TrendingDown className="h-8 w-8 text-danger" />
            </div>
          </CardContent>
        </Card>

        <Card className={`bg-gradient-to-br shadow-lg hover:shadow-xl transition-all duration-300 ${saldoAtual >= 0 ? 'from-primary/10 to-primary/5 border-primary/20' : 'from-danger/10 to-danger/5 border-danger/20'}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground font-ios">
                  {baseSalary > 0 ? 'Economia Atual' : 'Saldo Atual'}
                </p>
                <p className={`text-2xl font-bold font-ios ${getFinancialHealthColor()}`}>
                  {baseSalary > 0 && salaryAnalysis ? formatCurrency(salaryAnalysis.savedAmount) : formatCurrency(saldoAtual)}
                </p>
                {baseSalary > 0 && salaryAnalysis && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {salaryAnalysis.savedPercentage.toFixed(1)}% poupado
                  </p>
                )}
              </div>
              <DollarSign className={`h-8 w-8 ${getFinancialHealthColor()}`} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-accent-foreground/80 font-ios">Status Financeiro</p>
                <Badge variant={healthBadge.variant} className="text-xs mt-2 font-ios">
                  {healthBadge.text}
                </Badge>
                {baseSalary > 0 && salaryAnalysis && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Meta: {formatCurrency(salaryAnalysis.rule20)} (20%)
                  </p>
                )}
              </div>
              <Target className="h-8 w-8 text-accent-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart - Categories Distribution */}
        <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-primary font-ios flex items-center gap-2">
              📊 Distribuição por Categoria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ width: '100%', height: 350 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry: any) => `${entry.name}\n${((Number(entry.percent) || 0) * 100).toFixed(1)}%`}
                    outerRadius={100}
                    innerRadius={40}
                    fill="#8884d8"
                    dataKey="value"
                    stroke="hsl(var(--background))"
                    strokeWidth={2}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [formatCurrency(Number(value)), 'Valor']}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--popover))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontFamily: 'SF Pro Display, -apple-system, sans-serif'
                    }}
                  />
                  <Legend 
                    wrapperStyle={{ 
                      fontSize: '12px',
                      fontFamily: 'SF Pro Display, -apple-system, sans-serif'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Bar Chart - Monthly Comparison */}
        <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-primary font-ios flex items-center gap-2">
              📈 Receitas vs Despesas por Mês
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ width: '100%', height: 350 }}>
              <ResponsiveContainer>
                <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis 
                    dataKey="mes" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    fontFamily="SF Pro Display, -apple-system, sans-serif"
                  />
                  <YAxis 
                    tickFormatter={(value) => `R$ ${(value/1000).toFixed(1)}k`}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    fontFamily="SF Pro Display, -apple-system, sans-serif"
                  />
                  <Tooltip 
                    formatter={(value, name) => [formatCurrency(Number(value)), name]}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--popover))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontFamily: 'SF Pro Display, -apple-system, sans-serif'
                    }}
                  />
                  <Legend 
                    wrapperStyle={{ 
                      fontSize: '12px',
                      fontFamily: 'SF Pro Display, -apple-system, sans-serif'
                    }}
                  />
                  <Bar 
                    dataKey="receitas" 
                    fill="hsl(var(--success))" 
                    name="Receitas"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey="despesas" 
                    fill="hsl(var(--danger))" 
                    name="Despesas"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Line Chart - Balance Evolution */}
        <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-primary font-ios flex items-center gap-2">
              📉 Evolução do Saldo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ width: '100%', height: 350 }}>
              <ResponsiveContainer>
                <LineChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis 
                    dataKey="mes" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    fontFamily="SF Pro Display, -apple-system, sans-serif"
                  />
                  <YAxis 
                    tickFormatter={(value) => `R$ ${(value/1000).toFixed(1)}k`}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    fontFamily="SF Pro Display, -apple-system, sans-serif"
                  />
                  <Tooltip 
                    formatter={(value) => [formatCurrency(Number(value)), 'Saldo']}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--popover))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontFamily: 'SF Pro Display, -apple-system, sans-serif'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="saldo" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={4}
                    name="Saldo"
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, fill: 'hsl(var(--primary))', stroke: 'hsl(var(--background))', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Educational Tips */}
        <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20 shadow-lg hover:shadow-xl transition-all duration-300 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-accent-foreground flex items-center gap-2 font-ios">
              <Target className="h-5 w-5" />
              💡 Análise Educativa - Regra 50/30/20
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-success/10 rounded-xl border border-success/20">
                <div className="text-center">
                  <div className="text-xs font-medium text-success/80 mb-2 font-ios">💸 Necessidades (50%)</div>
                  <div className="text-lg font-bold text-success font-ios">
                    {baseSalary > 0 && salaryAnalysis ? formatCurrency(salaryAnalysis.rule50) : formatCurrency(totalReceitas * 0.5)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Moradia, alimentação, transporte</div>
                </div>
              </div>
              
              <div className="p-4 bg-warning/10 rounded-xl border border-warning/20">
                <div className="text-center">
                  <div className="text-xs font-medium text-warning/80 mb-2 font-ios">🎯 Desejos (30%)</div>
                  <div className="text-lg font-bold text-warning font-ios">
                    {baseSalary > 0 && salaryAnalysis ? formatCurrency(salaryAnalysis.rule30) : formatCurrency(totalReceitas * 0.3)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Lazer, compras, hobbies</div>
                </div>
              </div>
              
              <div className="p-4 bg-info/10 rounded-xl border border-info/20">
                <div className="text-center">
                  <div className="text-xs font-medium text-info/80 mb-2 font-ios">💰 Poupança (20%)</div>
                  <div className="text-lg font-bold text-info font-ios">
                    {baseSalary > 0 && salaryAnalysis ? formatCurrency(salaryAnalysis.rule20) : formatCurrency(totalReceitas * 0.2)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Investimentos, emergência</div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {baseSalary > 0 && salaryAnalysis ? (
                <div className="p-4 bg-background/50 rounded-xl border border-primary/10">
                  <h4 className="font-medium text-primary mb-3 font-ios">📊 Análise Baseada no seu Salário:</h4>
                  <div className="space-y-2 text-sm">
                    <p className="font-ios">
                      <strong>Situação Atual:</strong> {salaryAnalysis.savedPercentage >= 20 
                        ? '✅ Você está poupando adequadamente!' 
                        : salaryAnalysis.savedPercentage >= 10 
                        ? '🟡 Poupança moderada, pode melhorar' 
                        : salaryAnalysis.savedPercentage >= 0
                        ? '🔴 Poupança insuficiente'
                        : '🚨 Gastos excessivos - revise seu orçamento!'}
                    </p>
                    <p className="font-ios">
                      <strong>Meta de Poupança:</strong> {formatCurrency(salaryAnalysis.rule20)} (20% do salário)
                    </p>
                    <p className="font-ios">
                      <strong>Poupança Atual:</strong> {formatCurrency(salaryAnalysis.savedAmount)} ({salaryAnalysis.savedPercentage.toFixed(1)}%)
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-background/50 rounded-xl border border-primary/10">
                  <p className="text-sm text-muted-foreground font-ios">
                    💡 <strong>Dica:</strong> {saldoAtual >= (totalReceitas * 0.2) 
                      ? '✅ Parabéns! Você está poupando adequadamente com base nas suas receitas.' 
                      : '⚠️ Configure seu salário base para uma análise mais precisa dos seus gastos.'}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};