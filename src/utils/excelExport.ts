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
  // Preparar dados para exportação
  const exportData = data.map(row => ({
    'Data': row.data,
    'Mês': row.mes || '',
    'Ano': row.ano || '',
    'Tipo': row.tipo,
    'Descrição': row.descricao,
    'Valor': row.valor,
    'Categoria 50/30/20': row.categoria || ''
  }));

  // Criar workbook e worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(exportData);

  // Ajustar largura das colunas
  const columnWidths = [
    { wch: 12 }, // Data
    { wch: 10 }, // Mês
    { wch: 6 },  // Ano
    { wch: 15 }, // Tipo
    { wch: 30 }, // Descrição
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
  // Dados de exemplo para a planilha template
  const templateData = [
    {
      'Data': '01/01/2025',
      'Mês': 'Janeiro',
      'Ano': 2025,
      'Tipo': 'Receita',
      'Descrição': 'Salário',
      'Valor': 5000.00,
      'Categoria 50/30/20': 'Essencial'
    },
    {
      'Data': '05/01/2025',
      'Mês': 'Janeiro',
      'Ano': 2025,
      'Tipo': 'Despesa',
      'Descrição': 'Aluguel',
      'Valor': 1500.00,
      'Categoria 50/30/20': 'Essencial'
    },
    {
      'Data': '10/01/2025',
      'Mês': 'Janeiro',
      'Ano': 2025,
      'Tipo': 'Despesa',
      'Descrição': 'Supermercado',
      'Valor': 800.00,
      'Categoria 50/30/20': 'Essencial'
    },
    {
      'Data': '15/01/2025',
      'Mês': 'Janeiro',
      'Ano': 2025,
      'Tipo': 'Despesa',
      'Descrição': 'Cinema',
      'Valor': 80.00,
      'Categoria 50/30/20': 'Desejo'
    },
    {
      'Data': '20/01/2025',
      'Mês': 'Janeiro',
      'Ano': 2025,
      'Tipo': 'Poupança',
      'Descrição': 'Investimento',
      'Valor': 500.00,
      'Categoria 50/30/20': 'Poupança'
    }
  ];

  // Criar workbook e worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(templateData);

  // Ajustar largura das colunas
  const columnWidths = [
    { wch: 12 }, // Data
    { wch: 10 }, // Mês
    { wch: 6 },  // Ano
    { wch: 15 }, // Tipo
    { wch: 30 }, // Descrição
    { wch: 12 }, // Valor
    { wch: 18 }, // Categoria
  ];
  ws['!cols'] = columnWidths;

  // Adicionar worksheet ao workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Transações');

  // Gerar arquivo e fazer download
  XLSX.writeFile(wb, 'educash-template.xlsx');
};
