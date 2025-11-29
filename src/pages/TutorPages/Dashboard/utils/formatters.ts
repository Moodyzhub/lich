export const formatCurrency = (value: number, compact = true): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    notation: compact ? 'compact' : 'standard',
    maximumFractionDigits: compact ? 1 : 0,
  }).format(value);
};

export const formatNumber = (value: number, compact = false): string => {
  return new Intl.NumberFormat('vi-VN', {
    notation: compact ? 'compact' : 'standard',
    maximumFractionDigits: 1,
  }).format(value);
};

export const formatPercentage = (value: number, decimals = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

export const calculateGrowth = (current: number, previous: number): {
  percentage: number;
  isPositive: boolean;
  text: string;
} => {
  if (!previous || previous === 0) {
    return {
      percentage: 0,
      isPositive: true,
      text: '0%',
    };
  }

  const growth = ((current - previous) / previous) * 100;
  const isPositive = growth >= 0;

  return {
    percentage: Math.abs(growth),
    isPositive,
    text: `${isPositive ? '+' : '-'}${Math.abs(growth).toFixed(1)}%`,
  };
};

export const formatRating = (rating: number): string => {
  return rating.toFixed(1);
};
