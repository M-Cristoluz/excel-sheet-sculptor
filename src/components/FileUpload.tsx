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
      
      // Get the first sheet
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      // Process the data to handle the Excel structure
      const processedData = processExcelData(jsonData);
      
      onFileUpload(processedData);
      setUploadedFile(file.name);
      
      toast({
        title: "✅ Upload realizado com sucesso!",
        description: `Planilha ${file.name} carregada e processada.`,
      });
    } catch (error) {
      console.error('Error processing file:', error);
      toast({
        title: "❌ Erro no upload",
        description: "Não foi possível processar o arquivo. Verifique se é um arquivo Excel válido.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const processExcelData = (rawData: any[]): any[] => {
    // Find header row (usually contains "Data", "Tipo", etc.)
    let headerRowIndex = -1;
    let headers: string[] = [];

    for (let i = 0; i < rawData.length; i++) {
      const row = rawData[i];
      if (row && Array.isArray(row)) {
        const hasDataColumn = row.some(cell => 
          cell && typeof cell === 'string' && 
          (cell.toLowerCase().includes('data') || 
           cell.toLowerCase().includes('tipo') ||
           cell.toLowerCase().includes('descrição') ||
           cell.toLowerCase().includes('valor'))
        );
        
        if (hasDataColumn) {
          headerRowIndex = i;
          headers = row.filter(Boolean).map((h: any) => String(h));
          break;
        }
      }
    }

    if (headerRowIndex === -1) {
      // If no headers found, create default structure
      return rawData
        .filter((row, index) => index > 0 && row && row.length > 0)
        .map((row, index) => ({
          id: index + 1,
          data: row[0] || '',
          mes: row[1] || '',
          ano: row[2] || new Date().getFullYear(),
          tipo: row[3] || 'Despesa',
          descricao: row[4] || '',
          valor: parseFloat(row[5]) || 0,
        }));
    }

    // Process data rows
    const dataRows = rawData.slice(headerRowIndex + 1);
    return dataRows
      .filter(row => row && row.length > 0 && row.some(cell => cell !== null && cell !== undefined && cell !== ''))
      .map((row, index) => {
        const obj: any = { id: index + 1 };
        
        headers.forEach((header, colIndex) => {
          const value = row[colIndex];
          const lowerHeader = header.toLowerCase();
          
          if (lowerHeader.includes('data')) {
            obj.data = value || '';
          } else if (lowerHeader.includes('mês') || lowerHeader.includes('mes')) {
            obj.mes = value || '';
          } else if (lowerHeader.includes('ano')) {
            obj.ano = value || new Date().getFullYear();
          } else if (lowerHeader.includes('tipo')) {
            obj.tipo = value || 'Despesa';
          } else if (lowerHeader.includes('descrição') || lowerHeader.includes('descricao')) {
            obj.descricao = value || '';
          } else if (lowerHeader.includes('valor')) {
            obj.valor = typeof value === 'number' ? value : parseFloat(String(value).replace(/[^\d,-]/g, '').replace(',', '.')) || 0;
          } else {
            obj[header.toLowerCase()] = value;
          }
        });

        return obj;
      });
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