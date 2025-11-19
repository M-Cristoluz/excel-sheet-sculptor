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
import { maskCurrency } from "@/utils/maskValue";

interface DataRow {
  id: number;
  data: string;
  mes?: string;
  ano?: number;
  tipo: string;
  descricao: string;
  valor: number;
  categoria?: 'Essencial' | 'Desejo' | 'Poupança' | string;
}

interface DataChartsProps {
  data: DataRow[];
  baseSalary?: number;
  showValues?: boolean;
}

export const DataCharts = ({ data, baseSalary = 0, showValues = false }: DataChartsProps) => {
  // Filter out any invalid data entries
  const validData = data.filter(row => 
    row && 
    typeof row === 'object' && 
    row.tipo && 
    typeof row.tipo === 'string' &&
    row.descricao &&
    typeof row.valor === 'number'
  );

  // Calculate totals
  const totalReceitas = validData
    .filter(row => {
      const tipo = row.tipo.toLowerCase();
      return tipo.includes('receita') || tipo.includes('entrada') || tipo === 'renda extra';
    })
    .reduce((sum, row) => sum + row.valor, 0);

  const totalDespesas = validData
    .filter(row => {
      const tipo = row.tipo.toLowerCase();
      return tipo.includes('despesa') || tipo.includes('saída');
    })
    .reduce((sum, row) => sum + row.valor, 0);

  const saldoAtual = totalReceitas - totalDespesas;

  // Prepare pie chart data ONLY for expenses, grouped by category
  const expenseData = validData.filter(row => {
    const tipo = row.tipo.toLowerCase();
    return tipo.includes('despesa') || tipo.includes('saída') || tipo === 'pagamento de parcela';
  });

  const categoryData = expenseData.reduce((acc: any[], row) => {
    const categoryName = row.categoria || 'Sem Categoria';
    const existing = acc.find(item => item.name === categoryName);
    
    if (existing) {
      existing.value += row.valor;
    } else {
      acc.push({
        name: categoryName,
        value: row.valor,
        tipo: row.tipo
      });
    }
    return acc;
  }, []).sort((a, b) => b.value - a.value);

  // Prepare monthly evolution data
  const monthlyData = validData.reduce((acc: any[], row) => {
    const mes = row.mes || 'N/A';
    const existing = acc.find(item => item.mes === mes);
    const tipo = row.tipo.toLowerCase();
    
    if (existing) {
      if (tipo.includes('receita') || tipo.includes('entrada') || tipo === 'renda extra') {
        existing.receitas += Number(row.valor) || 0;
      } else if (tipo.includes('despesa') || tipo.includes('saída')) {
        existing.despesas += Number(row.valor) || 0;
      }
      existing.saldo = existing.receitas - existing.despesas;
    } else {
      const isReceita = tipo.includes('receita') || tipo.includes('entrada') || tipo === 'renda extra';
      const isDespesa = tipo.includes('despesa') || tipo.includes('saída');
      const receitas = isReceita ? Number(row.valor) || 0 : 0;
      const despesas = isDespesa ? Number(row.valor) || 0 : 0;
      
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

  // Filter out "Exemplo" and "Sem Categoria" with zero value from visualization
  const filteredCategoryData = categoryData.filter(item => 
    item.name && 
    item.name.toLowerCase() !== 'exemplo' && 
    item.value > 0
  );

  // Calculate financial analysis based on actual income
  const salaryAnalysis = totalReceitas > 0 ? {
    spentPercentage: (totalDespesas / totalReceitas) * 100,
    savedAmount: totalReceitas - totalDespesas,
    savedPercentage: ((totalReceitas - totalDespesas) / totalReceitas) * 100,
    rule50: baseSalary * 0.5,   // Necessidades (baseado no salário base)
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
                <p className="text-2xl font-bold text-success font-ios">{maskCurrency(totalReceitas, showValues)}</p>
                {baseSalary > 0 && totalReceitas > 0 && (
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
                <p className="text-2xl font-bold text-danger font-ios">{maskCurrency(totalDespesas, showValues)}</p>
                {totalReceitas > 0 && salaryAnalysis && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {salaryAnalysis.spentPercentage.toFixed(1)}% das receitas totais
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
                  {baseSalary > 0 && salaryAnalysis ? maskCurrency(salaryAnalysis.savedAmount, showValues) : maskCurrency(saldoAtual, showValues)}
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
                <p className="text-sm font-medium text-muted-foreground font-ios">Status Financeiro</p>
                <Badge variant={healthBadge.variant} className="text-xs mt-2 font-ios">
                  {healthBadge.text}
                </Badge>
                {baseSalary > 0 && salaryAnalysis && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Meta: {maskCurrency(salaryAnalysis.rule20, showValues)} (20%)
                  </p>
                )}
              </div>
              <Target className="h-8 w-8 text-foreground/70" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart - Expense Categories Distribution */}
        <Card className="shadow-lg hover:shadow-xl transition-all duration-300 dark:bg-card/95">
          <CardHeader>
            <CardTitle className="text-primary dark:text-primary/90 font-ios flex items-center gap-2">
              📊 Distribuição de Despesas por Categoria
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Como você está gastando seu dinheiro
            </p>
          </CardHeader>
          <CardContent className="p-3 sm:p-6">
            <ResponsiveContainer width="100%" height={typeof window !== 'undefined' && window.innerWidth < 640 ? 300 : 400}>
              <PieChart>
                <Pie
                  data={filteredCategoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry: any) => {
                    // Calculate percentage based on total expenses only
                    const totalExpenses = filteredCategoryData.reduce((sum, item) => sum + (item.value || 0), 0);
                    if (totalExpenses === 0) return '0%';
                    const percent = (((entry.value || 0) / totalExpenses) * 100).toFixed(1);
                    return `${percent}%`;
                  }}
                  outerRadius={typeof window !== 'undefined' && window.innerWidth < 640 ? 70 : typeof window !== 'undefined' && window.innerWidth < 768 ? 80 : typeof window !== 'undefined' && window.innerWidth < 1024 ? 100 : 120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {filteredCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => formatCurrency(value as number)}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))'
                  }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: typeof window !== 'undefined' && window.innerWidth < 768 ? '12px' : '14px' }}
                  formatter={(value) => {
                    const item = filteredCategoryData.find(d => d.name === value);
                    if (!item) return value;
                    const totalExpenses = filteredCategoryData.reduce((sum, i) => sum + (i.value || 0), 0);
                    const percent = totalExpenses > 0 ? ((item.value / totalExpenses) * 100).toFixed(1) : '0';
                    return `${value}: ${formatCurrency(item.value)} (${percent}%)`;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bar Chart - Monthly Comparison */}
        <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-primary font-ios flex items-center gap-2">
              📈 Receitas vs Despesas por Mês
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6">
            <div style={{ width: '100%', height: typeof window !== 'undefined' && window.innerWidth < 640 ? 280 : 350 }}>
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
          <CardContent className="p-3 sm:p-6">
            <div style={{ width: '100%', height: typeof window !== 'undefined' && window.innerWidth < 640 ? 280 : 350 }}>
              <ResponsiveContainer>
                <LineChart data={monthlyData} margin={{ top: 20, right: typeof window !== 'undefined' && window.innerWidth < 640 ? 10 : 30, left: typeof window !== 'undefined' && window.innerWidth < 640 ? 0 : 20, bottom: 5 }}>
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
        <Card className="bg-card border-border shadow-lg hover:shadow-xl transition-all duration-300 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2 font-ios">
              <Target className="h-5 w-5 text-educash-primary" />
              💡 Análise Educativa - Regra 50/30/20
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-success/10 dark:bg-success/20 rounded-xl border border-success/20">
                <div className="text-center">
                  <div className="text-xs font-medium text-foreground mb-2 font-ios">💸 Necessidades (50%)</div>
                  <div className="text-lg font-bold text-success font-ios">
                    {baseSalary > 0 && salaryAnalysis ? maskCurrency(salaryAnalysis.rule50, showValues) : maskCurrency(totalReceitas * 0.5, showValues)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Moradia, alimentação, transporte</div>
                </div>
              </div>
              
              <div className="p-4 bg-warning/10 dark:bg-warning/20 rounded-xl border border-warning/20">
                <div className="text-center">
                  <div className="text-xs font-medium text-foreground mb-2 font-ios">🎯 Desejos (30%)</div>
                  <div className="text-lg font-bold text-warning font-ios">
                    {baseSalary > 0 && salaryAnalysis ? maskCurrency(salaryAnalysis.rule30, showValues) : maskCurrency(totalReceitas * 0.3, showValues)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Lazer, compras, hobbies</div>
                </div>
              </div>
              
              <div className="p-4 bg-info/10 dark:bg-info/20 rounded-xl border border-info/20">
                <div className="text-center">
                  <div className="text-xs font-medium text-foreground mb-2 font-ios">💰 Poupança (20%)</div>
                  <div className="text-lg font-bold text-info font-ios">
                    {baseSalary > 0 && salaryAnalysis ? maskCurrency(salaryAnalysis.rule20, showValues) : maskCurrency(totalReceitas * 0.2, showValues)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Investimentos, emergência</div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {baseSalary > 0 && salaryAnalysis ? (
                <div className="p-4 bg-muted/50 dark:bg-muted/30 rounded-xl border border-border">
                  <h4 className="font-medium text-foreground mb-3 font-ios">📊 Análise Baseada no seu Salário:</h4>
                  <div className="space-y-2 text-sm text-foreground">
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
                      <strong>Meta de Poupança:</strong> {maskCurrency(salaryAnalysis.rule20, showValues)} (20% do salário)
                    </p>
                    <p className="font-ios">
                      <strong>Poupança Atual:</strong> {maskCurrency(salaryAnalysis.savedAmount, showValues)} ({salaryAnalysis.savedPercentage.toFixed(1)}%)
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-muted/50 dark:bg-muted/30 rounded-xl border border-border">
                  <p className="text-sm text-foreground font-ios">
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