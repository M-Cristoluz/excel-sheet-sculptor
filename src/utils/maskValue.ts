/**
 * Mascara valores financeiros para proteção de privacidade
 */
export const maskCurrency = (value: number | string, show: boolean): string => {
  if (show) {
    if (typeof value === 'number') {
      return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return value.toString();
  }
  return 'R$ •••,••';
};

/**
 * Mascara números simples
 */
export const maskNumber = (value: number, show: boolean): string => {
  if (show) {
    return value.toString();
  }
  return '•••';
};
