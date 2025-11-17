import { PeriodType } from "@/components/PeriodFilter";

interface DataRow {
  data: string;
  [key: string]: any;
}

/**
 * Filtra dados baseado no período selecionado
 */
export const filterDataByPeriod = <T extends DataRow>(data: T[], period: PeriodType): T[] => {
  if (period === 'all') return data;

  const now = new Date();
  
  return data.filter(row => {
    if (!row.data) return false;
    
    // Parse date in DD/MM/YYYY or YYYY-MM-DD format
    let itemDate: Date;
    
    if (row.data.includes('/')) {
      const [day, month, year] = row.data.split('/').map(Number);
      const fullYear = year < 100 ? 2000 + year : year;
      itemDate = new Date(fullYear, month - 1, day);
    } else {
      itemDate = new Date(row.data);
    }
    
    // Check if date is valid
    if (isNaN(itemDate.getTime())) return false;
    
    switch (period) {
      case 'week': {
        const oneWeekAgo = new Date(now);
        oneWeekAgo.setDate(now.getDate() - 7);
        return itemDate >= oneWeekAgo && itemDate <= now;
      }
      
      case 'month': {
        return itemDate.getMonth() === now.getMonth() && 
               itemDate.getFullYear() === now.getFullYear();
      }
      
      case 'year': {
        return itemDate.getFullYear() === now.getFullYear();
      }
      
      default:
        return true;
    }
  });
};

/**
 * Obtém o texto descritivo do período
 */
export const getPeriodLabel = (period: PeriodType): string => {
  const now = new Date();
  
  switch (period) {
    case 'week':
      return 'Última semana';
    case 'month':
      return now.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    case 'year':
      return now.getFullYear().toString();
    case 'all':
      return 'Todos os períodos';
    default:
      return '';
  }
};
