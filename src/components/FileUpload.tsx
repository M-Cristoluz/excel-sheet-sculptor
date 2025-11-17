import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileSpreadsheet, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import * as XLSX from 'xlsx';

interface FileUploadProps {
  onFileUpload: (data: any[]) => void;
}

export const FileUpload = ({ onFileUpload }: FileUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    setIsUploading(true);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      
      console.log('📊 Planilha carregada:', workbook.SheetNames);
      
      // Find the "LANÇAMENTOS" sheet or use the first sheet
      let sheetName = workbook.SheetNames.find(name => 
        name.toLowerCase().includes('lançamento') || 
        name.toLowerCase().includes('lancamento')
      ) || workbook.SheetNames[0];
      
      console.log('📋 Usando aba:', sheetName);
      
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      console.log('📄 Dados brutos:', jsonData.slice(0, 10));
      
      // Process the data to handle the Excel structure
      const processedData = processExcelData(jsonData);
      
      console.log('✅ Dados processados:', processedData);
      console.log('📊 Total de registros:', processedData.length);
      
      if (processedData.length === 0) {
        toast({
          title: "⚠️ Nenhum dado encontrado",
          description: "A planilha não contém dados válidos. Verifique o formato.",
          variant: "destructive",
        });
        setIsUploading(false);
        return;
      }
      
      // Categorize expenses with AI
      const categorizedData = await categorizeExpensesWithAI(processedData);
      
      console.log('🤖 Dados categorizados:', categorizedData);
      
      onFileUpload(categorizedData);
      setUploadedFile(file.name);
      
      toast({
        title: "✅ Upload realizado com sucesso!",
        description: `${categorizedData.length} transações carregadas. ${categorizedData.filter(d => d.categoria).length} categorizadas pela IA.`,
      });
    } catch (error) {
      console.error('❌ Erro ao processar arquivo:', error);
      toast({
        title: "❌ Erro no upload",
        description: "Não foi possível processar o arquivo. Verifique se é um arquivo Excel válido.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const categorizeExpensesWithAI = async (data: any[]): Promise<any[]> => {
    const categorizedData = [...data];
    
    // Process only expenses that don't have a category yet
    const expensesToCategorize = categorizedData.filter(
      item => {
        const tipo = item.tipo.toLowerCase();
        return (tipo === 'despesa' || tipo === 'saída') && !item.categoria && item.descricao;
      }
    );

    console.log('🤖 Despesas para categorizar:', expensesToCategorize.length);

    if (expensesToCategorize.length === 0) {
      console.log('✅ Nenhuma despesa precisa ser categorizada');
      return categorizedData;
    }

    toast({
      title: "🤖 Categorizando com IA...",
      description: `Analisando ${expensesToCategorize.length} despesas em lotes...`,
    });

    let successCount = 0;
    let errorCount = 0;

    // Helper function to call AI with retry
    const categorizeWithRetry = async (descricao: string, maxRetries = 3): Promise<string | null> => {
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/categorize-transaction`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`
              },
              body: JSON.stringify({ descricao })
            }
          );

          if (response.ok) {
            const data = await response.json();
            return data.categoria;
          } else if (response.status === 429) {
            // Rate limited - wait longer before retry
            const waitTime = Math.min(2000 * Math.pow(2, attempt - 1), 10000);
            console.log(`⏳ Rate limit atingido. Aguardando ${waitTime}ms antes de tentar novamente...`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
            continue;
          } else {
            console.error(`❌ Erro ${response.status} ao categorizar "${descricao}"`);
            return null;
          }
        } catch (error) {
          console.error(`❌ Erro na tentativa ${attempt} para "${descricao}":`, error);
          if (attempt === maxRetries) return null;
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }
      return null;
    };

    // Process sequentially with delays to avoid rate limits
    for (let i = 0; i < expensesToCategorize.length; i++) {
      const item = expensesToCategorize[i];
      
      console.log(`📝 Categorizando ${i + 1}/${expensesToCategorize.length}: "${item.descricao}"`);
      
      const categoria = await categorizeWithRetry(item.descricao);
      
      if (categoria) {
        item.categoria = categoria;
        successCount++;
        console.log(`✅ "${item.descricao}" → ${categoria}`);
      } else {
        errorCount++;
      }
      
      // Delay between requests (2.5 seconds to stay well under rate limits)
      if (i < expensesToCategorize.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2500));
      }
    }

    console.log(`🎯 Categorização concluída: ${successCount} sucesso, ${errorCount} erros`);

    if (errorCount > 0) {
      toast({
        title: "⚠️ Categorização parcial",
        description: `${successCount} despesas categorizadas com IA. ${errorCount} precisam de categorização manual.`,
        variant: "default",
      });
    } else if (successCount > 0) {
      toast({
        title: "✅ Categorização concluída!",
        description: `${successCount} despesas categorizadas automaticamente pela IA.`,
      });
    }

    return categorizedData;
  };

  const processExcelData = (rawData: any[]): any[] => {
    console.log('🔍 Iniciando processamento dos dados...');
    console.log('📊 Total de linhas brutas:', rawData.length);
    console.log('🔍 Primeiras 15 linhas:', rawData.slice(0, 15));
    
    // Função auxiliar para normalizar strings
    const normalizeString = (str: string): string => {
      if (!str) return '';
      return str.toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    };
    
    // A planilha PlanilhaEduCaH.xlsx tem cabeçalhos na linha 13 (índice 12)
    // Formato: Data | mês | Ano | Tipo | Descrição | Valor
    let headerRowIndex = -1;
    let headers: string[] = [];

    // Procurar cabeçalho especificamente entre linhas 10-25 (onde geralmente está)
    for (let i = 10; i < Math.min(25, rawData.length); i++) {
      const row = rawData[i];
      if (row && Array.isArray(row)) {
        // Normalizar células para comparação
        const normalizedCells = row.map(cell => normalizeString(String(cell || '')));
        
        // Verificar presença de todas as colunas esperadas
        const hasData = normalizedCells.some(cell => cell === 'data');
        const hasMes = normalizedCells.some(cell => cell === 'mes');
        const hasAno = normalizedCells.some(cell => cell === 'ano');
        const hasTipo = normalizedCells.some(cell => cell === 'tipo');
        const hasDescricao = normalizedCells.some(cell => cell === 'descricao');
        const hasValor = normalizedCells.some(cell => cell === 'valor');
        
        if (hasData && hasMes && hasAno && hasTipo && hasDescricao && hasValor) {
          headerRowIndex = i;
          headers = row.map((h: any) => h ? String(h).trim() : '');
          console.log('✅ Cabeçalhos encontrados na linha', i + 1, ':', headers);
          break;
        }
      }
    }
    
    // Se não encontrou entre linhas 10-25, buscar em todo o arquivo
    if (headerRowIndex === -1) {
      console.log('⚠️ Cabeçalho não encontrado nas linhas 10-25, buscando em todo arquivo...');
      for (let i = 0; i < rawData.length; i++) {
        const row = rawData[i];
        if (row && Array.isArray(row)) {
          const normalizedCells = row.map(cell => normalizeString(String(cell || '')));
          
          const hasData = normalizedCells.some(cell => cell === 'data');
          const hasTipo = normalizedCells.some(cell => cell === 'tipo');
          const hasValor = normalizedCells.some(cell => cell === 'valor');
          
          if (hasData && hasTipo && hasValor) {
            headerRowIndex = i;
            headers = row.map((h: any) => h ? String(h).trim() : '');
            console.log('✅ Cabeçalhos encontrados na linha', i + 1, ':', headers);
            break;
          }
        }
      }
    }

    if (headerRowIndex === -1) {
      console.error('❌ Cabeçalhos não encontrados!');
      console.log('🔍 Todas as linhas:', rawData);
      return [];
    }

    // Process data rows
    const dataRows = rawData.slice(headerRowIndex + 1);
    console.log('📊 Processando', dataRows.length, 'linhas de dados');
    console.log('🔍 Primeiras 3 linhas de dados:', dataRows.slice(0, 3));
    
    const processedData = dataRows
      .map((row, index) => {
        // Skip empty rows
        if (!row || !Array.isArray(row) || row.every(cell => !cell || cell === '')) {
          console.log(`⏭️  Linha ${index} ignorada: vazia`);
          return null;
        }

        const obj: any = { id: Date.now() + index };
        let hasData = false;
        
        console.log(`\n🔍 Processando linha ${index}:`, row);
        
        headers.forEach((header, colIndex) => {
          const value = row[colIndex];
          if (!header) return;
          
          // Normalizar header removendo acentos para comparação mais flexível
          const lowerHeader = header.toLowerCase();
          const normalizedHeader = lowerHeader.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
          
          if (normalizedHeader.includes('data')) {
            if (value) {
              // Handle Excel date format
              let dateValue;
              if (typeof value === 'number') {
                // Excel date serial number
                const excelEpoch = new Date(1899, 11, 30);
                dateValue = new Date(excelEpoch.getTime() + value * 86400000);
              } else if (typeof value === 'string') {
                // Try to parse string date - support multiple formats
                if (value.includes('/')) {
                  const parts = value.split('/');
                  if (parts.length === 3) {
                    // Format: DD/MM/YYYY or DD/MM/YY
                    let day = parseInt(parts[0]);
                    let month = parseInt(parts[1]) - 1; // JS months are 0-based
                    let year = parseInt(parts[2]);
                    if (year < 100) year += 2000;
                    dateValue = new Date(year, month, day);
                  }
                } else if (value.includes('-')) {
                  // Format: YYYY-MM-DD
                  dateValue = new Date(value);
                } else {
                  dateValue = new Date(value);
                }
              } else {
                dateValue = new Date(value);
              }
              
              if (dateValue && !isNaN(dateValue.getTime())) {
                obj.data = dateValue.toISOString().split('T')[0];
                obj.mes = dateValue.toLocaleDateString('pt-BR', { month: 'long' });
                obj.ano = dateValue.getFullYear();
                hasData = true;
              }
            }
          } else if (normalizedHeader.includes('tipo')) {
            if (value) {
              let tipo = String(value).trim();
              // Normalize type - aceita Entrada/Saída/Receita/Despesa/Renda Extra
              if (tipo === 'Entrada') tipo = 'Receita';
              else if (tipo === 'Saída') tipo = 'Despesa';
              // Manter "Renda Extra" como está
              obj.tipo = tipo;
              hasData = true;
            }
          } else if (normalizedHeader.includes('descricao')) {
            if (value) {
              obj.descricao = String(value).trim();
              hasData = true;
            }
          } else if (normalizedHeader.includes('categoria')) {
            if (value) {
              const categoriaValue = String(value).trim();
              if (categoriaValue && categoriaValue !== '') {
                obj.categoria = categoriaValue;
              }
            }
          } else if (normalizedHeader.includes('mes')) {
            if (value) {
              const mesValue = String(value).trim();
              // Converter siglas de mês para nome completo
              const mesesMap: { [key: string]: string } = {
                'JAN': 'janeiro', 'FEV': 'fevereiro', 'MAR': 'março', 'ABR': 'abril',
                'MAI': 'maio', 'JUN': 'junho', 'JUL': 'julho', 'AGO': 'agosto',
                'SET': 'setembro', 'OUT': 'outubro', 'NOV': 'novembro', 'DEZ': 'dezembro'
              };
              obj.mes = mesesMap[mesValue.toUpperCase()] || mesValue;
            }
          } else if (normalizedHeader.includes('ano')) {
            if (value) {
              obj.ano = parseInt(String(value));
            }
          } else if (normalizedHeader.includes('valor')) {
            // Aceitar qualquer valor, incluindo vazio, zero ou string vazia
            if (value !== undefined && value !== null) {
              // Handle different value formats
              let valorStr = String(value).trim();
              
              // Se vazio, atribuir 0
              if (valorStr === '' || valorStr === 'R$' || valorStr === 'R$ ') {
                obj.valor = 0;
                // Não marcar como hasData para que linhas só com valor zero sejam ignoradas
              } else {
                // Remove R$, spaces, and convert to number
                // Format can be: R$ 1,000.00 or R$ 1.000,00 or 1000.00 or 1.000,00
                valorStr = valorStr.replace(/R\$/g, '').replace(/\s/g, '').trim();
                
                // Detectar formato: se tem vírgula, assumir formato brasileiro (1.000,00)
                // Se tem apenas ponto, assumir formato americano (1000.00)
                if (valorStr.includes(',')) {
                  // Formato brasileiro: remover pontos (separadores de milhares) e trocar vírgula por ponto
                  valorStr = valorStr.replace(/\./g, '').replace(',', '.');
                }
                // Se tiver apenas ponto, já está em formato correto para parseFloat
                
                const numero = parseFloat(valorStr);
                if (!isNaN(numero)) {
                  obj.valor = Math.abs(numero);
                  if (numero > 0) {
                    hasData = true;
                  }
                }
              }
            }
          }
        });

        // Only return rows with actual data (linha precisa ter tipo, descrição e data válidos)
        if (!hasData || !obj.tipo || !obj.descricao) {
          console.log(`❌ Linha ${index} ignorada - Faltando dados obrigatórios:`, {
            hasData,
            tipo: obj.tipo,
            descricao: obj.descricao,
            valor: obj.valor
          });
          return null;
        }
        
        // Se valor não foi definido, atribuir 0
        if (obj.valor === undefined || obj.valor === null) {
          obj.valor = 0;
        }

        // Ensure all required fields exist
        if (!obj.data) {
          console.warn(`⚠️  Linha ${index}: data ausente, usando data atual`);
          obj.data = new Date().toISOString().split('T')[0];
        }
        if (!obj.mes) {
          console.warn(`⚠️  Linha ${index}: mês ausente, usando mês atual`);
          obj.mes = new Date().toLocaleDateString('pt-BR', { month: 'long' });
        }
        if (!obj.ano) {
          console.warn(`⚠️  Linha ${index}: ano ausente, usando ano atual`);
          obj.ano = new Date().getFullYear();
        }
        
        console.log(`✅ Linha ${index} processada com sucesso:`, obj);
        return obj;
      })
      .filter(item => item !== null);

    console.log('📊 Total de transações válidas:', processedData.length);
    return processedData;
  };

  const handleFileSelect = (file: File) => {
    if (file && (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
                 file.type === 'application/vnd.ms-excel' ||
                 file.name.endsWith('.xlsx') || 
                 file.name.endsWith('.xls'))) {
      processFile(file);
    } else {
      toast({
        title: "❌ Tipo de arquivo inválido",
        description: "Por favor, selecione um arquivo Excel (.xlsx ou .xls)",
        variant: "destructive",
      });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <FileSpreadsheet className="h-6 w-6" />
          Upload da Planilha Excel
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer ${
            isDragOver
              ? 'border-primary bg-primary/5'
              : uploadedFile
              ? 'border-success bg-success/5'
              : 'border-muted-foreground/25 hover:border-primary hover:bg-primary/5'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileSelect(file);
            }}
            className="hidden"
          />
          
          {isUploading ? (
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="text-muted-foreground">Processando planilha...</p>
            </div>
          ) : uploadedFile ? (
            <div className="flex flex-col items-center gap-4">
              <CheckCircle className="h-12 w-12 text-success" />
              <div>
                <p className="text-lg font-semibold text-success">Upload realizado!</p>
                <p className="text-sm text-muted-foreground">{uploadedFile}</p>
              </div>
              <Button variant="outline" size="sm">
                Enviar outro arquivo
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <Upload className="h-12 w-12 text-muted-foreground" />
              <div>
                <p className="text-lg font-semibold">Arraste sua planilha aqui</p>
                <p className="text-sm text-muted-foreground">
                  ou clique para selecionar um arquivo Excel (.xlsx, .xls)
                </p>
              </div>
              <Button variant="outline">
                Selecionar Arquivo
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};