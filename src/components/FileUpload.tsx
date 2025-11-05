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
      item => (item.tipo === 'Despesa' || item.tipo === 'Saída') && !item.categoria && item.descricao
    );

    console.log('🤖 Despesas para categorizar:', expensesToCategorize.length);

    if (expensesToCategorize.length === 0) {
      console.log('✅ Nenhuma despesa precisa ser categorizada');
      return categorizedData;
    }

    toast({
      title: "🤖 Categorizando com IA...",
      description: `Analisando ${expensesToCategorize.length} despesas...`,
    });

    let successCount = 0;
    let errorCount = 0;

    // Categorize in parallel (up to 5 at a time to avoid rate limits)
    const batchSize = 5;
    for (let i = 0; i < expensesToCategorize.length; i += batchSize) {
      const batch = expensesToCategorize.slice(i, i + batchSize);
      
      console.log(`📦 Processando lote ${Math.floor(i/batchSize) + 1}:`, batch.map(b => b.descricao));
      
      await Promise.all(
        batch.map(async (item) => {
          try {
            const response = await fetch(
              `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/categorize-transaction`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`
                },
                body: JSON.stringify({ descricao: item.descricao })
              }
            );

            if (response.ok) {
              const data = await response.json();
              item.categoria = data.categoria;
              successCount++;
              console.log(`✅ "${item.descricao}" → ${data.categoria}`);
            } else {
              errorCount++;
              console.error(`❌ Erro ao categorizar "${item.descricao}":`, response.status);
            }
          } catch (error) {
            errorCount++;
            console.error(`❌ Erro ao categorizar "${item.descricao}":`, error);
          }
        })
      );

      // Small delay between batches
      if (i + batchSize < expensesToCategorize.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log(`🎯 Categorização concluída: ${successCount} sucesso, ${errorCount} erros`);

    if (successCount > 0) {
      toast({
        title: "✅ Categorização concluída!",
        description: `${successCount} despesas categorizadas com IA`,
      });
    }

    return categorizedData;
  };

  const processExcelData = (rawData: any[]): any[] => {
    console.log('🔍 Iniciando processamento dos dados...');
    
    // Find header row (usually contains "Data", "Tipo", etc.)
    let headerRowIndex = -1;
    let headers: string[] = [];

    for (let i = 0; i < rawData.length; i++) {
      const row = rawData[i];
      if (row && Array.isArray(row)) {
        const hasRequiredColumns = row.some(cell => 
          cell && typeof cell === 'string' && 
          cell.toLowerCase().includes('data')
        ) && row.some(cell => 
          cell && typeof cell === 'string' && 
          cell.toLowerCase().includes('tipo')
        );
        
        if (hasRequiredColumns) {
          headerRowIndex = i;
          headers = row.map((h: any) => h ? String(h).trim() : '');
          console.log('📋 Cabeçalhos encontrados na linha', i, ':', headers);
          break;
        }
      }
    }

    if (headerRowIndex === -1) {
      console.warn('⚠️ Cabeçalhos não encontrados, usando estrutura padrão');
      return [];
    }

    // Process data rows
    const dataRows = rawData.slice(headerRowIndex + 1);
    console.log('📊 Processando', dataRows.length, 'linhas de dados');
    
    const processedData = dataRows
      .map((row, index) => {
        // Skip empty rows
        if (!row || !Array.isArray(row) || row.every(cell => !cell || cell === '')) {
          return null;
        }

        const obj: any = { id: Date.now() + index };
        let hasData = false;
        
        headers.forEach((header, colIndex) => {
          const value = row[colIndex];
          if (!header) return;
          
          const lowerHeader = header.toLowerCase();
          
          if (lowerHeader.includes('data')) {
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
          } else if (lowerHeader.includes('tipo')) {
            if (value) {
              let tipo = String(value).trim();
              // Normalize type - aceita tanto formato antigo quanto novo
              if (tipo === 'Entrada') tipo = 'Receita';
              else if (tipo === 'Saída') tipo = 'Despesa';
              obj.tipo = tipo;
              hasData = true;
            }
          } else if (lowerHeader.includes('descrição') || lowerHeader.includes('descricao')) {
            if (value) {
              obj.descricao = String(value).trim();
              hasData = true;
            }
          } else if (lowerHeader.includes('categoria')) {
            if (value) {
              const categoriaValue = String(value).trim();
              if (categoriaValue && categoriaValue !== '') {
                obj.categoria = categoriaValue;
              }
            }
          } else if (lowerHeader.includes('mês') || lowerHeader.includes('mes')) {
            if (value) {
              obj.mes = String(value).trim();
            }
          } else if (lowerHeader.includes('ano')) {
            if (value) {
              obj.ano = parseInt(String(value));
            }
          } else if (lowerHeader.includes('valor')) {
            if (value !== undefined && value !== null && value !== '') {
              // Handle different value formats
              let valorStr = String(value);
              
              // Remove R$, spaces, and convert to number
              // Format can be: R$ 1,000.00 or R$ 1.000,00 or 1000.00
              valorStr = valorStr.replace(/R\$/g, '').trim();
              
              // Check if it uses comma as decimal separator (Brazilian format)
              if (valorStr.includes(',')) {
                // Remove dots (thousand separators) and replace comma with dot
                valorStr = valorStr.replace(/\./g, '').replace(',', '.');
              }
              
              const numero = parseFloat(valorStr);
              if (!isNaN(numero) && numero > 0) {
                obj.valor = Math.abs(numero);
                hasData = true;
              }
            }
          }
        });

        // Only return rows with actual data
        if (!hasData || !obj.tipo || !obj.descricao || !obj.valor) {
          return null;
        }

        // Ensure all required fields exist
        if (!obj.data) obj.data = new Date().toISOString().split('T')[0];
        if (!obj.mes) obj.mes = new Date().toLocaleDateString('pt-BR', { month: 'long' });
        if (!obj.ano) obj.ano = new Date().getFullYear();
        
        console.log('✅ Linha processada:', obj);
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