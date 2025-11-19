import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FileUpload } from "@/components/FileUpload";
import { DataTable } from "@/components/DataTable";
import { DataCharts } from "@/components/DataCharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Table, Upload, BookOpen, Plus, DollarSign, TrendingUp, TrendingDown, Sparkles, Download, ArrowLeft, FileSpreadsheet, Target, TrendingUp as TrendingUpIcon, CreditCard } from "lucide-react";
import { exportToExcel, generateTemplateExcel } from "@/utils/excelExport";
import EnhancedHeader from "@/components/EnhancedHeader";
import StatCard from "@/components/StatCard";
import TransactionForm from "@/components/TransactionForm";
import SalaryConfig from "@/components/SalaryConfig";
import FinancialRuleCard from "@/components/FinancialRuleCard";
import GamificationPanel from "@/components/GamificationPanel";
import EducationalTips from "@/components/EducationalTips";
import IOSButton from "@/components/IOSButton";
import IOSCard from "@/components/IOSCard";
import { PeriodFilter, PeriodType } from "@/components/PeriodFilter";
import { filterDataByPeriod, getPeriodLabel } from "@/utils/dateFilters";
import { CategoryCacheManager } from "@/components/CategoryCacheManager";
import { maskCurrency, maskNumber } from "@/utils/maskValue";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import Onboarding from "@/components/Onboarding";
import GoalsManager from "@/components/GoalsManager";
import MonthlyComparison from "@/components/MonthlyComparison";
import AIInsights from "@/components/AIInsights";
import ExpensePredictions from "@/components/ExpensePredictions";
import WeeklyChallenges from "@/components/WeeklyChallenges";
import { usePageView, useAnalytics } from "@/hooks/useAnalytics";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { MicroAchievements } from "@/components/MicroAchievements";
import { MascotCelebration } from "@/components/MascotCelebration";
import { DebtsManager } from "@/components/DebtsManager";

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

interface ExtraIncomeEntry {
  id: number;
  descricao: string;
  valor: number;
  data: string;
}

