import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FileUpload } from "@/components/FileUpload";
import { DataTable } from "@/components/DataTable";
import { DataCharts } from "@/components/DataCharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Table, Upload, BookOpen, Plus, DollarSign, TrendingUp, TrendingDown, Sparkles, Download, ArrowLeft, FileSpreadsheet } from "lucide-react";
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

const Index = () => {
  const navigate = useNavigate();
  const [uploadedData, setUploadedData] = useState<DataRow[]>([]);
  const [hasData, setHasData] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [salary, setSalary] = useState<number>(0);
  const [extraIncome, setExtraIncome] = useState<number>(0);
  const [consecutiveDaysOnBudget, setConsecutiveDaysOnBudget] = useState(0);

  // Load preferences
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('educash-dark-mode');
    const savedSalary = localStorage.getItem('educash-salary');
    const savedExtra = localStorage.getItem('educash-extra-income');
    const savedDays = localStorage.getItem('educash-consecutive-days');
    
    if (savedDarkMode) {
      setIsDarkMode(JSON.parse(savedDarkMode));
    }
    if (savedSalary) {
      setSalary(parseFloat(savedSalary));
    }
    if (savedExtra) {
      setExtraIncome(parseFloat(savedExtra));
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
    localStorage.setItem('educash-extra-income', extraIncome.toString());
  }, [extraIncome]);

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
    setUploadedData(newData);
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

  const handleExtraIncomeUpdate = (newIncome: number) => {
    setExtraIncome(newIncome);
  };

  // Calculate summary statistics
  const calculateSummary = () => {
    if (!uploadedData.length) return null;
    
    const receitas = uploadedData.filter(item => item.tipo.toLowerCase() === 'receita').reduce((sum, item) => sum + item.valor, 0);
    const rendaExtra = uploadedData.filter(item => item.tipo.toLowerCase() === 'renda extra').reduce((sum, item) => sum + item.valor, 0);
    const despesas = uploadedData.filter(item => item.tipo.toLowerCase().includes('despesa')).reduce((sum, item) => sum + item.valor, 0);
    
    // Categorização 50/30/20
    const essenciais = uploadedData.filter(item => item.categoria === 'Essencial').reduce((sum, item) => sum + item.valor, 0);
    const desejos = uploadedData.filter(item => item.categoria === 'Desejo').reduce((sum, item) => sum + item.valor, 0);
    const poupanca = uploadedData.filter(item => item.categoria === 'Poupança' || item.tipo.toLowerCase() === 'poupança' || item.tipo.toLowerCase() === 'investimento').reduce((sum, item) => sum + item.valor, 0);
    
    const saldo = receitas + rendaExtra - despesas;
    
    return {
      receitas,
      rendaExtra,
      despesas,
      saldo,
      totalTransactions: uploadedData.length,
      essenciais,
      desejos,
      poupanca
    };
  };

  const summary = calculateSummary();

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-background to-muted/20'
    }`}>
      {/* Back Button */}
      <div className="container mx-auto px-4 pt-4">
        <button
          onClick={() => navigate('/')}
          className="p-3 rounded-full bg-gradient-to-r from-educash-green-base to-primary hover:from-educash-green-dark hover:to-primary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
      </div>

      {/* Enhanced Header */}
      <EnhancedHeader 
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        hasData={hasData}
        resetData={resetData}
      />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {!hasData ? (
          /* iOS-style Upload Section */
          <div className="space-y-10 animate-fadeIn">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary/10 to-accent/10 border-2 border-primary/20 rounded-full backdrop-blur-sm shadow-lg">
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
                  <Upload className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 font-ios">1. Upload Excel</h3>
                <p className="text-sm text-muted-foreground font-ios">
                  Carregue sua planilha financeira (.xlsx ou .xls)
                </p>
              </IOSCard>
              
              <IOSCard variant="elevated" hoverable className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-success to-success/70 rounded-2xl flex items-center justify-center shadow-lg">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 font-ios">2. Visualize Dados</h3>
                <p className="text-sm text-muted-foreground font-ios">
                  Analise com gráficos interativos e dashboards
                </p>
              </IOSCard>
              
              <IOSCard variant="elevated" hoverable className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-warning to-warning/70 rounded-2xl flex items-center justify-center shadow-lg">
                  <Table className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 font-ios">3. Edite Online</h3>
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
              onSalaryUpdate={handleSalaryUpdate}
              onExtraIncomeUpdate={handleExtraIncomeUpdate}
              currentSalary={salary}
              extraIncome={extraIncome}
              isDarkMode={isDarkMode}
            />

            {/* Educational Tips */}
            {salary > 0 && summary && (
              <EducationalTips 
                expenses={summary.despesas}
                salary={salary}
                isDarkMode={isDarkMode}
              />
            )}

            {/* Summary Cards */}
            {summary && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard
                  title="Total de Transações"
                  value={summary.totalTransactions}
                  icon={BarChart3}
                  color="primary"
                  isDarkMode={isDarkMode}
                />
                <StatCard
                  title="Receitas"
                  value={`R$ ${summary.receitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                  icon={TrendingUp}
                  trend="up"
                  color="success"
                  isDarkMode={isDarkMode}
                />
                <StatCard
                  title="Despesas"
                  value={`R$ ${summary.despesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                  icon={TrendingDown}
                  trend="down"
                  color="danger"
                  isDarkMode={isDarkMode}
                />
                <StatCard
                  title="Saldo"
                  value={`R$ ${summary.saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                  icon={DollarSign}
                  trend={summary.saldo >= 0 ? 'up' : 'down'}
                  color={summary.saldo >= 0 ? 'success' : 'danger'}
                  isDarkMode={isDarkMode}
                />
              </div>
            )}

            {/* Financial Education Cards */}
            {salary > 0 && summary && (
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

            <Tabs defaultValue="charts" className="space-y-6">
              <TabsList className={`grid w-full grid-cols-2 max-w-md ${isDarkMode ? 'glass-effect' : ''}`}>
                <TabsTrigger value="charts" className="flex items-center gap-2 transition-all duration-300">
                  <BarChart3 className="h-4 w-4" />
                  Gráficos
                </TabsTrigger>
                <TabsTrigger value="table" className="flex items-center gap-2 transition-all duration-300">
                  <Table className="h-4 w-4" />
                  Tabela
                </TabsTrigger>
              </TabsList>

              <TabsContent value="charts" className="space-y-6">
                <DataCharts data={uploadedData} />
              </TabsContent>

              <TabsContent value="table" className="space-y-6">
                <DataTable data={uploadedData} onDataChange={handleDataChange} />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>

      {/* Enhanced Footer */}
      <footer className={`border-t mt-16 transition-all duration-500 ${
        isDarkMode ? 'bg-gray-900/50 glass-effect' : 'bg-secondary/50'
      }`}>
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2025 EduCA$H - Sistema Educativo Financeiro</p>
            <p className="mt-1">Desenvolvendo mentes ricas para futuros brilhantes ✨</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
