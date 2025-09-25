import { useState } from "react";
import { FileUpload } from "@/components/FileUpload";
import { DataTable } from "@/components/DataTable";
import { DataCharts } from "@/components/DataCharts";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Table, Upload, BookOpen } from "lucide-react";
import educashLogo from "@/assets/educash-logo.png";

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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <header className="bg-gradient-to-r from-educash-green-dark to-educash-green-base shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src={educashLogo} 
                alt="EduCA$H Logo" 
                className="h-12 w-12 rounded-lg bg-white/10 p-1"
              />
              <div>
                <h1 className="text-2xl font-bold text-white">EduCA$H</h1>
                <p className="text-educash-slogan text-sm">MENTE RICA, FUTURO BRILHANTE.</p>
              </div>
            </div>
            {hasData && (
              <Button onClick={resetData} variant="outline" className="border-white/20 text-white hover:bg-white/10">
                Nova Planilha
              </Button>
            )}
          </div>
        </div>
      </header>

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
          /* Main Dashboard */
          <div className="space-y-6">
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
            </div>

            <Tabs defaultValue="charts" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 max-w-md">
                <TabsTrigger value="charts" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Gráficos
                </TabsTrigger>
                <TabsTrigger value="table" className="flex items-center gap-2">
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

      {/* Footer */}
      <footer className="bg-secondary/50 border-t mt-16">
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
