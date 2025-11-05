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

// Função auxiliar para converter mês em sigla
const getMesSigla = (mes: string): string => {
  const mesesMap: { [key: string]: string } = {
    'janeiro': 'JAN', 'fevereiro': 'FEV', 'março': 'MAR', 'abril': 'ABR',
    'maio': 'MAI', 'junho': 'JUN', 'julho': 'JUL', 'agosto': 'AGO',
    'setembro': 'SET', 'outubro': 'OUT', 'novembro': 'NOV', 'dezembro': 'DEZ'
  };
  return mesesMap[mes.toLowerCase()] || mes.toUpperCase().substring(0, 3);
};

// Função auxiliar para formatar valor em moeda brasileira
const formatarValor = (valor: number): string => {
  return `R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const exportToExcel = (data: DataRow[], fileName: string = 'educash-dados.xlsx') => {
  // Preparar dados para exportação com formato compatível para reimportação
  const exportData = data.map(row => {
    // Garantir que data está em formato D/M/YY (sem zeros à esquerda desnecessários)
    let dataFormatada = row.data;
    if (row.data && row.data.includes('-')) {
      const [ano, mes, dia] = row.data.split('-');
      const anoAbreviado = ano.substring(2); // Pegar apenas os 2 últimos dígitos do ano
      dataFormatada = `${parseInt(dia)}/${parseInt(mes)}/${anoAbreviado}`;
    }
    
    // Converter tipo: Receita -> Entrada, Despesa -> Saída
    let tipoFormatado = row.tipo;
    if (row.tipo === 'Receita') tipoFormatado = 'Entrada';
    else if (row.tipo === 'Despesa') tipoFormatado = 'Saída';
    
    return {
      'Data': dataFormatada,
      'mês': getMesSigla(row.mes || ''),
      'Ano': row.ano || new Date().getFullYear(),
      'Tipo': tipoFormatado,
      'Descrição': row.descricao,
      'Valor': formatarValor(row.valor)
    };
  });

  // Criar workbook e worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(exportData);

  // Ajustar largura das colunas
  const columnWidths = [
    { wch: 12 }, // Data
    { wch: 8 },  // mês
    { wch: 6 },  // Ano
    { wch: 12 }, // Tipo
    { wch: 25 }, // Descrição
    { wch: 15 }, // Valor
  ];
  ws['!cols'] = columnWidths;

  // Adicionar worksheet ao workbook com nome correto
  XLSX.utils.book_append_sheet(wb, ws, 'LANÇAMENTOS');

  // Gerar arquivo e fazer download
  XLSX.writeFile(wb, fileName);
};

export const generateTemplateExcel = () => {
  // Criar workbook
  const wb = XLSX.utils.book_new();
  
  // Criar planilha com estrutura exata da PlanilhaEduCaH.xlsx
  const ws = XLSX.utils.aoa_to_sheet([
    ['PLANILHA DE CONTROLE FINANCEIRO'], // Linha 1
    ['LANÇAMENTOS'], // Linha 2 - Nome da aba
    [], // Linha 3
    [], // Linha 4
    [], // Linha 5
    [], // Linha 6
    [], // Linha 7
    [], // Linha 8
    [], // Linha 9
    [], // Linha 10
    [], // Linha 11
    [], // Linha 12
    ['Data', 'mês', 'Ano', 'Tipo', 'Descrição', 'Valor'], // Linha 13 - Cabeçalhos
    ['1/1/25', 'JAN', 2025, 'Entrada', 'Exemplo', 0] // Linha 14 - Exemplo com valores zerados
  ]);

  // Ajustar largura das colunas
  ws['!cols'] = [
    { wch: 12 }, // Data
    { wch: 8 },  // mês
    { wch: 6 },  // Ano
    { wch: 12 }, // Tipo
    { wch: 25 }, // Descrição
    { wch: 15 }, // Valor
  ];

  // Adicionar worksheet ao workbook
  XLSX.utils.book_append_sheet(wb, ws, 'LANÇAMENTOS');

  // Gerar arquivo e fazer download
  XLSX.writeFile(wb, 'educash-template.xlsx');
};
