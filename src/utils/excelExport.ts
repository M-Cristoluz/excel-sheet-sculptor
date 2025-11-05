import * as XLSX from 'xlsx';

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

export const exportToExcel = (data: DataRow[], fileName: string = 'educash-dados.xlsx') => {
  // Preparar dados para exportação com formato compatível para reimportação
  const exportData = data.map(row => {
    // Garantir que data está em formato DD/MM/YYYY para melhor compatibilidade
    let dataFormatada = row.data;
    if (row.data && row.data.includes('-')) {
      const [ano, mes, dia] = row.data.split('-');
      dataFormatada = `${dia}/${mes}/${ano}`;
    }
    
    return {
      'Data': dataFormatada,
      'Mes': row.mes || '',
      'Ano': row.ano || new Date().getFullYear(),
      'Tipo': row.tipo,
      'Descricao': row.descricao,
      'Valor': row.valor,
      'Categoria': row.categoria || ''
    };
  });

  // Criar workbook e worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(exportData);

  // Ajustar largura das colunas
  const columnWidths = [
    { wch: 12 }, // Data
    { wch: 10 }, // Mes
    { wch: 6 },  // Ano
    { wch: 15 }, // Tipo
    { wch: 30 }, // Descricao
    { wch: 12 }, // Valor
    { wch: 18 }, // Categoria
  ];
  ws['!cols'] = columnWidths;

  // Adicionar worksheet ao workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Transações');

  // Gerar arquivo e fazer download
  XLSX.writeFile(wb, fileName);
};

export const generateTemplateExcel = () => {
  // Planilha limpa apenas com cabeçalhos compatíveis
  const templateData = [
    {
      'Data': '',
      'Mes': '',
      'Ano': '',
      'Tipo': '',
      'Descricao': '',
      'Valor': '',
      'Categoria': ''
    }
  ];

  // Criar workbook e worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(templateData);

  // Ajustar largura das colunas
  const columnWidths = [
    { wch: 12 }, // Data
    { wch: 10 }, // Mes
    { wch: 6 },  // Ano
    { wch: 15 }, // Tipo
    { wch: 30 }, // Descricao
    { wch: 12 }, // Valor
    { wch: 18 }, // Categoria
  ];
  ws['!cols'] = columnWidths;

  // Adicionar worksheet ao workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Transações');

  // Gerar arquivo e fazer download
  XLSX.writeFile(wb, 'educash-template.xlsx');
};