const Index = () => {
  usePageView('app-dashboard');
  const { trackFileUpload, trackGoalCreated } = useAnalytics();
  const navigate = useNavigate();
  const [uploadedData, setUploadedData] = useState<DataRow[]>([]);
  const [hasData, setHasData] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [salary, setSalary] = useState<number>(0);
  const [consecutiveDaysOnBudget, setConsecutiveDaysOnBudget] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('all');
  const [showValues, setShowValues] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showMascot, setShowMascot] = useState(false);
  const [mascotMessage, setMascotMessage] = useState("");
  const [hasCreatedGoal, setHasCreatedGoal] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("summary");

  // Check if user has completed onboarding
  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('educash-onboarding-completed');
    if (!hasCompletedOnboarding && !hasData) {
      setShowOnboarding(true);
    }
    
    // Check if user has created goals
    const goalsData = localStorage.getItem('educash-goals');
    if (goalsData) {
      const goals = JSON.parse(goalsData);
      setHasCreatedGoal(goals.length > 0);
    }
  }, [hasData]);

  // Load preferences
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('educash-dark-mode');
    const savedSalary = localStorage.getItem('educash-salary');
    const savedDays = localStorage.getItem('educash-consecutive-days');
    
    if (savedDarkMode) {
      setIsDarkMode(JSON.parse(savedDarkMode));
    }
    if (savedSalary) {
      setSalary(parseFloat(savedSalary));
    }
    if (savedDays) {
      setConsecutiveDaysOnBudget(parseInt(savedDays));
    }
  }, []);

  // Save preferences
  useEffect(() => {
    localStorage.setItem('educash-dark-mode', JSON.stringify(isDarkMode));
    
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (salary > 0) {
      localStorage.setItem('educash-salary', salary.toString());
    }
  }, [salary]);

  useEffect(() => {
    localStorage.setItem('educash-consecutive-days', consecutiveDaysOnBudget.toString());
  }, [consecutiveDaysOnBudget]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleFileUpload = (data: DataRow[]) => {
    setUploadedData(data);
    setHasData(true);
  };

  const handleDataChange = (newData: DataRow[]) => {
    // When table is filtered, we need to merge changes with full dataset
    if (selectedPeriod !== 'all') {
      const filteredIds = new Set(filteredData.map(item => item.id));
      const unchangedData = uploadedData.filter(item => !filteredIds.has(item.id));
      setUploadedData([...unchangedData, ...newData]);
    } else {
      setUploadedData(newData);
    }
  };

  const handleQuickAddTransaction = (transaction: {
    tipo: string;
    descricao: string;
    valor: number;
  }) => {
    const newTransaction: DataRow = {
      id: uploadedData.length + 1,
      data: new Date().toLocaleDateString('pt-BR'),
      mes: new Date().toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase(),
      ano: new Date().getFullYear(),
      tipo: transaction.tipo,
      descricao: transaction.descricao,
      valor: transaction.valor,
    };

    const updatedData = [...uploadedData, newTransaction];
    setUploadedData(updatedData);
    setHasData(true);

    // Show mascot celebration for first transaction
    if (uploadedData.length === 0) {
      setMascotMessage("🎉 Primeira transação registrada! Você está começando bem!");
      setShowMascot(true);
    } else if (uploadedData.length === 2) {
      setMascotMessage("⭐ Ótimo! Continue registrando suas transações!");
      setShowMascot(true);
    } else if (uploadedData.length === 9) {
      setMascotMessage("🚀 Você está arrasando! 10 transações registradas!");
      setShowMascot(true);
    }

    trackFileUpload(1, 'quick-add');
  };

  const resetData = () => {
    setUploadedData([]);
    setHasData(false);
    setShowAddForm(false);
  };

  const handleAddTransaction = (newTransaction: DataRow) => {
    setUploadedData(prev => [...prev, newTransaction]);
    if (!hasData) setHasData(true);
    
    // Check if user stayed within budget and increment days
    const totalExpenses = calculateSummary()?.despesas || 0;
    if (salary > 0 && totalExpenses < salary * 0.9) {
      setConsecutiveDaysOnBudget(prev => prev + 1);
    }
  };

  const handleSalaryUpdate = (newSalary: number) => {
    setSalary(newSalary);
  };

  const handleAddExtraIncome = (entry: Omit<ExtraIncomeEntry, 'id'>) => {
    const newId = uploadedData.length > 0 ? Math.max(...uploadedData.map(d => d.id)) + 1 : 1;
    const newTransaction: DataRow = {
      id: newId,
      data: entry.data,
      tipo: 'Renda Extra',
      descricao: entry.descricao,
      valor: entry.valor,
    };
    setUploadedData(prev => [...prev, newTransaction]);
    if (!hasData) setHasData(true);
  };

  const handleRemoveExtraIncome = (id: number) => {
    setUploadedData(prev => prev.filter(item => item.id !== id));
  };

  // Get extra income entries from transactions
  const extraIncomeEntries: ExtraIncomeEntry[] = uploadedData
    .filter(item => item.tipo.toLowerCase() === 'renda extra')
    .map(item => ({
      id: item.id,
      descricao: item.descricao,
      valor: item.valor,
      data: item.data,
    }));

  // Calculate financial summary based on filtered data
  const filteredData = filterDataByPeriod(uploadedData, selectedPeriod);
  
  // Filter out "Exemplo" from summary calculations
  const validFilteredData = filteredData.filter(row => 
    row.descricao && row.descricao.toLowerCase() !== 'exemplo'
  );
  
  // Receitas são todas as entradas de dinheiro
  const totalReceitas = validFilteredData
    .filter(row => {
      const tipo = row.tipo?.toLowerCase() || '';
      return tipo.includes('receita') || tipo.includes('entrada') || tipo === 'renda extra';
    })
    .reduce((sum, row) => sum + (row.valor || 0), 0);

  // Despesas são todas as saídas de dinheiro
  const totalDespesas = validFilteredData
    .filter(row => {
      const tipo = row.tipo?.toLowerCase() || '';
      return tipo.includes('despesa') || tipo.includes('saída');
    })
    .reduce((sum, row) => sum + (row.valor || 0), 0);

  // Saldo = Total de Receitas - Total de Despesas
  const saldoAtual = totalReceitas - totalDespesas;
  const calculateSummary = () => {
    if (!filteredData.length) return null;
    
    const receitas = filteredData.filter(item =>
      item.tipo.toLowerCase() === 'receita' || 
      item.tipo.toLowerCase() === 'entrada'
    ).reduce((sum, item) => sum + item.valor, 0);
    
    const rendaExtra = filteredData.filter(item => 
      item.tipo.toLowerCase() === 'renda extra'
    ).reduce((sum, item) => sum + item.valor, 0);
    
    const despesas = filteredData.filter(item => 
      item.tipo.toLowerCase() === 'despesa' || 
      item.tipo.toLowerCase() === 'saída'
    ).reduce((sum, item) => sum + item.valor, 0);
    
    // Categorização 50/30/20 (apenas despesas)
    const essenciais = filteredData.filter(item => 
      item.categoria === 'Essencial' && 
      (item.tipo.toLowerCase() === 'despesa' || item.tipo.toLowerCase() === 'saída')
    ).reduce((sum, item) => sum + item.valor, 0);
    
    const desejos = filteredData.filter(item => 
      item.categoria === 'Desejo' && 
      (item.tipo.toLowerCase() === 'despesa' || item.tipo.toLowerCase() === 'saída')
    ).reduce((sum, item) => sum + item.valor, 0);
    
    const poupanca = filteredData.filter(item => 
      item.categoria === 'Poupança' || 
      item.tipo.toLowerCase() === 'poupança' || 
      item.tipo.toLowerCase() === 'investimento'
    ).reduce((sum, item) => sum + item.valor, 0);
    
    const saldo = receitas + rendaExtra - despesas;
    
    return {
      receitas,
      rendaExtra,
      despesas,
      saldo,
      totalTransactions: filteredData.length,
      essenciais,
      desejos,
      poupanca
    };
  };

  const summary = calculateSummary();

  const handleCompleteOnboarding = () => {
    localStorage.setItem('educash-onboarding-completed', 'true');
    setShowOnboarding(false);
  };

  const handleSkipOnboarding = () => {
    localStorage.setItem('educash-onboarding-completed', 'true');
    setShowOnboarding(false);
  };

  return (
    <div className="min-h-screen transition-all duration-500 bg-gradient-to-br from-background to-muted/20 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Onboarding */}
      {showOnboarding && (
        <Onboarding onComplete={handleCompleteOnboarding} onSkip={handleSkipOnboarding} />
      )}

      {/* Enhanced Header */}
      <EnhancedHeader 
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        hasData={hasData}
        resetData={resetData}
        showBackButton={true}
      />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {!hasData ? (
          /* iOS-style Upload Section */
          <div className="space-y-10 animate-fadeIn">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary/10 to-accent/10 border-2 border-primary/20 rounded-full backdrop-blur-sm shadow-lg dark:from-primary/20 dark:to-accent/20 dark:border-primary/30">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-bold text-foreground font-ios">Sistema Educativo Financeiro</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight font-ios">
                Transforme suas planilhas em{" "}
                <span className="text-transparent bg-gradient-to-r from-educash-green-base via-primary to-educash-gold bg-clip-text animate-pulse">
                  conhecimento financeiro
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-ios">
                Faça o upload da sua planilha Excel e visualize seus dados financeiros com gráficos interativos,
                edite informações diretamente na interface e aprenda com dicas educativas personalizadas.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <IOSCard variant="elevated" hoverable className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center shadow-lg">
                  <Upload className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2 font-ios text-foreground">1. Upload Excel</h3>
                <p className="text-sm text-muted-foreground font-ios">
                  Carregue sua planilha financeira (.xlsx ou .xls)
                </p>
              </IOSCard>
              
              <IOSCard variant="elevated" hoverable className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-success to-success/70 rounded-2xl flex items-center justify-center shadow-lg">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 font-ios text-foreground">2. Visualize Dados</h3>
                <p className="text-sm text-muted-foreground font-ios">
                  Analise com gráficos interativos e dashboards
                </p>
              </IOSCard>
              
              <IOSCard variant="elevated" hoverable className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-warning to-warning/70 rounded-2xl flex items-center justify-center shadow-lg">
                  <Table className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 font-ios text-foreground">3. Edite Online</h3>
                <p className="text-sm text-muted-foreground font-ios">
                  Modifique dados diretamente pela interface
                </p>
              </IOSCard>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
              <IOSButton
                variant="secondary"
                size="lg"
                onClick={generateTemplateExcel}
                className="w-full sm:w-auto"
              >
                <FileSpreadsheet className="h-5 w-5" />
                Gerar Planilha Template
              </IOSButton>
              <span className="text-muted-foreground text-sm">ou</span>
            </div>

            <FileUpload onFileUpload={handleFileUpload} />
          </div>
        ) : (
          /* Enhanced Dashboard */
          <div className="space-y-6 animate-fadeIn">
            {/* Salary Configuration */}
            <SalaryConfig 
              currentSalary={salary}
              extraIncomeEntries={extraIncomeEntries}
              onSalaryUpdate={handleSalaryUpdate}
              onAddExtraIncome={handleAddExtraIncome}
              onRemoveExtraIncome={handleRemoveExtraIncome}
              isDarkMode={isDarkMode}
            />

            <EducationalTips 
              expenses={totalDespesas}
              salary={salary}
              isDarkMode={isDarkMode}
            />

            {/* Micro Achievements */}
            <MicroAchievements
              transactionCount={uploadedData.length}
              hasSetSalary={salary > 0}
              hasCreatedGoal={hasCreatedGoal}
              consecutiveDays={consecutiveDaysOnBudget}
            />

            {/* Privacy Toggle and Summary Cards */}
            {summary && (
              <div className="space-y-6">
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowValues(!showValues)}
                    className="gap-2 hover:scale-105 transition-transform"
                  >
                    {showValues ? (
                      <>
                        <EyeOff className="h-4 w-4" />
                        Ocultar Valores
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4" />
                        Mostrar Valores
                      </>
                    )}
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <StatCard
                    title="Total de Transações"
                    value={maskNumber(summary.totalTransactions, showValues)}
                    icon={BarChart3}
                    color="primary"
                    isDarkMode={isDarkMode}
                  />
                  <StatCard
                    title="Receitas"
                    value={maskCurrency(summary.receitas, showValues)}
                    icon={TrendingUp}
                    trend="up"
                    color="success"
                    isDarkMode={isDarkMode}
                  />
                  <StatCard
                    title="Despesas"
                    value={maskCurrency(summary.despesas, showValues)}
                    icon={TrendingDown}
                    trend="down"
                    color="danger"
                    isDarkMode={isDarkMode}
                  />
                  <StatCard
                    title="Saldo"
                    value={maskCurrency(summary.saldo, showValues)}
                    icon={DollarSign}
                    trend={summary.saldo >= 0 ? 'up' : 'down'}
                    color={summary.saldo >= 0 ? 'success' : 'danger'}
                    isDarkMode={isDarkMode}
                  />
                </div>
              </div>
            )}

            {/* Financial Education & AI Section */}
            {salary > 0 && summary && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <FinancialRuleCard 
                    salary={salary}
                    expenses={summary.despesas}
                    essenciais={summary.essenciais}
                    desejos={summary.desejos}
                    poupanca={summary.poupanca}
                    isDarkMode={isDarkMode}
                  />
                  <GamificationPanel 
                    totalTransactions={summary.totalTransactions}
                    consecutiveDaysOnBudget={consecutiveDaysOnBudget}
                    totalSaved={summary.saldo}
                    isDarkMode={isDarkMode}
                  />
                </div>

                {/* AI Intelligence Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <AIInsights data={filteredData} salary={salary} />
                  <ExpensePredictions data={uploadedData} />
                </div>
              </div>
            )}

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold text-foreground font-ios">Dashboard Financeiro</h2>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <Badge 
                    variant="default" 
                    className="bg-gradient-to-r from-success to-success/80 text-white px-4 py-1.5 rounded-full shadow-lg"
                  >
                    ✓ {uploadedData.length} transações carregadas
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className="border-2 border-info/30 text-info px-4 py-1.5 rounded-full backdrop-blur-sm"
                  >
                    🔄 Dados em tempo real
                  </Badge>
                </div>
              </div>
              
              <div className="flex gap-2">
                <IOSButton
                  variant="secondary"
                  size="lg"
                  onClick={() => exportToExcel(uploadedData)}
                >
                  <Download className="h-5 w-5" />
                  Exportar Excel
                </IOSButton>
                <IOSButton
                  variant="primary"
                  size="lg"
                  onClick={() => setShowAddForm(!showAddForm)}
                >
                  <Plus className="h-5 w-5" />
                  Nova Transação
                </IOSButton>
              </div>
            </div>

            {/* Transaction Form */}
            {showAddForm && (
              <TransactionForm
                onAddTransaction={handleAddTransaction}
                onClose={() => setShowAddForm(false)}
                isDarkMode={isDarkMode}
              />
            )}

            {/* Period Filter */}
            <PeriodFilter 
              selectedPeriod={selectedPeriod}
              onPeriodChange={setSelectedPeriod}
            />

            {selectedPeriod !== 'all' && (
              <div className="flex items-center justify-center">
                <Badge variant="outline" className="text-sm px-4 py-2">
                  📅 Visualizando: {getPeriodLabel(selectedPeriod)} ({filteredData.length} transações)
                </Badge>
              </div>
            )}

            <Tabs defaultValue="charts" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="bg-card/50 backdrop-blur-sm border-2 border-primary/10 rounded-full p-2 shadow-lg w-fit mx-auto flex-wrap">
                <TabsTrigger value="charts" className="flex items-center gap-2 transition-all duration-300">
                  <BarChart3 className="h-4 w-4" />
                  Gráficos
                </TabsTrigger>
                <TabsTrigger value="comparison" className="flex items-center gap-2 transition-all duration-300">
                  <TrendingUpIcon className="h-4 w-4" />
                  Comparativo
                </TabsTrigger>
                <TabsTrigger value="goals" className="flex items-center gap-2 transition-all duration-300">
                  <Target className="h-4 w-4" />
                  Metas
                </TabsTrigger>
                <TabsTrigger value="debts" className="flex items-center gap-2 transition-all duration-300">
                  <CreditCard className="h-4 w-4" />
                  Dívidas
                </TabsTrigger>
                <TabsTrigger value="challenges" className="flex items-center gap-2 transition-all duration-300">
                  <Sparkles className="h-4 w-4" />
                  Desafios
                </TabsTrigger>
                <TabsTrigger value="table" className="flex items-center gap-2 transition-all duration-300">
                  <Table className="h-4 w-4" />
                  Tabela
                </TabsTrigger>
              </TabsList>

              <TabsContent value="charts" className="space-y-6 animate-fade-in">
                <DataCharts data={filteredData} baseSalary={salary} showValues={showValues} />
              </TabsContent>

              <TabsContent value="comparison" className="space-y-6 animate-fade-in">
                <MonthlyComparison data={uploadedData} />
              </TabsContent>

              <TabsContent value="goals" className="space-y-6 animate-fade-in">
                <GoalsManager />
              </TabsContent>

              <TabsContent value="debts" className="space-y-6 animate-fade-in">
                <DebtsManager />
              </TabsContent>

              <TabsContent value="challenges" className="space-y-6 animate-fade-in">
                <WeeklyChallenges />
              </TabsContent>

              <TabsContent value="table" className="space-y-6 animate-fade-in">
                <DataTable data={filteredData} onDataChange={handleDataChange} showValues={showValues} />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>

      {/* Enhanced Footer */}
      <footer className="border-t mt-16 transition-all duration-500 bg-secondary/50 dark:bg-gray-900/50 dark:backdrop-blur-xl">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left">
              <p className="text-sm font-semibold text-foreground">© 2025 EduCA$H - Sistema Educativo Financeiro</p>
              <p className="text-xs text-muted-foreground mt-1">Desenvolvendo mentes ricas para futuros brilhantes ✨</p>
            </div>
            
            <div className="text-center sm:text-right">
              <p className="text-sm font-semibold text-foreground mb-1">Suporte</p>
              <a 
                href="mailto:educash.pe@gmail.com" 
                className="text-sm text-educash-green-base hover:text-educash-green-dark transition-colors font-medium"
              >
                educash.pe@gmail.com
              </a>
            </div>
          </div>
        </div>
      </footer>

      {showOnboarding && (
        <Onboarding onComplete={handleCompleteOnboarding} onSkip={handleSkipOnboarding} />
      )}

      {/* Floating Action Button - Only show on table tab */}
      {activeTab === "table" && (
        <FloatingActionButton onAddTransaction={handleQuickAddTransaction} />
      )}

      {/* Mascot Celebration */}
      <MascotCelebration
        show={showMascot}
        emotion="excited"
        message={mascotMessage}
        onClose={() => setShowMascot(false)}
      />
    </div>
  );
};

export default Index;
