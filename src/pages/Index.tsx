import { useState, useEffect } from "react";
import { FileUpload } from "@/components/FileUpload";
import { DataTable } from "@/components/DataTable";
import { DataCharts } from "@/components/DataCharts";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Table, Upload, BookOpen, Plus, DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import EnhancedHeader from "@/components/EnhancedHeader";
import StatCard from "@/components/StatCard";
import TransactionForm from "@/components/TransactionForm";

interface DataRow {
  id: number;
  data: string;
  mes?: string;
  ano?: number;
  tipo: string;
  descricao: string;
  valor: number;
}

const Index = () => {
  const [uploadedData, setUploadedData] = useState<DataRow[]>([]);
  const [hasData, setHasData] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // Load dark mode preference
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('educash-dark-mode');
    if (savedDarkMode) {
      setIsDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  // Save dark mode preference and apply to document
  useEffect(() => {
    localStorage.setItem('educash-dark-mode', JSON.stringify(isDarkMode));
    
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

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
  };

  // Calculate summary statistics
  const calculateSummary = () => {
    if (!uploadedData.length) return null;
    
    const receitas = uploadedData.filter(item => item.tipo.toLowerCase().includes('receita')).reduce((sum, item) => sum + item.valor, 0);
    const despesas = uploadedData.filter(item => item.tipo.toLowerCase().includes('despesa')).reduce((sum, item) => sum + item.valor, 0);
    const saldo = receitas - despesas;
    
    return {
      receitas,
      despesas,
      saldo,
      totalTransactions: uploadedData.length
    };
  };

  const summary = calculateSummary();

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-background to-muted/20'
    }`}>
      {/* Enhanced Header */}
      <EnhancedHeader 
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        hasData={hasData}
        resetData={resetData}
      />

      <main className="container mx-auto px-4 py-8">
        {!hasData ? (
          /* Upload Section */
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/20 rounded-full">
                <BookOpen className="h-4 w-4 text-accent-foreground" />
                <span className="text-sm font-medium text-accent-foreground">Sistema Educativo Financeiro</span>
              </div>
              <h2 className="text-3xl font-bold text-foreground">
                Transforme suas planilhas em{" "}
                <span className="text-transparent bg-gradient-to-r from-educash-green-base to-educash-gold bg-clip-text">
                  conhecimento financeiro
                </span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Faça o upload da sua planilha Excel e visualize seus dados financeiros com gráficos interativos,
                edite informações diretamente na interface e aprenda com dicas educativas personalizadas.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-card border rounded-lg">
                <Upload className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">1. Upload Excel</h3>
                <p className="text-sm text-muted-foreground">
                  Carregue sua planilha financeira (.xlsx ou .xls)
                </p>
              </div>
              <div className="text-center p-6 bg-card border rounded-lg">
                <BarChart3 className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">2. Visualize Dados</h3>
                <p className="text-sm text-muted-foreground">
                  Analise com gráficos interativos e dashboards
                </p>
              </div>
              <div className="text-center p-6 bg-card border rounded-lg">
                <Table className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">3. Edite Online</h3>
                <p className="text-sm text-muted-foreground">
                  Modifique dados diretamente pela interface
                </p>
              </div>
            </div>

            <FileUpload onFileUpload={handleFileUpload} />
          </div>
        ) : (
          /* Enhanced Dashboard */
          <div className="space-y-6 animate-fadeIn">
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

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Dashboard Financeiro</h2>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="default" className="bg-success text-white">
                    {uploadedData.length} transações carregadas
                  </Badge>
                  <Badge variant="outline">
                    Dados atualizados em tempo real
                  </Badge>
                </div>
              </div>
              <Button 
                onClick={() => setShowAddForm(!showAddForm)}
                className="hover:scale-105 transition-all duration-300"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nova Transação
              </Button>
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
